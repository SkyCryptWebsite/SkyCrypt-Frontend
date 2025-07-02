/* eslint-disable @typescript-eslint/ban-ts-comment */
import { REDIS } from "$lib/server/db/redis.js";
import { fetchPlayer, getProfile } from "$lib/server/lib.js";
import { getAccessories } from "$lib/server/stats/accessories.js";
import { getBestiary } from "$lib/server/stats/bestiary.js";
import { getDungeons } from "$lib/server/stats/dungeons.js";
import { processItems } from "$lib/server/stats/items/processing.js";
import { getMainItems } from "$lib/server/stats/main_items.js";
import { getMainStats } from "$lib/server/stats/main_stats.js";
import { getPets } from "$lib/server/stats/pets.js";
import { getSlayer } from "$lib/server/stats/slayer.js";
import { getPlayerStats } from "$lib/shared/player_stats.js";
import type { ProcessedItem } from "$types/processed/profile/items";
import { json } from "@sveltejs/kit";

export async function GET({ params, cookies }) {
  const { paramPlayer, paramProfile } = params;

  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");

  const [profile, player] = await Promise.all([getProfile(paramPlayer, paramProfile as string, { cache: true }), fetchPlayer(paramPlayer, { cache: true })]);
  const allItemsRaw = await REDIS.get(`profile:${paramProfile}:${packs.join("")}:items`);
  const items = JSON.parse(allItemsRaw as string);
  for (const inventory of ["talisman_bag", "inventory", "enderchest", "backpack"]) {
    items[inventory] = processItems(items[inventory], inventory, packs, { pack: false, category: false });
  }

  items["backpack"] = items.backpack
    .map((i: ProcessedItem) => i.containsItems ?? [])
    .concat(items.backpack)
    .flat();

  const [stats, mainItes, pets, accessories] = await Promise.all([getMainStats(profile.members[paramPlayer], profile, player, packs), getMainItems(paramProfile, packs), getPets(profile.members[paramPlayer], profile), getAccessories(profile.members[paramPlayer], items, packs)]);

  const userProfile = {
    ...stats,
    ...mainItes,
    ...{ pets },
    ...{ slayer: getSlayer(profile.members[paramPlayer]) },
    ...{ bestiary: getBestiary(profile.members[paramPlayer]) },
    ...{ accessories },
    ...{ dungeons: getDungeons(profile.members[paramPlayer]) }
  };

  const output = {
    skyblock_level: userProfile.skyblock_level?.level,
    // @ts-expect-error
    armor: userProfile.armor?.stats,
    // @ts-expect-error
    equipment: userProfile.equipment?.stats,
    skills: userProfile.skills?.skills,
    // @ts-expect-error
    pets: userProfile.pets.pets?.find((pet) => pet.active)?.stats,
    petScore: userProfile.pets?.petScore?.stats,
    // @ts-expect-error
    slayers: userProfile.slayer?.stats,
    bestiary: userProfile.bestiary?.level,
    accessories: accessories?.stats,
    dungeons: userProfile.dungeons?.level?.level
  };

  const playerStats = getPlayerStats(output);

  return json(playerStats);
}
