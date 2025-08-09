import type { ItemTexture, OutputTexture, ResourcePack } from "$types/custom-resources";
import type { Item, ProcessedItem, getTextureParams } from "$types/processed/profile/items";
import fs from "fs-extra";
import path from "path";
import { getCacheFilePath, getCacheFolderPath, getFolderPath, getId, getPath, getTextureValue, hasPath, loadPackConfigs } from "./helper";

const FOLDER_PATH = getFolderPath();

const CACHE_FOLDER_PATH = getCacheFolderPath();
const RESOURCE_PACKS_CACHE_FILE = getCacheFilePath(CACHE_FOLDER_PATH, "json", "resource_packs", "json");

let resourcePacks: ResourcePack[] = [];
export async function init() {
  console.info(`[CUSTOM-RESOURCES] Custom Resources loading started.`);
  const timeNow = performance.now();

  if (!fs.existsSync(RESOURCE_PACKS_CACHE_FILE)) {
    console.error("[CUSTOM-RESOURCES] Resource packs cache file does not exist. Please run scripts/formatResourcePacks.ts");
    process.exit(1);
  }

  const resourcePacksContent = fs.readFileSync(RESOURCE_PACKS_CACHE_FILE, "utf8");
  try {
    resourcePacks = JSON.parse(resourcePacksContent) as ResourcePack[];
  } catch {
    console.info("[CUSTOM-RESOURCES] Resource packs cache is invalid!");
  }

  const packConfigHashes = await loadPackConfigs();
  for (const pack of resourcePacks) {
    const newPackHash = pack.config.hash;
    const oldPackHash = packConfigHashes.find((p) => p.config.id === pack.config.id)?.config?.hash;
    if (oldPackHash && oldPackHash !== newPackHash) {
      console.info(`[CUSTOM-RESOURCES] Resource pack ${pack.config.id} is out of date!`);
    }
  }

  resourcePacks = resourcePacks.sort((a, b) => b.config.priority - a.config.priority);

  const packs = new Set(resourcePacks.map((pack) => pack.config.id));
  console.info(`[CUSTOM-RESOURCES] Successfully loaded ${packs.size} resource packs in ${(performance.now() - timeNow).toFixed(2)}ms`);
  populateCache();
}

const skyblockIDTextureMap = new Map(); // SkyBlockID: Texture
const textureValueTextureMap = new Map(); // SkullOwner: Texture (FurfSky uses SkullOwner.Properties.textures.0.Value for some textures)
const itemIdTextureMap = new Map(); // Vanilla Item ID & Damage: Texture

const regexCache = new Map<string, RegExp>();
const removeFormattingRegex = /§[0-9a-fk-or]/g;

