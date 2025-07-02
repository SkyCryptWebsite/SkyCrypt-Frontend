import type { Member, Profile, Skills, SkillsData } from "$types/global";
import type { Player } from "$types/raw/player/lib";
import * as constants from "../constants/constants";
import { getLevelByXp, getSkillLevelCaps, getSocialSkillExperience, getXpByLevel } from "./leveling/leveling";

export function getSkills(userProfile: Member, profile: Profile, player: Player | null): Skills {
  const output = { skills: {} } as Skills;

  const skillLevelCaps = getSkillLevelCaps(userProfile, player);
  if (userProfile.player_data?.experience) {
    const skills = userProfile.player_data.experience;

    const socialExperience = getSocialSkillExperience(profile);

    Object.assign(output.skills, {
      taming: getLevelByXp(skills.SKILL_TAMING || 0, { type: "taming", cap: skillLevelCaps.taming }),
      farming: getLevelByXp(skills.SKILL_FARMING || 0, { type: "farming", cap: skillLevelCaps.farming }),
      mining: getLevelByXp(skills.SKILL_MINING || 0, { type: "mining" }),
      combat: getLevelByXp(skills.SKILL_COMBAT || 0, { type: "combat" }),
      foraging: getLevelByXp(skills.SKILL_FORAGING || 0, { type: "foraging" }),
      fishing: getLevelByXp(skills.SKILL_FISHING || 0, { type: "fishing" }),
      enchanting: getLevelByXp(skills.SKILL_ENCHANTING || 0, { type: "enchanting" }),
      alchemy: getLevelByXp(skills.SKILL_ALCHEMY || 0, { type: "alchemy" }),
      carpentry: getLevelByXp(skills.SKILL_CARPENTRY || 0, { type: "carpentry" }),
      runecrafting: getLevelByXp(skills.SKILL_RUNECRAFTING || 0, {
        type: "runecrafting",
        cap: skillLevelCaps.runecrafting
      }),
      social: getLevelByXp(socialExperience, { type: "social" })
    });
  } else {
    const achievementSkills = {
      taming: 0, // player.achievements?.skyblock_domesticator || 0,
      farming: 0, // player.achievements?.skyblock_harvester || 0,
      mining: 0, // player.achievements?.skyblock_excavator || 0,
      combat: 0, // player.achievements?.skyblock_combat || 0,
      foraging: 0, // player.achievements?.skyblock_gatherer || 0,
      fishing: 0, // player.achievements?.skyblock_angler || 0,
      enchanting: 0, // player.achievements?.skyblock_augmentation || 0,
      alchemy: 0, // player.achievements?.skyblock_concoctor || 0,
      carpentry: 0,
      runecrafting: 0,
      social: 0
    };

    for (const [skill, level] of Object.entries(achievementSkills)) {
      output.skills[skill as keyof SkillsData] = getXpByLevel(level, { type: skill });
    }

    output.disabled = true;
  }
  let totalSkillXp = 0;
  let totalSkillLevel = 0;
  let totalSkillLevelWithProgress = 0;
  let skillCount = 0;
  for (const skill of Object.keys(output.skills)) {
    if (constants.COSMETIC_SKILLS.includes(skill)) {
      continue;
    }

    const skillData = output.skills[skill as keyof SkillsData];
    totalSkillLevelWithProgress += skillData.levelWithProgress;
    totalSkillLevel += skillData.level;
    totalSkillXp += skillData.xp;
    skillCount++;
  }

  output.totalSkillXp = totalSkillXp;
  output.averageSkillLevel = totalSkillLevel / skillCount;
  output.averageSkillLevelWithProgress = totalSkillLevelWithProgress / skillCount;

  return output;
}
