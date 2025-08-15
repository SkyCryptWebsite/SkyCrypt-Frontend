import type { ItemTexture, OutputTexture, ProgressInfo, ResourcePack, TextureAnimation, TextureModel } from "$types/custom-resources";
import type { Item, ProcessedItem, getTextureParams } from "$types/processed/profile/items";
import { Canvas, createCanvas, loadImage } from "@napi-rs/canvas";
import fs from "fs-extra";
import _ from "lodash";
import mm from "micromatch";
import minecraftData from "minecraft-data";
import { format } from "numerable";
import path from "path";
import prettyMilliseconds from "pretty-ms";
import RJSON from "relaxed-json";
import sharp from "sharp";
import UPNG from "upng-js";
import { getCacheFilePath, getCacheFolderPath, getFiles, getFolderPath, getId, getPath, getTextureValue, hasPath, loadPackConfigs } from "./helper";
import { updateProgressBar } from "./helper/progress";

const mcData = minecraftData("1.8.9");

const FOLDER_PATH = getFolderPath();

export const NORMALIZED_SIZE = 128;

const CACHE_FOLDER_PATH = getCacheFolderPath();
const RESOURCE_PACKS_CACHE_FILE = getCacheFilePath(CACHE_FOLDER_PATH, "json", "resource_packs", "json");

let resourcePacks: ResourcePack[] = [];
export async function init() {
  console.info(`[CUSTOM-RESOURCES] Custom Resources loading started.`);
  const timeNow = performance.now();

  if (!fs.existsSync(RESOURCE_PACKS_CACHE_FILE)) {
    console.error("[CUSTOM-RESOURCES] Resource packs cache file does not exist. Running loadResourcePacks()");
    await loadResourcePacks();
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
      console.info(`[CUSTOM-RESOURCES] Resource pack ${pack.config.id} is out of date! Running loadResourcePacks()`);
      await loadResourcePacks();
    }
  }

  resourcePacks = resourcePacks.sort((a, b) => b.config.priority - a.config.priority);

  const packs = new Set(resourcePacks.map((pack) => pack.config.id));
  console.info(`[CUSTOM-RESOURCES] Successfully loaded ${packs.size} resource packs in ${(performance.now() - timeNow).toFixed(2)}ms`);
  populateCache();
}

