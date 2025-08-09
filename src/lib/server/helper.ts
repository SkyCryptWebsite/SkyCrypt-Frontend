import type { Item, ProcessedItem } from "$types/stats";
import { format } from "date-fns";
import { getPrices } from "skyhelper-networth";
import * as constants from "./constants/constants";
import { getTexture } from "./custom_resources";

import { getItemData } from "./helper";

export * from "$lib/server/helper/cache";
export * from "$lib/server/helper/item";
export * from "$lib/shared/helper";

/**
 * Retrieves the ID of a SkyBlock item.
 * @param item The SkyBlock item.
 * @returns The ID of the item, or an empty string if the ID is not found.
 */
export function getId(item: ProcessedItem | Item) {
  return item?.tag?.ExtraAttributes?.id ?? "";
}

export function getTextureValue(item: Item) {
  return item?.tag?.SkullOwner?.Properties?.textures?.at(0)?.Value ?? "";
}

/**
 * Get Minecraft lore without the color and formatting codes
 * @param {string} text lore with color codes
 * @returns {string} lore without color codes
 */
export function getRawLore(text: string) {
  return text.replaceAll(/§[0-9a-fk-or]/g, "");
}

/**
 * @param {string} s
 * @returns {string}
 */
export function titleCase(s: string) {
  return s
    .toLowerCase()
    .replaceAll("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function rarityNameToInt(string: string) {
  return constants.RARITIES.indexOf(string.toLowerCase());
}

/**
 * Returns the price of the item. Returns 0 if the item is not found or if the item argument is falsy.
 * @param {string} item - The ID of the item to retrieve the price for.
 * @returns {number}
 * @returns {Promise<number>}
 */
export async function getItemPrice(item: string | ProcessedItem) {
  if (!item) {
    return 0;
  }

  const prices = (await getPrices(true)) as Record<string, number>;
  if (typeof item === "string") {
    return prices[item.toLowerCase()] ?? 0;
  }

  return prices[getId(item).toLowerCase()] ?? 0;
}

/**
 * Adds lore to an item's display tag.
 *
 * @param {Item} item - The item to add lore to.
 * @param {string|string[]} lore - The lore to add to the item. If a string is provided, it will be converted to an array.
 * @returns {Item} The modified item.
 */
export function addToItemLore(item: Partial<ProcessedItem>, lore: string | string[]) {
  if (typeof lore === "string") {
    lore = [lore];
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  item.tag ??= {};
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  item.tag.display ??= {};
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  item.tag.display.Lore ??= [];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  item.tag.display.Lore = item.tag.display.Lore.concat(lore);

  return item;
}

/**
 * Applies a resource pack to an item, modifying its texture and animation properties if a custom texture is found.
 *
 * @param {Item} item - The item to apply the resource pack to.
 * @param {string[]} packs - The ID or array of IDs of the resource pack(s) to search for the custom texture.
 * @returns {Promise<Item>} A Promise that resolves with the modified item.
 */
export async function applyResourcePack(item: ProcessedItem, packs: string[]) {
  if (item.texture_path) {
    return item;
  }

  // ? NOTE: we're ignoring enchanted books because they're quite expensive to render and not really worth the performance hit
  if (item.tag?.ExtraAttributes?.id === "ENCHANTED_BOOK") {
    const enchantedBookItem = getItemData({ id: 403 }) as ProcessedItem;
    const texture = getTexture(enchantedBookItem);
    item.texture_path = texture?.path ?? "";
    return item;
  }

  // CUSTOM TEXTURES
  const customTexture = getTexture(item, { pack_ids: packs });
  if (customTexture?.path) {
    // ? NOTE: we're ignoring Vanilla leather armor because it's render using /leather/ endpoint (Coloring support)
    const ignoreCustomTexture = customTexture && customTexture.path && customTexture.path.includes("/Vanilla/") && customTexture.path.includes("leather_");
    // ? NOTE: we're ignoring Skull-3.png because it's render using /head/ endpoint (Player Skull support)
    const hasHeadTexture = customTexture && customTexture.path && customTexture.path.endsWith("skull-3.png") && item.tag?.SkullOwner?.Properties?.textures?.length > 0;
    if (!ignoreCustomTexture && !hasHeadTexture) {
      item.texture_path = customTexture.path;
      item.texture_pack = customTexture.pack?.config?.id;
    }
  }

  if (!item.texture_path) {
    if (item.tag?.SkullOwner?.Properties?.textures?.length > 0) {
      // PLAYER SKULLS
      try {
        const json = JSON.parse(Buffer.from(item.tag.SkullOwner.Properties.textures[0].Value, "base64").toString());
        const url = json.textures.SKIN.url;
        const uuid = url.split("/").pop();

        item.texture_path = `/api/head/${uuid}`;
      } catch (e) {
        console.error(e);
      }
    } else if (typeof item.id === "number" && item.id >= 298 && item.id <= 301) {
      // COLORED LEATHER ARMOR
      const color = (item.tag?.display?.color as unknown as number)?.toString(16).padStart(6, "0") ?? "955e3b";
      const type = ["helmet", "chestplate", "leggings", "boots"][item.id - 298];

      item.texture_path = `/api/leather/${type}/${color}`;
    }
  }

  return item;
}

/**
 * floors a number to a certain number of decimal places
 * @param {number} num the number to be floored
 * @param {number} decimals the number of decimal places to floor to
 * @returns {number} the floored number
 */
export function floor(num: number, decimals = 0) {
  return Math.floor(Math.pow(10, decimals) * num) / Math.pow(10, decimals);
}

/**
 * rounds a number to a certain number of decimal places
 * @param {number} num the number to be rounded
 * @param {number} decimals the number of decimal places to round to
 * @returns {number} the rounded number
 */
export function round(num: number, decimals = 0) {
  return Math.round(Math.pow(10, decimals) * num) / Math.pow(10, decimals);
}

/**
 * ceils a number to a certain number of decimal places
 * @param {number} num the number to be ceiled
 * @param {number} decimals the number of decimal places to ceil to
 * @returns {number} the ceiled number
 */
export function ceil(num: number, decimals = 0) {
  return Math.ceil(Math.pow(10, decimals) * num) / Math.pow(10, decimals);
}

export function getHeadTextureUUID(value: string) {
  const json = JSON.parse(Buffer.from(value, "base64").toString());
  const url = json.textures.SKIN.url;
  const uuid = url.split("/").pop();

  return uuid;
}

export function formatTimestamp(timestamp: number, formatType: string = "MMM d, yyyy, h:mm a") {
  if (new Date(Number(timestamp)).toString() == "Invalid Date") {
    timestamp = new Date(timestamp).getTime();
  }

  if (new Date(Number(timestamp)).toString() == "Invalid Date") {
    return "Invalid Date";
  }

  return format(new Date(Number(timestamp)), formatType);
}

export function sortByRarity(object: Record<string, unknown>) {
  return Object.keys(object)
    .sort((a, b) => constants.RARITIES.indexOf(a) - constants.RARITIES.indexOf(b))
    .reduce(
      (acc, key) => {
        acc[key] = object[key];
        return acc;
      },
      {} as Record<string, unknown>
    );
}

export function formatXPTable(xpTable: number[]) {
  const output = {} as Record<number, number>;
  for (const [level, xp] of Object.entries(xpTable)) {
    output[Number(level) + 1] = xp;
  }

  return output;
}

export function getKey(key: string): string | number {
  const intKey = Number(key);

  if (!isNaN(intKey)) {
    return intKey;
  }

  return key;
}

export function hasPath<T extends object>(obj: T, ...keys: (string | number)[]): boolean {
  if (obj == null) {
    return false;
  }

  let loc: unknown = obj;

  for (let i = 0; i < keys.length; i++) {
    if (typeof loc === "object" && loc !== null) {
      loc = (loc as Record<string, unknown>)[getKey(keys[i] as string)];
    } else {
      return false;
    }

    if (loc === undefined) {
      return false;
    }
  }

  return true;
}

export function getPath<T extends object, K = unknown>(obj: T, ...keys: (string | number)[]): K | undefined {
  if (obj == null) {
    return undefined;
  }

  let loc: unknown = obj;

  for (let i = 0; i < keys.length; i++) {
    if (typeof loc === "object" && loc !== null) {
      loc = (loc as Record<string, unknown>)[getKey(keys[i] as string)];
    } else {
      return undefined;
    }

    if (loc === undefined) {
      return undefined;
    }
  }

  return loc as K;
}
