import { building } from "$app/environment";
import MONGO from "$lib/server/db/mongo";
import { ITEMS } from "$lib/shared/constants/items";
import type { DatabaseItem } from "$types/global";

export async function updateItemsConstants() {
  if (building) return;

  const timeNow = Date.now();
  const items = await MONGO.collection("items").findOne({});
  if (items?.items === undefined) {
    return;
  }

  for (const item of Object.values(items.items)) {
    const skyblockItem = item as DatabaseItem;
    if (skyblockItem.skyblock_id === undefined) {
      return;
    }

    ITEMS.set(skyblockItem.skyblock_id, skyblockItem);
  }

  console.log(`[ITEMS] Updated items in ${(Date.now() - timeNow).toLocaleString()}ms`);
}

setTimeout(updateItemsConstants, 1000 * 60 * 60 * 12); // 12 hours
