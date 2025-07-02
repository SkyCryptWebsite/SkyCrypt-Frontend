<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import themes from "$lib/shared/constants/themes";
  import { formatNumber } from "$lib/shared/helper";
  import { theme as themeStore } from "$lib/stores/themes";
  import type { Skill } from "$types/stats";
  import { formatDistanceToNowStrict } from "date-fns";
  import SvelteSeo from "svelte-seo";

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);

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

  const _slayerEmojis = {
    zombie: "🧟",
    spider: "🕸️",
    wolf: "🐺",
    enderman: "🔮",
    blaze: "🔥",
    vampire: "🩸"
  } as Record<string, string>;

  function getLongDescription() {
    let output = "";

    if (profile.skyblock_level.xp !== 0 && profile.skyblock_level?.level !== 0) {
      output += `🌟 Skyblock Level: ${formatNumber(profile.skyblock_level.levelWithProgress)}\n`;
    }

    // if (profile.networth.noInventory === false) {
    //   output += `💸 Networth: ${formatNumber(profile.stats.networth.networth)}\n`;
    // }

    if (profile.purse !== undefined) {
      output += `💰 Purse: ${formatNumber(profile.purse)}\n`;
    }

    if (profile.bank !== undefined) {
      output += `🏦 Bank: ${formatNumber(profile.bank)}\n`;
    }

    output += "\n";

    const sortedSkills = [
      ["farming", "mining", "combat", "foraging", "taming", "carpentry"],
      ["runecrafting", "social", "fishing", "enchanting", "alchemy"]
    ];
    const skills = profile.skills?.skills as Record<string, Skill>;
    if (skills !== undefined && Object.keys(skills).length > 0) {
      output += `📚 Skills: ${profile.skills.averageSkillLevelWithProgress.toFixed(2)}\n`;

      for (const skillGroup of sortedSkills) {
        for (const skill of skillGroup) {
          const data = skills[skill];
          if (data === undefined) {
            continue;
          }

          output += `${skillEmojis[skill]} ${data.level} `;
        }

        output += "\n";
      }

      output += "\n";
    }

    // if (profile.dungeons !== undefined) {
    //   const dungeonsLevel = profile.dungeons.level?.levelWithProgress;
    //   const classAverage = profile.dungeons.classes?.classAverageWithProgress;
    //   if (dungeonsLevel > 0 && classAverage > 0) {
    //     output += `🪦 Dungeons: ${dungeonsLevel.toFixed(2)} (${classAverage.toFixed(2)})\n`;
    //   }

    //   output += `${skillEmojis["dungeons"]} ${profile.dungeons.level?.level ?? 0} `;
    //   const classes = profile.dungeons?.classes?.classes;
    //   if (classes !== undefined) {
    //     for (const [dclass, data] of Object.entries(classes)) {
    //       output += `${skillEmojis[dclass]} ${data.level ?? 0} `;
    //     }
    //   }

    //   output += "\n";
    // }

    output += "\n";

    // if (profile.slayer?.totalSlayerExp > 0) {
    //   output += `🤺 Slayer: ${formatNumber(profile.slayer.totalSlayerExp)}\n`;

    //   const slayerOrder = ["zombie", "spider", "wolf", "enderman", "vampire", "blaze"];
    //   for (const slayer of slayerOrder) {
    //     if (profile.slayer.data[slayer] === undefined) {
    //       continue;
    //     }

    //     const slayerInfo = profile.slayer.data[slayer];
    //     if (slayerInfo.level.level === 0) {
    //       continue;
    //     }

    //     output += `${slayerEmojis[slayer]} ${slayerInfo.level.level} `;
    //   }

    //   output += "\n";
    // }

    return output;
  }

  function getMetaTitle() {
    let metaTitle = profile.displayName;

    switch (profile.game_mode) {
      case "ironman":
        metaTitle += ` (${profile.profile_cute_name} ♻️)`;
        break;

      case "bingo":
        metaTitle += ` (${profile.profile_cute_name} 🎲)`;
        break;

      case "island":
        metaTitle += ` (${profile.profile_cute_name} 🌴)`;
        break;

      default:
        metaTitle += ` (${profile.profile_cute_name})`;
        break;
    }

    return metaTitle;
  }

  function getShortDescription() {
    let description = "";

    // Base
    if (profile.joined !== undefined) {
      description += `${profile.displayName} has been playing SkyBlock for ${formatDistanceToNowStrict(profile.joined)}`;
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
</script>

<svelte:head>
  <link rel="icon" href={`https://crafatar.com/avatars/${profile.uuid}?size=32&overlay`} sizes="32x32" type="image/png" />
</svelte:head>

<SvelteSeo
  title="{profile.displayName} | SkyCrypt"
  description={getShortDescription()}
  canonical="https://sky.shiiyu.moe/stats/{profile.uuid}/{profile.profile_id}"
  openGraph={{
    title: getMetaTitle(),
    description: getLongDescription(),
    type: "profile",
    profile: {
      username: profile.username
    },
    images: [
      {
        url: `https://crafatar.com/avatars/${profile.uuid}?size=512&overlay`,
        width: 512,
        height: 512,
        alt: profile.displayName
      }
    ],
    site_name: "SkyCrypt"
  }}
  twitter={{
    card: "summary",
    image: `https://crafatar.com/avatars/${profile.uuid}?size=512&overlay`,
    imageAlt: profile.displayName,
    title: getMetaTitle()
  }}
  themeColor={themes.find((theme) => theme.id === $themeStore)?.light ? "#dbdbdb" : "#282828"}
  manifest="/manifest.webmanifest" />
