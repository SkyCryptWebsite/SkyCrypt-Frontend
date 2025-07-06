import { formatNumber } from "$lib/shared/helper";
import type { EmbedV2 } from "$types/statsv2";
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

function getLongDescription(embedData: EmbedV2) {
  let output = "";

  if (embedData === undefined) {
    return output;
  }

  if (embedData.skyblock_level) {
    output += `🌟 Skyblock Level: ${formatNumber(embedData.skyblock_level)}\n`;
  }

  if (embedData.networth) {
    output += `💸 Networth: ${formatNumber(embedData.networth)}\n`;
  }

  if (embedData.networth) {
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
  const skills = embedData.skills.skills;
  if (skills && Object.keys(skills).length > 0) {
    output += `📚 Skills: ${embedData.skills.skillAverage}\n`;

    for (const skillGroup of sortedSkills) {
      for (const skill of skillGroup) {
        const data = skills[skill as keyof typeof skills];
        if (data === undefined) {
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

    output += `${skillEmojis["dungeons"]} ${embedData.dungeons.dungoneering ?? 0} `;
    const classes = embedData.dungeons.classes;
    if (classes !== undefined) {
      for (const [dclass, data] of Object.entries(classes)) {
        output += `${skillEmojis[dclass]} ${data ?? 0} `;
      }
    }

    output += "\n";
  }

  output += "\n";

  if (embedData.slayers && embedData.slayers.xp > 0) {
    output += `🤺 Slayer: ${formatNumber(embedData.slayers.xp)}\n`;

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

    output += "\n";
  }

  return output;
}

function getMetaTitle(embedData: EmbedV2) {
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

function getShortDescription(embedData: EmbedV2) {
  let description = "";

  // Base
  if (embedData.joined) {
    description += `${embedData.displayName} has been playing SkyBlock for ${formatDistanceToNowStrict(embedData.joined)}`;
  }

  // const highestRaritySword = profile.items?.weapons?.highest_priority_weapon?.display_name;

  // // Armor set
  // if (profile.items?.armor?.set_name !== undefined) {
  //   if (highestRaritySword !== undefined) {
  //     description += `, is wearing ${profile.items.armor.set_name}`;
  //   } else {
  //     description += `and is wearing ${profile.items.armor.set_name}`;
  //   }
  // }

  return description;
}

export { getLongDescription, getMetaTitle, getShortDescription };
