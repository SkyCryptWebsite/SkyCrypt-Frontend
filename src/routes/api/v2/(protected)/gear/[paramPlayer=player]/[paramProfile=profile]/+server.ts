import { REDIS } from "$lib/server/db/redis";
import { getWeapons } from "$lib/server/stats/items/category";
import { processItems } from "$lib/server/stats/items/processing";
import { getMainItems } from "$lib/server/stats/main_items.js";
import { json } from "@sveltejs/kit";

export async function GET({ params, cookies }) {
  const { paramProfile = null } = params;

  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");

  const [armor, allItemsRaw] = await Promise.all([getMainItems(paramProfile as string, packs), REDIS.get(`profile:${paramProfile}:${packs.join("")}:items`)]);
  const items = JSON.parse(allItemsRaw as string);

  const allItems = [];
  const validInventories = ["backpack", "inventory", "enderchest"];
  for (const inventory of validInventories) {
    const processedItems = await processItems(items[inventory], inventory, packs, { pack: false, category: false });
    allItems.push(...processedItems);
  }

  const weapons = getWeapons(allItems);

  return json({ ...armor, weapons });
}
