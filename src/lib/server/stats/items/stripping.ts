import * as helper from "$lib/server/helper";
import { isEnchanted } from "$lib/shared/helper";
import type { GetItemsItems, ProcessedItem, ProcessedPet, ProcessedSkyBlockItem, ProcessedSkyblockPet } from "$types/stats";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

export function stripItem(item: ProcessedItem | ProcessedPet | null, keys?: string[]): ProcessedSkyBlockItem {
  if (!item || (!item.display_name && !(item as ProcessedItem).tag?.display?.Name)) {
    return {} as ProcessedSkyBlockItem;
  }

  if ((item as ProcessedPet).lore !== undefined) {
    return stripPetData(item as ProcessedPet) as unknown as ProcessedSkyBlockItem;
  }

  const itemData = item as ProcessedItem;
  const output = {
    display_name: itemData.display_name ?? itemData.tag.display.Name ?? "Unknown",
    lore: itemData.tag?.display?.Lore ?? [],
    texture_path: itemData.texture_path,
    containsItems: itemData.containsItems?.map((item) => stripItem(item, keys))
  } as ProcessedSkyBlockItem;

  if (itemData.Count > 1) {
    output.Count = itemData.Count;
  }

  if (itemData.recombobulated) {
    output.recombobulated = itemData.recombobulated;
  }

  if (itemData.rarity && itemData.rarity !== "common") {
    output.rarity = itemData.rarity;
  }

  if (itemData.shiny || itemData.glowing || isEnchanted(itemData) || helper.getId(itemData) === "POTION") {
    output.shiny = true;
  }

  if (itemData.texture_pack && itemData.texture_pack !== "VANILLA") {
    output.texture_pack = itemData.texture_pack;
  }

  if (itemData.extra?.wiki) {
    const { official, fandom } = itemData.extra.wiki;

    if (official || fandom) {
      output.wiki = {};
      if (official) {
        output.wiki.official = official;
      }

      if (fandom) {
        output.wiki.fandom = fandom;
      }
    }
  }

  if (keys?.length) {
    for (const key of keys) {
      const keyName = key.split(".").at(-1) ?? key;
      output[keyName] = getNestedValue(itemData, key);
    }
  }

  return output;
}

function stripPetData(pet: ProcessedPet): ProcessedSkyblockPet {
  const output = {
    display_name: pet.display_name,
    lore: pet.lore,
    type: pet.type,
    rarity: pet.rarity,
    texture_path: pet.texture_path,
    level: pet.level?.level,
    active: pet.active
  } as ProcessedSkyblockPet;

  if (pet.active) {
    output.stats = pet.stats;
  }

  if (pet.extra?.wiki) {
    const { official, fandom } = pet.extra.wiki;

    if (official || fandom) {
      output.wiki = {};
      if (official) {
        output.wiki.official = official;
      }

      if (fandom) {
        output.wiki.fandom = fandom;
      }
    }
  }

  return output;
}

export function stripItems(items: ProcessedItem[] | ProcessedPet[] | null, keys?: string[]): ProcessedSkyBlockItem[] {
  if (!items || items.length === 0) {
    return [];
  }

  return items.map((item) => stripItem(item, keys ?? []));
}

const isToolCategory = (category: string) => ["farming_tools", "mining_tools", "fishing_tools"].includes(category);
const isEquipmentCategory = (category: string) => ["armor", "rift_armor", "equipment", "rift_equipment", "weapons"].includes(category);

export function stripAllItems(items: GetItemsItems) {
  if (items === null) {
    return null;
  }

  return {
    ...Object.entries(items as unknown as GetItemsItems).reduce(
      (acc, [key, value]) => {
        if (!value) {
          acc[key] = [];
          return acc;
        }

        if (isToolCategory(key)) {
          acc[key] = value;
          return acc;
        }

        if (key === "wardrobe") {
          const wardrobeItems = value as GetItemsItems["wardrobe"];
          acc[key] = wardrobeItems.map((set) => stripItems(set));
        } else if (Array.isArray(value) && value.length > 0) {
          acc[key] = stripItems(value as ProcessedItem[]);
        } else {
          const newKey = ((isEquipmentCategory(key) ? key : key) as keyof GetItemsItems).replace("rift_", "");
          const newValue = value as Record<string, unknown>;
          if (!newValue[newKey]) {
            acc[key] = [];
            return acc;
          }

          acc[key] = {
            ...value,
            [newKey]: stripItems(newValue[newKey] as ProcessedItem[])
          };
        }

        return acc;
      },
      {} as Record<string, unknown>
    ),
    pets: null,
    museumItems: null
  };
}

export function stripItemsV3(items: Array<ProcessedItem | ProcessedPet>, keys?: string[]): ProcessedSkyBlockItem[] {
  if (items.length === 0) {
    return [];
  }

  return items.map((item) => stripItemV3(item, keys ?? []));
}

export function stripItemV3(item: ProcessedItem | ProcessedPet, keys?: string[]): ProcessedSkyBlockItem {
  if (!item || (!item.display_name && !(item as ProcessedItem).tag?.display?.Name)) {
    return {} as ProcessedSkyBlockItem;
  }

  if ((item as ProcessedPet).level !== undefined) {
    return stripPetDataV3(item as ProcessedPet) as unknown as ProcessedSkyBlockItem;
  }

  const itemData = item as ProcessedItem;
  const output = {
    texture_path: itemData.texture_path,
    containsItems: itemData.containsItems?.map((item) => stripItemV3(item, keys))
  } as ProcessedSkyBlockItem;

  if (itemData.Count > 1) {
    output.Count = itemData.Count;
  }

  if (itemData.recombobulated) {
    output.recombobulated = itemData.recombobulated;
  }

  if (itemData.rarity && itemData.rarity !== "common") {
    output.rarity = itemData.rarity;
  }

  if (itemData.shiny || itemData.glowing || isEnchanted(itemData) || helper.getId(itemData) === "POTION") {
    output.shiny = true;
  }

  if (itemData.uuid) {
    output.uuid = itemData.uuid;
  }

  if (itemData.isInactive) {
    output.isInactive = itemData.isInactive;
  }

  if (itemData.isUnique) {
    output.isUnique = itemData.isUnique;
  }

  if (keys?.length) {
    for (const key of keys) {
      const keyName = key.split(".").at(-1) ?? key;
      output[keyName] = getNestedValue(itemData, key);
    }
  }

  return output;
}

function stripPetDataV3(pet: ProcessedPet): ProcessedSkyblockPet {
  const output = {
    display_name: pet.display_name,
    // lore: pet.lore,
    //type: pet.type,
    rarity: pet.rarity,
    texture_path: pet.texture_path,
    level: pet.level?.level,
    active: pet.active,
    uuid: pet.uuid
  } as ProcessedSkyblockPet;

  if (pet.active) {
    output.stats = pet.stats;
    output.active = true;
  }

  return output;
}
