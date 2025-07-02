import { building } from "$app/environment";
import { BUKKIT_TO_ID } from "$constants/bukkitToId";
import { updateItemsConstants } from "$constants/update-items";
import type { DatabaseItem } from "$types/stats";
import MONGO from "../mongo";

const headers = { Accept: "application/json", "User-Agent": "SkyCrypt" };
const updateInterval = 1000 * 60 * 60 * 12; // 12 hours
const cacheInternal = 10 * 60 * 1000; // 10 minutes

function getSkinHash(base64: string) {
  let texture = null;
  try {
    texture = JSON.parse(Buffer.from(base64, "base64").toString()).textures.SKIN.url.split("/").pop();
  } catch {
    // Do nothing
  }

  return texture;
}

export async function updateItems() {
  if (building) return;

  try {
    const timeNow = Date.now();
    const cache = await MONGO.collection("items").findOne({});
    if (cache && cache.lastUpdated > Date.now() - cacheInternal) {
      console.info(`[ITEMS] Fetched items in ${(Date.now() - timeNow).toLocaleString()}ms (cached)`);

      await updateItemsConstants();
      return;
    }

    const response = await fetch("https://api.hypixel.net/resources/skyblock/items", {
      headers: headers
    });
    const data = await response.json();

    const items = {} as Record<string, DatabaseItem>;
    for (const item of data.items) {
      const { id, name, tier, category, skin, durability, ...rest } = item;

      const obj = {
        skyblock_id: id,
        id,
        name,
        item_id: BUKKIT_TO_ID[item?.material] || 0,
        ...rest,
        tier: item.tier ? item.tier.toLowerCase() : "common",
        damage: item.durability || 0
      };

      if (category) {
        obj.category = category.toLowerCase();
      }

      if (skin) {
        obj.texture = getSkinHash(skin.value);
      }

      items[id] = obj;
    }

    const output = { lastUpdated: Date.now(), items };

    await MONGO.collection("items").updateOne({}, { $set: output }, { upsert: true });

    console.info(`[ITEMS] Fetched items in ${(Date.now() - timeNow).toLocaleString()}ms`);

    await updateItemsConstants();
  } catch (e) {
    console.error(e);
  }

  setTimeout(updateItems, updateInterval);
}
