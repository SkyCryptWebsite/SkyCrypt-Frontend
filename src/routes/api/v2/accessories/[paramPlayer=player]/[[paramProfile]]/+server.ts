import { REDIS } from "$lib/server/db/redis.js";
import { getProfile } from "$lib/server/lib";
import { getAccessories } from "$lib/server/stats/accessories.js";
import { processItems } from "$lib/server/stats/items/processing.js";
import { stripItems } from "$lib/server/stats/items/stripping.js";
import type { ProcessedItem } from "$types/stats.js";
import { json } from "@sveltejs/kit";

export async function GET({ params, cookies }) {
  const { paramPlayer, paramProfile } = params;
  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");

  const allItemsRaw = await REDIS.get(`profile:${paramProfile}:items`);
  const items = JSON.parse(allItemsRaw as string);
  for (const inventory of ["talisman_bag", "inventory", "enderchest", "backpack"]) {
    items[inventory] = processItems(items[inventory], inventory, packs, { pack: false, category: false });
  }

  items["backpack"] = items.backpack
    .map((i: ProcessedItem) => i.containsItems ?? [])
    .concat(items.backpack)
    .flat();

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const accessories = await getAccessories(profile.members[paramPlayer], items, packs);
  if (!accessories) {
    return json({ error: "No items found in profile" }, { status: 404 });
  }

  accessories.accessories = stripItems(accessories.accessories as unknown as ProcessedItem[], ["isInactive"]);
  accessories.upgrades = stripItems(accessories.upgrades as unknown as ProcessedItem[]);
  accessories.missing = stripItems(accessories.missing as unknown as ProcessedItem[]);

  return json(accessories);
}
