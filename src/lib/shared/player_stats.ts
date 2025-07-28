import { getBonusStat } from "$lib/shared/constants/stats";
import type { PlayerStatsInputv2 } from "$types/statsv2";

export function getPlayerStats(profile: PlayerStatsInputv2) {
  const stats = {
    health: { base: 100 },
    defense: { base: 0 },
    strength: { base: 0 },
    speed: { base: 100 },
    critical_chance: { base: 30 },
    critical_damage: { base: 50 },
    intelligence: { base: 0 },
    bonus_attack_speed: { base: 0 },
    sea_creature_chance: { base: 20 },
    magic_find: { base: 0 },
    pet_luck: { base: 0 },
    true_defense: { base: 0 },
    ferocity: { base: 0 },
    ability_damage: { base: 0 },
    mining_speed: { base: 0 },
    mining_fortune: { base: 0 },
    farming_fortune: { base: 0 },
    foraging_fortune: { base: 0 },
    pristine: { base: 0 },
    fishing_speed: { base: 0 },
    health_regen: { base: 100 },
    vitality: { base: 100 },
    mending: { base: 100 },
    combat_wisdom: { base: 0 },
    mining_wisdom: { base: 0 },
    farming_wisdom: { base: 0 },
    foraging_wisdom: { base: 0 },
    fishing_wisdom: { base: 0 },
    enchanting_wisdom: { base: 0 },
    alchemy_wisdom: { base: 0 },
    carpentry_wisdom: { base: 0 },
    runecrafting_wisdom: { base: 0 },
    social_wisdom: { base: 0 },
    mining_spread: { base: 0 },
    gemstone_spread: { base: 0 },
    ore_fortune: { base: 0 },
    block_fortune: { base: 0 },
    dwarven_metal_fortune: { base: 0 },
    gemstone_fortune: { base: 0 },
    wheat_fortune: { base: 0 },
    carrot_fortune: { base: 0 },
    potato_fortune: { base: 0 },
    pumpkin_fortune: { base: 0 },
    melon_fortune: { base: 0 },
    mushroom_fortune: { base: 0 },
    cactus_fortune: { base: 0 },
    sugar_cane_fortune: { base: 0 },
    nether_wart_fortune: { base: 0 },
    cocoa_beans_fortune: { base: 0 },
    double_hook_chance: { base: 0 },
    trophy_fish_chance: { base: 0 },
    heat_resistance: { base: 0 },
    fear: { base: 0 }
  } as Record<string, { base: number; [string: string]: number }>;

  if (profile.skyblock_level && profile.skyblock_level > 0) {
    stats.health.skyblock_level = profile.skyblock_level * 5;
    stats.strength.skyblock_level = Math.floor(profile.skyblock_level / 5);
  }

  if (profile.armor) {
    for (const key of Object.keys(profile.armor)) {
      if (key in stats) {
        stats[key].armor = profile.armor[key] ?? 0;
      }
    }
  }

  if (profile.equipment && profile.equipment) {
    for (const key of Object.keys(profile.equipment)) {
      if (key in stats === false) {
        continue;
      }

      stats[key].equipment = profile.equipment[key] ?? 0;
    }
  }

  if (profile.skills) {
    for (const [skill, data] of Object.entries(profile.skills)) {
      const bonusStats = getBonusStat(data.level, `skill_${skill}`, data.maxLevel);

      for (const [name, value] of Object.entries(bonusStats)) {
        if (name in stats === false) {
          continue;
        }

        stats[name][`skill_${skill}`] ??= 0;
        stats[name][`skill_${skill}`] += value;
      }
    }
  }

  if (profile.pets) {
    for (const [stat, value] of Object.entries(profile.pets)) {
      if (stat in stats === false && value) {
        continue;
      }

      stats[stat].active_pet = value ?? 0;
    }
  }

  if (profile.petScore) {
    for (const [name, value] of Object.entries(profile.petScore)) {
      if (name in stats === false) {
        continue;
      }

      stats[name].pet_score = value ?? 0;
    }
  }

  if (profile.slayers) {
    for (const [name, value] of Object.entries(profile.slayers)) {
      if (name in stats === false) {
        continue;
      }

      stats[name][`slayers`] ??= 0;
      stats[name][`slayers`] += value ?? 0;
    }
  }

  if (profile.dungeons) {
    const bonusStats = getBonusStat(profile.dungeons, "skill_dungeoneering", 50);

    for (const [name, value] of Object.entries(bonusStats)) {
      if (name in stats === false) {
        continue;
      }

      stats[name].skill_dungeoneering = value;
    }
  }

  if (profile.bestiary && profile.bestiary > 0) {
    stats.health.bestiary = Math.floor(profile.bestiary);
  }

  if (profile.accessories) {
    for (const key of Object.keys(profile.accessories)) {
      if (key in stats === false) {
        continue;
      }

      stats[key].accessories = profile.accessories[key] ?? 0;
    }
  }

  for (const [key, value] of Object.entries(stats)) {
    stats[key].total = value.base;

    for (const [name, val] of Object.entries(value)) {
      if (name === "base" || name === "total") {
        continue;
      }

      stats[key].total += val;
    }
  }

  return stats;
}
