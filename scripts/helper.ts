import { createCanvas, type Canvas } from "@napi-rs/canvas";
import { createHash } from "crypto";
import fs from "fs-extra";
import path from "path";
import prettyMilliseconds from "pretty-ms";
import { ProgressInfo, ResourcePack } from "../src/lib/types/custom-resources";

// size of the each texture (128x128)
export const NORMALIZED_SIZE = 128;

const BASE_DIR = path.resolve(__dirname, "..");
const RESOURCE_PACK_FOLDER = path.resolve(BASE_DIR, "static", "resourcepacks");

export async function getFiles(dir: string, fileList: string[]) {
  const files = await fs.readdir(dir);

  fileList = fileList || [];

  for (const file of files) {
    const fileStat = await fs.stat(path.resolve(dir, file));

    if (fileStat.isDirectory()) {
      fileList = await getFiles(path.resolve(dir, file), fileList);
    } else {
      fileList.push(path.resolve(dir, file));
    }
  }

  return fileList;
}

export function getFrame(src: Canvas, frame: number) {
  const dst = createCanvas(NORMALIZED_SIZE, NORMALIZED_SIZE);
  const ctx = dst.getContext("2d");

  ctx.drawImage(src, 0, frame * NORMALIZED_SIZE * -1);

  return dst;
}

export function getFileHash(filename: string) {
  return new Promise((resolve) => {
    const md5sum = createHash("md5");

    const s = fs.createReadStream(filename);

    s.on("data", function (data) {
      md5sum.update(data);
    });

    s.on("end", function () {
      const hash = md5sum.digest("hex");
      resolve(hash);
    });
  });
}

export async function loadPackConfigs(): Promise<ResourcePack[]> {
  const resourcePacks: ResourcePack[] = [];
  for (const packOrFile of await fs.readdir(RESOURCE_PACK_FOLDER, { withFileTypes: true })) {
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

export function updateProgressBar(progress: ProgressInfo): void {
  const percentage = Math.round((progress.current / progress.total) * 100);
  const barLength = 40;
  const filledLength = Math.round((percentage / 100) * barLength);
  const bar = "█".repeat(filledLength) + "░".repeat(barLength - filledLength);

  const elapsed = Date.now() - progress.startTime;
  const rate = progress.current / (elapsed / 1000);
  const eta = progress.current > 0 ? ((progress.total - progress.current) / rate) * 1000 : 0;

  process.stdout.write("\r\x1b[2K");

  const progressLine = `\x1b[36m[${progress.packName}]\x1b[0m ` + `\x1b[32m${bar}\x1b[0m ` + `\x1b[33m${percentage}%\x1b[0m ` + `(\x1b[34m${progress.current}\x1b[0m/\x1b[34m${progress.total}\x1b[0m) ` + `\x1b[90m|\x1b[0m ` + `ETA: \x1b[35m${prettyMilliseconds(eta)}\x1b[0m ` + `\x1b[90m|\x1b[0m `;
  /// progressLine += `Errors: \x1b[31m${progress.errors}\x1b[0m`;

  if (progress.current < progress.total) {
    const rateInfo = ` \x1b[90m|\x1b[0m \x1b[90m${rate.toFixed(1)} files/s\x1b[0m`;
    process.stdout.write(progressLine + rateInfo);
  } else {
    process.stdout.write(progressLine);
  }
}

export function getCacheFolderPath() {
  if (!fs.pathExistsSync(path.resolve(BASE_DIR, "cache"))) {
    fs.mkdirSync(path.resolve(BASE_DIR, "cache"));
  }

  return path.resolve(BASE_DIR, "cache");
}
