import { REDIS } from "$lib/server/db/redis.js";
import { fetchPlayer, getProfile } from "$lib/server/lib.js";
import { getEnchanting } from "$lib/server/stats/enchanting";
import { getFarming } from "$lib/server/stats/farming";
import { getFishing } from "$lib/server/stats/fishing.js";
import { getSkillTools } from "$lib/server/stats/items/category.js";
import { processItems } from "$lib/server/stats/items/processing";
import { getMining } from "$lib/server/stats/mining.js";
import * as simdjson from "@nozbe/simdjson";
import { json } from "@sveltejs/kit";

export async function GET({ params, cookies }) {
  const { paramPlayer, paramProfile } = params;

  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");
  const [profile, player, allItemsRaw] = await Promise.all([getProfile(paramPlayer, paramProfile as string, { cache: true }), fetchPlayer(paramPlayer, { cache: true }), REDIS.get(`profile:${paramProfile}:items`)]);
  const items = simdjson.parse(allItemsRaw as string);

  const allItems = [];
  const validInventories = ["backpack", "inventory", "enderchest"];
  for (const inventory of validInventories) {
    const processedItems = processItems(items[inventory], inventory, packs, { pack: false, category: false });
    allItems.push(...processedItems);
  }

  const mining = getMining(profile.members[paramPlayer], player, packs);
  const farming = getFarming(profile, profile.members[paramPlayer]);
  const enchanting = getEnchanting(profile.members[paramPlayer]);
  const fishing = getFishing(profile.members[paramPlayer]);

  return json({
    mining: {
      ...mining,
      tools: getSkillTools("mining", allItems)
    },
    farming: {
      ...farming,
      tools: getSkillTools("farming", allItems)
    },
    enchanting: enchanting,
    fishing: {
      ...fishing,
      tools: getSkillTools("fishing", allItems)
    }
  });
}
