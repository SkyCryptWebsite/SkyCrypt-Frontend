import { REDIS } from "$lib/server/db/redis.js";
import { getWeapons } from "$lib/server/stats/items/category.js";
import { processItems } from "$lib/server/stats/items/processing.js";
import * as simdjson from "@nozbe/simdjson";
import { json } from "@sveltejs/kit";

export async function GET({ params, cookies }) {
  const { paramProfile } = params;

  const allItemsRaw = await REDIS.get(`profile:${paramProfile}:items`);
  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");
  const items = simdjson.parse(allItemsRaw as string);

  const allItems = [];
  const validInventories = ["backpack", "inventory", "enderchest"];
  for (const inventory of validInventories) {
    const processedItems = processItems(items[inventory], inventory, packs, { pack: false, category: false });
    allItems.push(...processedItems);
  }

  const weapons = getWeapons(allItems);

  return json({
    weapons: weapons.weapons,
    highest_priority_weapon: weapons.highest_priority_weapon
  });
}
