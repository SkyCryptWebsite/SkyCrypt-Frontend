import { base } from "$app/paths";
import type { ResourcePack } from "$types/custom-resources";
import fs from "fs-extra";
import path from "path";
import { getFileHash } from "./hashes";

export function getFolderPath() {
  return path.resolve(base);
}

export function getCacheFolderPath() {
  if (!fs.pathExistsSync(path.resolve(base, "cache"))) {
    fs.mkdirSync(path.resolve(base, "cache"));
  }

  return path.resolve(base, "cache");
}

export function getCacheFilePath(dirPath: string, type: string, name: string, format = "png") {
  const subdirs = [type];

  // for texture and head type, we get the first 2 characters to split them further
  if (type == "texture" || type == "head") {
    subdirs.push(name.slice(0, 2));
  }

  // for potion and leather type, we get what variant they are to split them further
  if (type == "leather" || type == "potion") {
    subdirs.push(name.split("_")[0]);
  }

  // check if the entire folder path is available
  if (!fs.pathExistsSync(path.resolve(dirPath, subdirs.join("/")))) {
    // check if every subdirectory is available
    for (let i = 1; i <= subdirs.length; i++) {
      const checkDirs = subdirs.slice(0, i);
      const checkPath = path.resolve(dirPath, checkDirs.join("/"));

      if (!fs.pathExistsSync(checkPath)) {
        fs.mkdirSync(checkPath);
      }
    }
  }

  return path.resolve(dirPath, `${subdirs.join("/")}/${type}_${name}.${format}`);
}

const RESOURCE_PACK_FOLDER = path.resolve(base, "static", "resourcepacks");

export async function loadPackConfigs(): Promise<ResourcePack[]> {
  const resourcePacks: ResourcePack[] = [];

  const resolvedDir = path.resolve(RESOURCE_PACK_FOLDER);
  const stat = await fs.stat(resolvedDir);
  if (!stat.isDirectory()) {
    console.warn(`Path is not a directory: ${resolvedDir}`);
    return resourcePacks;
  }

  const files = await fs.readdir(RESOURCE_PACK_FOLDER, { withFileTypes: true });

  for (const packOrFile of files) {
    if (!packOrFile.isDirectory()) {
      continue;
    }

    const pack = packOrFile.name;
    const basePath = path.resolve(RESOURCE_PACK_FOLDER, pack);

    try {
      const configPath = path.resolve(basePath, "config.json");

      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      config.hash = await getFileHash(configPath);

      resourcePacks.push({
        base_path: basePath,
        config,
        textures: []
      });
    } catch {
      console.info("Couldn't find config for resource pack", pack);
    }
  }

  return resourcePacks;
}
