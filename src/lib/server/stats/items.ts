// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { GetItemsItems, Member, MuseumRaw } from "$types/global";
import { REDIS } from "../db/redis";
import { sendWebhookMessage } from "../lib";
import { decodeItems } from "./items/decoding";
import { decodeMusemItems } from "./items/museum";
import { processItems } from "./items/processing";

export async function getItems(userProfile: Member, userMuseum: MuseumRaw | null, packs: string[], profileId: string): Promise<GetItemsItems> {
  try {
    const INVENTORY = userProfile.inventory;
    const RIFT_INVENTORY = userProfile.rift?.inventory;
    const outputPromises = {
      // INVENTORIES
      inventory: INVENTORY?.inv_contents?.data ?? "",
      enderchest: INVENTORY?.ender_chest_contents?.data ?? "",
      armor: INVENTORY?.inv_armor?.data ?? "",
      equipment: INVENTORY?.equipment_contents?.data ?? "",
      personal_vault: INVENTORY?.personal_vault_contents?.data ?? "",
      wardrobe: INVENTORY?.wardrobe_contents?.data ?? "",

      // RIFT
      rift_inventory: RIFT_INVENTORY?.inv_contents?.data ?? "",
      rift_enderchest: RIFT_INVENTORY?.ender_chest_contents?.data ?? "",
      rift_armor: RIFT_INVENTORY?.inv_armor?.data ?? "",
      rift_equipment: RIFT_INVENTORY?.equipment_contents?.data ?? "",

      // BAGS
      potion_bag: INVENTORY?.bag_contents?.potion_bag?.data ?? "",
      talisman_bag: INVENTORY?.bag_contents?.talisman_bag?.data ?? "",
      fishing_bag: INVENTORY?.bag_contents?.fishing_bag?.data ?? "",
      // sacks_bag: INVENTORY?.bag_contents?.sacks_bag?.data ?? "",
      quiver: INVENTORY?.bag_contents?.quiver?.data ?? "",

      // BACKPACKS
      ...Object.entries(INVENTORY?.backpack_contents ?? {}).reduce((acc, [key, value]) => {
        acc[`backpack_${key}`] = value.data ?? "";
        return acc;
      }, {}),
      ...Object.entries(INVENTORY?.backpack_icons ?? {}).reduce((acc, [key, value]) => {
        acc[`backpack_icon_${key}`] = value.data ?? "";
        return acc;
      }, {})
    };

    const allItems = [];
    const entries = Object.entries(outputPromises);
    const values = entries.map(([_, value]) => value);
    const decodedItems = await decodeItems(values);
    const newItems = entries.map(([key, _], idx) => [key, decodedItems[idx]]);

    const output = { backpack: [] };
    const backpackIconMap = new Map(newItems.filter(([key]) => key.startsWith("backpack_icon_")));
    for (const [key, value] of newItems) {
      if (!key.includes("backpack")) {
        output[key] = value;
        continue;
      }

      if (key.startsWith("backpack_") && !key.includes("icon")) {
        const backpackIndex = key.split("_").pop();
        const iconKey = `backpack_icon_${backpackIndex}`;
        const backpackIcon = backpackIconMap.get(iconKey)[0];

        backpackIcon.extra = { source: `backpack_icon_${backpackIndex}` };
        allItems.push(backpackIcon);

        if (backpackIcon) {
          output.backpack.push({
            ...backpackIcon,
            containsItems: processItems(value, "backpack", packs)
          });

          /*const filteredItems = value.filter((item) => item.tag || item.exp);
          const itemNetworthPromises = filteredItems.map((item) => getItemNetworth(item, { cache: true })).concat(getItemNetworth(backpackIcon));
          const itemNetworth = await Promise.all(itemNetworthPromises);
          const totalValue = itemNetworth.reduce((acc, cur) => acc + (cur?.price ?? 0), 0);

          addToItemLore(output.backpack.at(-1), ["", `§7Total Value: §6${Math.round(totalValue).toLocaleString()} Coins §7(§6${formatNumber(totalValue)}§7)`]);
          */
        }
      }
    }

    // output.museumItems = userMuseum ? await decodeMusemItems(userMuseum, packs) : null;

    /*
    output.armor = getArmor(output.armor);
    output.equipment = getEquipment(output.equipment);
    output.wardrobe = getWardrobe(output.wardrobe);
    output.rift_armor = getArmor(output.rift_armor);
    output.rift_equipment = getEquipment(output.rift_equipment);

    const allItems = Object.values(output).flat();
    output.weapons = getWeapons(allItems);
    output.farming_tools = getSkillTools("farming", allItems);
    output.mining_tools = getSkillTools("mining", allItems);
    output.fishing_tools = getSkillTools("fishing", allItems);
    output.pets = getPets(allItems);

    const museum = output.museumItems ? getMuseumItems(output.museumItems) : null;
    output.museumItems = [...Object.values(museum?.museumItems?.items ?? {}), ...(museum?.museumItems?.specialItems ?? [])]
      .filter((item) => item && item.borrowing === false)
      .map((item) => item.items)
      .flat();
    output.museum = museum?.inventory ?? [];

    */

    /*

    const museumItems = userMuseum ? await decodeMusemItems(userMuseum, packs) : null;
    const allMuseumItems = [...Object.values(museumItems?.items ?? {}), ...(museumItems?.specialItems ?? [])]
      .filter((item) => item && item.borrowing === false)
      .map((item) => item.items)
      .flat();

    const museum = museumItems ? getMuseumItems(museumItems) : null;
    output.museum = museum?.inventory;

    const museumInventory = museum?.inventory ?? [];
    for (const item of museumInventory.concat(museumInventory.map((i) => i.containsItems)).flat()) {
      if (!item) {
        continue;
      }

      item.uuid = v4();
      // allItems.push(item);
    }
      
    

    
    REDIS.set(`profile:${profileId}:allMuseum`, JSON.stringify(allMuseumItems), "EX", 60 * 5); // 5 minutes cache
    */

    // REDIS.set(`items:${profileId}:all`, JSON.stringify(allItems), "EX", 60 * 5); // 5 minutes cache
    // REDIS.set(`items:${profileId}:all:object`, JSON.stringify(output), "EX", 60 * 5);

    // ? NOTE: Cache /api/v2/armor data in the background
    const mainItems = { armor: output.armor, equipment: output.equipment, wardrobe: output.wardrobe };
    for (const key in mainItems) {
      mainItems[key] = processItems(mainItems[key], key, packs, { category: false, pack: false });
    }

    REDIS.set(`profile:${profileId}:${packs.join("")}:main_items`, JSON.stringify(mainItems), { EX: 60 * 5 });

    // NOTE: Timestamps are stringified to prevent issues with Redis or JSON serialization, as they may not handle large numbers (e.g., BigInt) correctly.
    for (const inventory of Object.values(output)) {
      for (const item of inventory) {
        if (item.tag?.ExtraAttributes?.timestamp) {
          item.tag.ExtraAttributes.timestamp = item.tag.ExtraAttributes.timestamp.toString();
        }
      }
    }

    // ? Museum
    output.museum = userMuseum ? await decodeMusemItems(userMuseum, packs) : null;
    REDIS.set(`profile:${profileId}:${packs.join("")}:items`, JSON.stringify(output), { EX: 60 * 5 });

    return output;
  } catch (error) {
    console.error(error);
    sendWebhookMessage(error, { uuid: userProfile.player_id });
    return null;
  }
}
