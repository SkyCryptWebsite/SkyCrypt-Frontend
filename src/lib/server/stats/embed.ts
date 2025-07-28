import { fetchPlayer, getDisplayName } from "$lib/server/lib";
import type { Profile, SlayerData } from "$types/global";
import type { Player } from "$types/raw/player/lib";
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
  const player: Player = await fetchPlayer(profile.uuid, { cache: true });

  const data = {
    displayName: getDisplayName(player.displayname, profile.uuid),
    username: player.displayname,
    uuid: profile.uuid,
    profile_id: profile.profile_id,
    profile_cute_name: profile.cute_name,
    joined: userProfile.profile?.first_join ?? 0,
    game_mode: profile.game_mode,
    skyblock_level: skyblockLevel?.levelWithProgress != null ? Number(skyblockLevel.levelWithProgress.toFixed(2)) : 0,
    skills: {
      skillAverage: skills?.averageSkillLevelWithProgress != null ? Number(skills.averageSkillLevelWithProgress.toFixed(2)) : 0,
      skills: Object.fromEntries(Object.entries(skills?.skills ?? {}).map(([skill, value]) => [skill, value.level]))
    },
    networth: networth?.networth ?? 0,
    purse: networth?.purse ?? 0,
    bank: networth?.bank ?? 0,
    dungeons: {
      dungoneering: dungeons?.level?.levelWithProgress != null ? Number(dungeons.level.levelWithProgress.toFixed(2)) : 0,
      classAverage: dungeons?.classes?.classAverageWithProgress != null ? Number(dungeons.classes.classAverageWithProgress.toFixed(2)) : 0,
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
