import { REDIS } from "$lib/server/db/redis";
import { getProfile } from "$lib/server/lib";
import type { ProcessedSkyBlockItem } from "$types/stats.js";
import * as simdjson from "@nozbe/simdjson";
import { json } from "@sveltejs/kit";
import { getPreDecodedNetworth } from "skyhelper-networth";

export async function GET({ params }) {
  const { paramPlayer, paramProfile } = params;
  const [profile, allItemsRaw] = await Promise.all([getProfile(paramPlayer, paramProfile as string, { cache: true }), REDIS.get(`profile:${paramProfile}:items`)]);
  const allItems = simdjson.parse(allItemsRaw as string);

  const museumItems = [...Object.values(allItems?.museum?.items ?? {}), ...(allItems?.museum?.specialItems ?? [])]
    .filter((item) => item && item.borrowing === false)
    .map((item) => item.items)
    .flat();

  const userProfile = profile.members[paramPlayer];

  const bank = profile.banking?.balance ?? 0;
  const networthOptions = {
    onlyNetworth: true,
    returnItemData: false,
    cache: true,
    v2Endpoint: true
  };

  const items = {
    armor: allItems?.armor ?? [],
    equipment: allItems?.equipment ?? [],
    wardrobe: allItems?.wardrobe.flat() ?? [],
    inventory: allItems?.inventory ?? [],
    enderchest: allItems?.enderchest ?? [],
    accessories: allItems?.talisman_bag ?? [],
    personal_vault: allItems?.personal_vault ?? [],
    storage: allItems?.backpack ? allItems?.backpack.concat(allItems?.backpack.map((item: ProcessedSkyBlockItem) => item.containsItems ?? []).flat()).flat() : [],
    fishing_bag: allItems?.fishing_bag ?? [],
    potion_bag: allItems?.potion_bag ?? [],
    museum: museumItems ?? []
  };

  const networth = await getPreDecodedNetworth(userProfile, items, bank, networthOptions);

  return json(networth);
}