async function loadResourcePacks() {
  const resourcePacks = (await loadPackConfigs()).sort((a, b) => a.config.priority - b.config.priority);

  for (const pack of resourcePacks) {
    const files = await getFiles(path.resolve(pack.base_path, "assets", "minecraft", "mcpatcher", "cit"), []);
    pack.textures = [];

    const propertiesFiles = files.filter((file) => path.extname(file) === ".properties");

    const progress: ProgressInfo = {
      current: 0,
      total: propertiesFiles.length,
      packName: pack.config.id,
      currentFile: "",
      startTime: Date.now(),
      errors: 0
    };

    console.info(`\n\x1b[36m[${pack.config.id}]\x1b[0m Found ${format(propertiesFiles.length)} property files to process`);

    for (const file of propertiesFiles) {
      progress.current++;
      progress.currentFile = file;
      updateProgressBar(progress);

      try {
        const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
        const properties: { [key: string]: string } = {};

        for (const line of lines) {
          // Skipping comments
          if (line.startsWith("#")) {
            continue;
          }

          const split = line.split("=");

          if (split.length < 2) {
            continue;
          }

          properties[split[0]] = split.slice(1).join("=");
        }

        // Empty properties, probably whole file contaiend only comments
        if (Object.keys(properties).length === 0) {
          continue;
        }

        // Ignoring when type is set and is not "item"
        if ("type" in properties && properties.type !== "item") {
          continue;
        }

        const texture: Partial<ItemTexture> = {
          weight: pack.config.priority,
          animated: false,
          file: path.basename(file),
          match: []
        };

        let textureFile = "texture" in properties ? path.resolve(path.dirname(file), properties.texture) : path.resolve(path.dirname(file), path.basename(file, ".properties"));

        if ("texture.bow_standby" in properties) {
          textureFile = path.resolve(path.dirname(file), properties["texture.bow_standby"]);
        }

        if ("model" in properties) {
          const modelFile = path.resolve(path.dirname(file), properties["model"]);

          try {
            const model = RJSON.parse(await fs.readFile(modelFile, "utf8")) as TextureModel;

            if (model.parent == "builtin/generated") {
              const layers = Object.keys(model.textures).sort((a, b) => Number(a) - Number(b));
              const topLayer = layers.pop();

              if (topLayer && topLayer.startsWith("layer")) {
                const layerPath = path.resolve(pack.base_path, "assets", "minecraft", model.textures[topLayer] + ".png");
                await fs.access(layerPath, fs.constants.F_OK);

                textureFile = layerPath;
              }
            }
          } catch {
            // console.log(error);
            progress.errors++;
          }
        }

        if (Object.keys(properties).filter((a) => a.includes("texture.leather_")).length == 2) {
          try {
            const leatherProperties = Object.keys(properties).filter((a) => a.includes("texture.leather_"));

            let leatherBase = properties[leatherProperties.find((a) => !a.includes("_overlay")) ?? 1];
            let leatherOverlay = properties[leatherProperties.find((a) => a.includes("_overlay")) ?? 1];

            if (!leatherBase.endsWith(".png")) {
              leatherBase += ".png";
            }

            if (!leatherOverlay.endsWith(".png")) {
              leatherOverlay += ".png";
            }

            const leather = {
              base: path.resolve(path.dirname(file), leatherBase),
              overlay: path.resolve(path.dirname(file), leatherOverlay)
            };

            for (const id in leather) {
              const part = id as "base" | "overlay";

              await fs.access(leather[part], fs.constants.F_OK);

              const leatherImage = sharp(leather[part]);
              const leatherMetadata = await leatherImage.metadata();

              if (leatherMetadata.width != NORMALIZED_SIZE && leatherMetadata.height && leatherMetadata.width) {
                await fs.writeFile(
                  leather[part],
                  await leatherImage
                    .resize(NORMALIZED_SIZE, leatherMetadata.height * (NORMALIZED_SIZE / leatherMetadata.width), {
                      kernel: sharp.kernel.nearest
                    })
                    .toBuffer()
                );
              }
            }

            texture.leather = leather;
          } catch {
            progress.errors++;
          }
        } else if (Object.keys(properties).filter((a) => a.includes("texture.leather_") && a.includes("_overlay")).length == 1) {
          const leatherProperties = Object.keys(properties).find((a) => a.includes("texture.leather_") && a.includes("_overlay"));

          textureFile = path.resolve(path.dirname(file), properties[leatherProperties as string]);
        }

        if (!textureFile.endsWith(".png")) {
          textureFile += ".png";
        }

        try {
          await fs.access(textureFile, fs.constants.F_OK);
        } catch {
          progress.errors++;
          continue;
        }

        texture.path = textureFile;

        let textureMetadata;
        try {
          const textureImage = sharp(textureFile);

          try {
            textureMetadata = await textureImage.metadata();

            if (textureMetadata.width != NORMALIZED_SIZE && textureMetadata.height && textureMetadata.width) {
              try {
                await fs.writeFile(
                  textureFile,
                  await textureImage
                    .resize(NORMALIZED_SIZE, Math.floor(textureMetadata.height * (NORMALIZED_SIZE / textureMetadata.width)), {
                      kernel: sharp.kernel.nearest
                    })
                    .toBuffer()
                );
              } catch {
                progress.errors++;
                // console.info(`Error resizing file ${textureFile}:`, (resizeError as Error).message);
              }
            }
          } catch {
            progress.errors++;
            // console.info(`Error reading metadata for ${textureFile}:`, (metadataError as Error).message);
          }
        } catch {
          progress.errors++;
          // console.info(`Error processing image ${textureFile}:`, (sharpError as Error).message);
        }

        try {
          const imageData = await fs.readFile(textureFile).catch(() => {
            progress.errors++;
            // console.info("Error reading file", err);
          });

          if (!imageData) {
            continue;
          }

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const decode = UPNG.decode(imageData);
          if (decode == null) {
            continue;
          }

          if (decode.frames.length > 0) {
            texture.animated = true;
          }
        } catch {
          progress.errors++;
          // console.info("Error reading file", err);
          texture.animated = false;
        }

        for (const property in properties) {
          if (property == "weight") {
            texture.weight ??= 0;
            texture.weight += parseInt(properties[property]);
          }

          if (property == "items" || property == "matchItems") {
            const itemName = properties[property].trim().replace("minecraft:", "").split(":")[0];
            const item = mcData.itemsByName[itemName];
            if (item) {
              texture.id = item.id;
              texture.damage ??= 0;
            }
          }

          if (property === "vanillaId") {
            texture.id = parseInt(properties[property]);
          }

          if (property == "damage") {
            texture.damage = parseInt(properties[property]);
          }

          if (!property.startsWith("nbt.")) {
            continue;
          }

          const regexString = properties[property];
          let regex: RegExp;

          if (regexString.includes("\\u00A7")) {
            regex = mm.makeRe(regexString.toString().replace(/\\u00A7[0-9a-fk-or]/g, ""));
          }

          if (regexString.startsWith("ipattern:")) {
            regex = mm.makeRe(regexString.substring(9), { nocase: true });
          } else if (regexString.startsWith("pattern:")) {
            if (regexString === "pattern:*" || regexString.trim() === "pattern:") {
              regex = new RegExp(".*");
            } else {
              regex = mm.makeRe(regexString.substring(9));
            }
          } else if (regexString.startsWith("iregex:")) {
            regex = new RegExp(regexString.substring(7), "i");
          } else if (regexString.startsWith("regex:")) {
            regex = new RegExp(regexString.substring(6));
          } else {
            if (property == "nbt.ExtraAttributes.id") {
              texture.skyblock_id = regexString;
            }

            regex = new RegExp(`^${_.escapeRegExp(regexString)}$`);
          }

          texture.match ??= [];
          texture.match.push({
            value: property.substring(4),
            regex: regex.toString()
          });
        }

        let mcMeta;

        try {
          mcMeta = await fs.readFile(textureFile + ".mcmeta", "utf8");
        } catch {
          // ...
        }

        let metaProperties = {};
        if (mcMeta) {
          try {
            metaProperties = RJSON.parse(mcMeta);
          } catch {
            progress.errors++;
          }
        }

        if ("animation" in metaProperties && textureMetadata && textureMetadata.width != textureMetadata.height) {
          const animation = metaProperties.animation as TextureAnimation;
          if (animation.frames === undefined) {
            if (animation.frametime && textureMetadata.height) {
              const frameCount = textureMetadata.height / NORMALIZED_SIZE;

              animation.frames = [];
              for (let i = 0; i < frameCount; i++) {
                animation.frames.push({
                  index: i,
                  time: animation.frametime
                });
              }
            } else {
              progress.errors++;
              // console.info("Error reading file", textureFile);
              animation.frames = [];
            }
          }

          texture.animated = true;

          const canvas = createCanvas(NORMALIZED_SIZE, NORMALIZED_SIZE);
          const ctx = canvas.getContext("2d");

          const image = (await loadImage(textureFile)) as unknown as Canvas;

          const pngFrames = [] as ArrayBuffer[];
          const pngDelays = [] as number[];

          let currentTime = 0;

          for (const [index, frame] of animation.frames.entries()) {
            if (typeof frame == "number") {
              animation.frames[index] = {
                index: frame,
                time: animation.frametime
              };
            }

            animation.frames[index].time = (animation.frames[index].time / 20) * 1000;
            animation.frames[index].totalTime = currentTime;
            currentTime += animation.frames[index].time;
          }

          animation.frametime = (animation.frametime / 20) * 1000;

          if ("frames" in animation) {
            if (animation.interpolate) {
              let totalLength = 0;

              for (const frame of animation.frames) {
                totalLength += frame.time;
              }

              const frameTimeInterpolated = (2 / 20) * 1000;

              const frameCountInterpolated = totalLength / frameTimeInterpolated;

              for (let i = 0; i < frameCountInterpolated; i++) {
                let frameCur, frameNext;
                const currentTime = (i / frameCountInterpolated) * totalLength;

                for (const [index, frame] of animation.frames.entries()) {
                  if (frame.totalTime && frame.totalTime + frame.time > currentTime) {
                    frameCur = frame;

                    if (index >= animation.frames.length - 1) {
                      frameNext = animation.frames[0];
                    } else {
                      frameNext = animation.frames[index + 1];
                    }

                    break;
                  }
                }

                const opacity = frameCur && frameCur.totalTime ? (currentTime - frameCur.totalTime) / frameCur.time : 1;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.globalCompositeOperation = "source-over";

                ctx.globalAlpha = 1;
                ctx.drawImage(getFrame(image, frameCur ? frameCur.index : 0), 0, 0);

                ctx.globalCompositeOperation = "source-atop";

                ctx.globalAlpha = opacity;
                ctx.drawImage(getFrame(image, frameNext ? frameNext.index : 0), 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer;

                pngFrames.push(imageData instanceof ArrayBuffer ? imageData : new ArrayBuffer(imageData.byteLength).constructor.prototype.slice.call(imageData));
                pngDelays.push(frameTimeInterpolated);
              }
            } else {
              for (const frame of animation.frames) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(getFrame(image, frame.index), 0, 0);

                pngDelays.push(frame.time);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer;

                pngFrames.push(imageData instanceof ArrayBuffer ? imageData : new ArrayBuffer(imageData.byteLength).constructor.prototype.slice.call(imageData));
              }
            }
          }

          if (pngFrames.length > 0) {
            const apng = UPNG.encode(pngFrames, NORMALIZED_SIZE, NORMALIZED_SIZE, 0, pngDelays);

            await fs.writeFile(textureFile, Buffer.from(apng));
          }
        }

        pack.textures.push(texture as ItemTexture);
      } catch {
        // console.log(error);
        progress.errors++;
      }
    }

    process.stdout.write("\r\x1b[K");
    const elapsed = Date.now() - progress.startTime;
    console.info(`\x1b[36m[${pack.config.id}]\x1b[0m ` + `\x1b[32m✓ Completed\x1b[0m ` + `- Loaded \x1b[34m${format(pack.textures.length)}\x1b[0m textures ` + `in \x1b[35m${prettyMilliseconds(elapsed)}\x1b[0m `);
    // `with \x1b[31m${progress.errors}\x1b[0m errors`
  }

  fs.writeFileSync(path.join(CACHE_FOLDER_PATH, "json", `json_resource_packs.json`), JSON.stringify(resourcePacks));
}

export function getFrame(src: Canvas, frame: number) {
  const dst = createCanvas(NORMALIZED_SIZE, NORMALIZED_SIZE);
  const ctx = dst.getContext("2d");

  ctx.drawImage(src, 0, frame * NORMALIZED_SIZE * -1);

  return dst;
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
