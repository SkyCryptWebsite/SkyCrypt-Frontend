// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { getArmor } from "$lib/server/stats/items/armor";
import { getEquipment } from "$lib/server/stats/items/equipment";
import { processItems } from "$lib/server/stats/items/processing";
import { getWardrobe } from "$lib/server/stats/items/wardrobe";
import type { GetItemsItems, RawItems } from "$types/global";
import { addToItemLore, formatNumber } from "../helper";
import { sendWebhookMessage } from "../lib";
import { getSkilllTools, getWeapons } from "./items/category";
import { getMuseumItems } from "./museum";

export function getItems(rawItems: RawItems, networthCategories: Record<string, number>, packs: string[]): GetItemsItems {
  try {
    const items = {};
    for (const [key, value] of Object.entries(rawItems)) {
      if (key.includes("museum")) {
        continue;
      }

      const processed = processItems(value, key, packs);
      items[key] = processed;
    }

    const output = { backpack: [] };
    for (const [key, value] of Object.entries(items)) {
      if (key.startsWith("museum")) {
        continue;
      }

      if (!key.startsWith("storage")) {
        output[key] = value;
        continue;
      }

      if (key.startsWith("storage_icon")) {
        const backpackIndex = key.split("_").at(-1);
        const iconKey = `storage_icon_${backpackIndex}`;
        const backpackKey = `storage_${backpackIndex}`;

        const backpackIcon = items[iconKey];
        const backpack = items[backpackKey];
        if (backpackIcon) {
          const price = (networthCategories[key] ?? 0) + (networthCategories[backpackKey] ?? 0);

          output.backpack.push({
            ...backpackIcon[0],
            containsItems: backpack
          });

          if (price !== networthCategories[iconKey]) {
            addToItemLore(output.backpack.at(-1), ["", `§7Total Value: §6${Math.round(price).toLocaleString()} Coins §7(§6${formatNumber(price)}§7)`]);
          }
        }
      }
    }

    output.armor = getArmor(output.armor);
    output.equipment = getEquipment(output.equipment);
    output.wardrobe = getWardrobe(output.wardrobe);
    output.rift_armor = getArmor(output.rift_armor);
    output.rift_equipment = getEquipment(output.rift_equipment);

    const allItems = Object.values(output).flat();
    output.weapons = getWeapons(allItems);
    output.farming_tools = getSkilllTools("farming", allItems);
    output.mining_tools = getSkilllTools("mining", allItems);
    output.fishing_tools = getSkilllTools("fishing", allItems);

    for (const [key, value] of Object.entries(rawItems.museumItems.items)) {
      rawItems.museumItems.items[key].items = processItems(value.items.data, key, packs).filter((item) => item && item.display_name);
    }

    for (const [key, value] of Object.entries(rawItems.museumItems.special)) {
      rawItems.museumItems.special[key].items = processItems(value.items.data, key, packs);
    }

    output.museum = rawItems.museumItems ? getMuseumItems(rawItems.museumItems) : null;

    return output;
  } catch (error) {
    console.error(error);
    sendWebhookMessage(error, { uuid: userProfile.player_id });
    return null;
  }
}
