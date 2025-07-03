import { REDIS } from "$lib/server/db/redis.js";
import { getWeapons } from "$lib/server/stats/items/category.js";
import { processItems } from "$lib/server/stats/items/processing.js";
import { json } from "@sveltejs/kit";

export async function GET({ params, cookies }) {
  const { paramProfile } = params;

  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");
  const allItemsRaw = await REDIS.get(`profile:${paramProfile}:${packs.join("")}:items`);
  const items = JSON.parse(allItemsRaw as string);

  const allItems = [];
  const validInventories = ["backpack", "inventory", "enderchest"];
  for (const inventory of validInventories) {
    const processedItems = await processItems(items[inventory], inventory, packs, { pack: false, category: false });
    allItems.push(...processedItems);
  }

  const weapons = getWeapons(allItems);

  return json({
    weapons: weapons.weapons,
    highest_priority_weapon: weapons.highest_priority_weapon
  });
}
