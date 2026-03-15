import type { ModelsEmbedData } from "$lib/shared/api/orval-generated";
import { formatNumber } from "$lib/shared/helper";
import { formatDistanceToNowStrict } from "date-fns";

const skillEmojis = {
  alchemy: "⚗️",
  carpentry: "🪑",
  combat: "⚔️",
  enchanting: "🔮",
  farming: "🌾",
  fishing: "🎣",
  foraging: "🌳",
  mining: "⛏️",
  runecrafting: "✨",
  social: "💬",
  taming: "🦴",
  dungeons: "💀",
  archer: "🏹",
  berserk: "🗡️",
  healer: "🚑",
  mage: "🧙🏽",
  tank: "🛡️"
} as Record<string, string>;

const slayerEmojis = {
  zombie: "🧟",
  spider: "🕸️",
  wolf: "🐺",
  enderman: "🔮",
  blaze: "🔥",
  vampire: "🩸"
} as Record<string, string>;

function getLongDescription(embedData: ModelsEmbedData) {
  let output = "";

  if (embedData == null) {
    return output;
  }

  if (embedData.rank && embedData.rank.rankText) {
    output += `🏅 Rank: ${embedData.rank.rankText + embedData.rank.plusText}\n`;
  }

  if (embedData.skyblock_level) {
    output += `🌟 Level: ${formatNumber(embedData.skyblock_level)}\n`;
  }

  if (embedData.networth?.normal != null) {
    output += `💸 Networth: ${formatNumber(embedData.networth.normal)}\n`;
  }

  if (embedData.purse) {
    output += `💰 Purse: ${formatNumber(embedData.purse)}\n`;
  }

  if (embedData.bank) {
    output += `🏦 Bank: ${formatNumber(embedData.bank)}\n`;
  }

  output += "\n";

  const sortedSkills = [
    ["farming", "mining", "combat", "foraging", "taming", "carpentry"],
    ["runecrafting", "social", "fishing", "enchanting", "alchemy"]
  ];
  const skills = embedData.skills?.skills;
  if (embedData.skills && skills && Object.keys(skills).length > 0) {
    output += `📚 Skills: ${embedData.skills.skillAverage}\n`;

    for (const skillGroup of sortedSkills) {
      for (const skill of skillGroup) {
        const data = skills[skill as keyof typeof skills];
        if (data == null) {
          continue;
        }

        output += `${skillEmojis[skill]} ${data} `;
      }

      output += "\n";
    }

    output += "\n";
  }

  if (embedData.dungeons) {
    const classAverage = embedData.dungeons.classAverage;
    if (classAverage) {
      output += `🪦 Dungeons: ${classAverage}\n`;
    }

    output += `${skillEmojis["dungeons"]} ${embedData.dungeons.dungeoneering ?? 0} `;
    const classes = embedData.dungeons.classes;
    if (classes != null) {
      for (const [dclass, data] of Object.entries(classes)) {
        output += `${skillEmojis[dclass]} ${data ?? 0} `;
      }
    }

    output += "\n";
  }

  output += "\n";

  if (embedData.slayers && embedData.slayers.xp != null && embedData.slayers.xp > 0) {
    output += `🤺 Slayer: ${formatNumber(embedData.slayers.xp)}\n`;

    if (embedData.slayers.slayers) {
      const slayerOrder = ["zombie", "spider", "wolf", "enderman", "vampire", "blaze"] as const;
      for (const slayer of slayerOrder) {
        if (!embedData.slayers.slayers[slayer]) {
          continue;
        }

        const slayerLevel = embedData.slayers.slayers[slayer];
        if (!slayerLevel) {
          continue;
        }

        output += `${slayerEmojis[slayer]} ${slayerLevel} `;
      }
    }

    output += "\n";
  }

  return output;
}

function getMetaTitle(embedData: ModelsEmbedData) {
  let metaTitle = embedData.displayName;

  switch (embedData.game_mode) {
    case "ironman":
      metaTitle += ` (${embedData.profile_cute_name} ♻️)`;
      break;

    case "bingo":
      metaTitle += ` (${embedData.profile_cute_name} 🎲)`;
      break;

    case "island":
      metaTitle += ` (${embedData.profile_cute_name} 🌴)`;
      break;

    default:
      metaTitle += ` (${embedData.profile_cute_name})`;
      break;
  }

  return metaTitle;
}

function getShortDescription(embedData: ModelsEmbedData) {
  let description = "";

  // Base
  if (embedData.joined) {
    description += `${embedData.displayName} has been playing SkyBlock for ${formatDistanceToNowStrict(embedData.joined)}`;
  }

  return description;
}

export { getLongDescription, getMetaTitle, getShortDescription };