function populateCache() {
  const skullOwnerRegex = /^\/\^|\\=\\\$\/$/g;
  const backslashRegex = /\\\\/g;

  for (const pack of resourcePacks) {
    const packId = pack.config.id;

    for (const texture of pack.textures) {
      for (const match of texture.match) {
        if (!regexCache.has(match.regex)) {
          const slash = match.regex.lastIndexOf("/");
          regexCache.set(match.regex, new RegExp(match.regex.slice(1, slash), match.regex.slice(slash + 1)));
        }
      }

      // SkyBlock ID mapping
      if (texture.skyblock_id !== undefined) {
        const key = `${packId}:${texture.skyblock_id}`;
        const textures = skyblockIDTextureMap.get(key);
        if (textures) {
          textures.push(texture);
        } else {
          skyblockIDTextureMap.set(key, [texture]);
        }
      }

      // Texture value mapping (skull owner)
      const textureMatch = texture.match.find((a) => a.value === "SkullOwner.Properties.textures.0.Value");
      if (textureMatch) {
        const skullOwnerValue = textureMatch.regex.replace(skullOwnerRegex, "").replace(backslashRegex, "\\").replace("$/", "");

        const key = `${packId}:${skullOwnerValue}`;
        const textures = textureValueTextureMap.get(key);
        if (textures) {
          textures.push(texture);
        } else {
          textureValueTextureMap.set(key, [texture]);
        }
      }

      // Item ID mapping
      if (texture.id !== undefined) {
        const damage = texture.damage ?? 0;
        const key = `${packId}:${texture.id}:${damage}`;
        const textures = itemIdTextureMap.get(key);
        if (textures) {
          textures.push(texture);
        } else {
          itemIdTextureMap.set(key, [texture]);
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    delete pack.textures;
  }

  for (const textures of skyblockIDTextureMap.values()) {
    textures.sort((a: ItemTexture, b: ItemTexture) => b.weight - a.weight);
  }
  for (const textures of textureValueTextureMap.values()) {
    textures.sort((a: ItemTexture, b: ItemTexture) => b.weight - a.weight);
  }
  for (const textures of itemIdTextureMap.values()) {
    textures.sort((a: ItemTexture, b: ItemTexture) => b.weight - a.weight);
  }
}

function matchesTexture(texture: ItemTexture, item: Item, itemTags: Map<string, unknown>): boolean {
  for (const match of texture.match) {
    const value = match.value.endsWith(".*") ? match.value.slice(0, -2) : match.value;
    const tagKey = value.replace(/\./g, ".");

    let path = itemTags.get(tagKey);
    if (path === undefined) {
      const valuePath = value.split(".");
      if (!hasPath(item, "tag", ...valuePath)) {
        return false;
      }
      path = getPath(item, "tag", ...valuePath);
      itemTags.set(tagKey, path);
    }

    const regex = regexCache.get(match.regex)!;
    const matchValues = Array.isArray(path) ? path : [path];

    let matched = false;
    for (const val of matchValues) {
      const str = val?.toString().replace(removeFormattingRegex, "") ?? "";
      if (regex.test(str)) {
        matched = true;
        break;
      }
    }

    if (!matched) {
      return false;
    }
  }
  return true;
}

function findBestTexture(textures: ItemTexture[], pack: ResourcePack, item: Item, currentBest: { weight: number; file: string }): Partial<OutputTexture> | null {
  if (!textures?.length || textures[0].weight <= currentBest.weight) {
    return null;
  }

  const itemTags = new Map<string, unknown>();

  for (const texture of textures) {
    if (texture.weight < currentBest.weight || (texture.weight === currentBest.weight && texture.file <= currentBest.file)) {
      break;
    }

    if (matchesTexture(texture, item, itemTags)) {
      return {
        pack: { base_path: pack.base_path, config: pack.config },
        ...texture
      };
    }
  }

  return null;
}

export function getTexture(item: ProcessedItem, { pack_ids = [], hotm = false }: getTextureParams = {}): Partial<OutputTexture> | null {
  if (!hotm) {
    const itemId = item.id;
    const damage = item.Damage ?? 0;
    const skyblockId = getId(item);
    const textureValue = getTextureValue(item as Item);

    let hasAnyTexture = false;
    for (const pack of resourcePacks) {
      if (skyblockIDTextureMap.has(`${pack.config.id}:${skyblockId}`) || textureValueTextureMap.has(`${pack.config.id}:${textureValue}`) || itemIdTextureMap.has(`${pack.config.id}:${itemId}:${damage}`)) {
        hasAnyTexture = true;
        break;
      }
    }

    if (!hasAnyTexture) {
      return null;
    }
  }

  let bestTexture: Partial<OutputTexture> | null = null;
  let currentBest = { weight: -Infinity, file: "" };
  const packIdsSet = new Set(pack_ids);

  const packsToCheck = pack_ids.length > 0 ? resourcePacks.filter((p) => !packIdsSet.has(p.config.id)) : resourcePacks;

  for (const pack of packsToCheck) {
    const packId = pack.config.id;
    const itemId = item.id;
    const damage = item.Damage ?? 0;
    const skyblockId = getId(item);
    const textureValue = getTextureValue(item as Item);

    const textureSets = [skyblockIDTextureMap.get(`${packId}:${skyblockId}`), textureValueTextureMap.get(`${packId}:${textureValue}`), itemIdTextureMap.get(`${packId}:${itemId}:${damage}`)];

    for (const textures of textureSets) {
      if (!textures) continue;

      const result = findBestTexture(textures, pack, item as Item, currentBest);
      if (result && result.weight! > currentBest.weight) {
        bestTexture = result;
        currentBest = { weight: result.weight!, file: result.file! };
        if (result.weight === textures[0].weight) {
          break;
        }
      }
    }

    if (bestTexture) {
      break;
    }
  }

  if (!bestTexture?.path) {
    return null;
  }

  bestTexture.path = "/" + path.relative(path.resolve(FOLDER_PATH, "static"), bestTexture.path as string);
  return bestTexture;
}
