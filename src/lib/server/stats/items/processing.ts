import * as constants from "$lib/server/constants/constants";
import * as helper from "$lib/server/helper";

import type { Item, ProcessedItem } from "$types/stats";

import { NEU_ITEMS } from "$lib/server/helper/NotEnoughUpdates/parseNEURepository";
import { addLevelableEnchantmentsToLore, parseItemGems } from "./helper";

export function itemSorter(a: ProcessedItem, b: ProcessedItem) {
  if (a.rarity && b.rarity && a.rarity !== b.rarity) {
    return constants.RARITIES.indexOf(b.rarity) - constants.RARITIES.indexOf(a.rarity);
  }

  if (a.extra.source === "inventory" && b.extra.source !== "inventory") {
    return -1;
  }

  if (a.extra.source !== "inventory" && b.extra.source === "inventory") {
    return 1;
  }

  return a.display_name.localeCompare(b.display_name);
}

const RARITY_PATTERN = new RegExp(`^(?<recomb>a )?(?<shiny>SHINY )?(?:(?<rarity>${constants.RARITIES.map((x) => x.replaceAll("_", " ").toUpperCase()).join("|")}) ?)(?<dungeon>DUNGEON )?(?<type>[A-Z ]+)?(?<recomb2>a)?$`);
export function parseItemTypeFromLore(lore: string[], item: Item) {
  let match = null;
  for (const line of lore.reverse()) {
    match = RARITY_PATTERN.exec(line);

    if (match) {
      break;
    }
  }

  if (match == null) {
    return {
      categories: [],
      rarity: null,
      recombobulated: null,
      dungeon: null,
      shiny: null
    };
  }

  const r = match.groups as {
    rarity: string;
    type: string;
    recomb: string;
    recomb2: string;
    dungeon: string;
    shiny: string;
  };
  return {
    categories: r.type ? getCategories(r.type.trim().toLowerCase(), item) : [],
    rarity: r.rarity.replaceAll(" ", "_").toLowerCase(),
    recombobulated: !!r.recomb && !!r.recomb2,
    dungeon: !!r.dungeon,
    shiny: !!r.shiny
  };
}

function getCategories(type: string, item: Item) {
  const categories = [] as string[];

  const enchantments = item.tag.ExtraAttributes.enchantments || {};
  Object.keys(enchantments).forEach((enchantment) => Object.entries(constants.ENCHANTMENTS_TO_CATEGORIES).forEach(([category, enchantmentList]) => enchantmentList.includes(enchantment) && categories.push(category)));

  return [...new Set(categories.concat(constants.TYPE_TO_CATEGORIES[type as keyof typeof constants.TYPE_TO_CATEGORIES]))];
}

// options = ignore that part
export function processItems(items: ProcessedItem[], source: string, packs: string[], options: { pack?: boolean; category?: boolean }): ProcessedItem[] {
  for (const item of items) {
    if (!item.tag?.ExtraAttributes?.id && item.exp === undefined) {
      continue;
    }

    // POTIONS
    if (item.id == 373) {
      const color = constants.POTION_COLORS[item.Damage % 16];
      const type = item.Damage & 16384 ? "splash" : "normal";

      item.texture_path = `/api/potion/${type}/${color}`;
    }

    if (!item.extra?.source) {
      item.extra = { source };
    }

    if (!options?.pack) {
      helper.applyResourcePack(item, packs);
    }

    if (item.tag?.display?.Name != undefined) {
      item.display_name = item.tag.display.Name;
    }

    // Lore stuff
    const itemLore = item?.tag?.display?.Lore ?? [];
    const loreRaw = [...itemLore];
    const lore = loreRaw != null ? loreRaw.map((a) => (a = helper.getRawLore(a))) : [];

    item.rarity = null;
    item.categories = [];
    if (lore.length > 0 && !options?.category) {
      // item categories, rarity, recombobulated, dungeon, shiny
      const itemType = parseItemTypeFromLore(lore, item);

      for (const key in itemType) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        item[key] = itemType[key as keyof typeof itemType];
      }
    }

    // Fix custom maps texture, happens when player is inside of Dungeons
    if (item.id == 358) {
      item.id = 395;
      item.Damage = 0;
    }

    if (itemLore.length > 0 && item.tag.ExtraAttributes) {
      if (item.tag.ExtraAttributes.rarity_upgrades) {
        itemLore.push("§8(Recombobulated)");
      }

      if (item.tag.ExtraAttributes.timestamp) {
        itemLore.push("", `§7Obtained: §c${helper.formatTimestamp(item.tag.ExtraAttributes.timestamp)}`);
      }

      if (item.tag?.display?.color) {
        const hex = (item.tag.display.color as unknown as number).toString(16).padStart(6, "0");
        itemLore.push("", `§7Color: #${hex.toUpperCase()}`);
      }

      if (item.tag.ExtraAttributes.gems) {
        itemLore.push("", "§7Applied Gemstones:", ...parseItemGems(item.tag.ExtraAttributes.gems, item.rarity ?? "common").map((gem) => `§7 - ${gem.lore}`));
      }

      if (Object.keys(constants.ENCHANTMENT_LADDERS).some((e) => item.tag.ExtraAttributes[e as keyof typeof item.tag.ExtraAttributes])) {
        for (const [key, constant] of Object.entries(constants.ENCHANTMENT_LADDERS)) {
          const id = key as keyof typeof item.tag.ExtraAttributes;
          if (!item.tag.ExtraAttributes[id]) {
            continue;
          }

          addLevelableEnchantmentsToLore(item.tag.ExtraAttributes[id] as number, constant, itemLore);
        }
      }
    }

    /*if (item.tag || item.exp !== undefined) {
      try {
        const ITEM_PRICE = await getItemNetworth(item, { cache: true });
        if (ITEM_PRICE?.price > 0) {
          itemLore.push("", `§7Item Value: §6${Math.round(ITEM_PRICE.price).toLocaleString()} Coins §7(§6${helper.formatNumber(ITEM_PRICE.price)}§7)`);
        }
      } catch (error) {
        console.log(error);
        itemLore.push("", `§7Item Value: §cAn error occurred while calculating the value of this item.`);
      }
    }*/

    const NEUItem = NEU_ITEMS.get(helper.getId(item));
    if (NEUItem?.info) {
      const [link1, link2] = NEUItem.info;
      const isFandom = link1?.includes("hypixel-skyblock.fandom");

      item.extra.wiki = {
        fandom: (isFandom ? link1 : link2) ?? null,
        official: (isFandom ? link2 : link1) ?? null
      };
    }
  }

  return items;
}
