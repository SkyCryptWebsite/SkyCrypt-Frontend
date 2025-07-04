import type { Profile, SlayerData } from "$types/global";
import type { NetworthResult } from "skyhelper-networth";
import { REDIS } from "../db/redis";
import { getDungeons } from "./dungeons";
import { getSkills } from "./skills";
import { getSkyblockLevel } from "./skyblock_level";
import { getSlayer } from "./slayer";

export async function storeEmbedData(profile: Profile, networth: NetworthResult) {
  const userProfile = profile.members[profile.uuid];

  const skills = getSkills(userProfile, profile, null);
  const skyblockLevel = getSkyblockLevel(userProfile);
  const dungeons = getDungeons(userProfile);
  const slayers = getSlayer(userProfile) as SlayerData;

  const data = {
    skyblock_level: skyblockLevel?.levelWithProgress?.toFixed(2) ?? "0",
    skills: {
      skillAverage: skills?.averageSkillLevelWithProgress?.toFixed(2) ?? "0",
      skills: Object.fromEntries(Object.entries(skills?.skills ?? {}).map(([skill, value]) => [skill, value.level]))
    },
    networth: networth?.networth ?? 0,
    purse: networth?.purse ?? 0,
    bank: networth?.bank ?? 0,
    dungeons: {
      dungoneering: dungeons?.level?.levelWithProgress?.toFixed(2) ?? "0",
      classAverage: dungeons?.classes?.classAverageWithProgress?.toFixed(2) ?? "0",
      classes: Object.fromEntries(Object.entries(dungeons?.classes?.classes ?? {}).map(([skill, value]) => [skill, value.level]))
    },
    slayers: {
      xp: slayers?.totalSlayerExp ?? 0,
      slayers: Object.fromEntries(Object.entries(slayers?.data ?? {}).map(([skill, value]) => [skill, value.level.level]))
    }
  };

  REDIS.set(`embed_data:${profile.uuid}:${profile.profile_id}`, JSON.stringify(data), {
    EX: 60 * 60 * 240 // 240 hours (10 days)
  });
}
