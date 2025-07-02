import type { Member, Profile } from "$types/global";
import type { Player } from "$types/raw/player/lib";
import { FAIRY_SOULS } from "../constants/constants";
import { fetchMuseum, getDisplayName, getProfiles } from "../lib";
import { getAPISettings } from "./api_settings";
import { getItems } from "./items";
import { getProfileMembers } from "./members";
import { getRank } from "./rank";
import { getSkills } from "./skills";
import { getSkyblockLevel } from "./skyblock_level";

export async function getMainStats(userProfile: Member, profile: Profile, player: Player, packs: string[]) {
  const [profiles, members, museumData] = await Promise.all([getProfiles(profile.uuid), getProfileMembers(profile.members), fetchMuseum(profile.profile_id)]);

  getItems(userProfile, museumData?.[profile.uuid], packs, profile.profile_id);

  return {
    displayName: getDisplayName(player.displayname, profile.uuid),
    username: player.displayname,
    uuid: profile.uuid,
    profile_id: profile.profile_id,
    profile_cute_name: profile.cute_name,
    game_mode: profile.game_mode,
    selected: profile.selected,
    profiles: profiles,
    members: members,
    rank: getRank(player),
    social: player.socialMedia?.links ?? {},
    skills: getSkills(userProfile, profile, null),
    skyblock_level: getSkyblockLevel(userProfile),
    joined: userProfile.profile?.first_join ?? 0,
    // cookieBuffActive: userProfile.profile?.cookie_buff_active ?? false, // TODO: Implement cookie buff on the frontend
    purse: userProfile.currencies?.coin_purse ?? 0,
    bank: profile.banking?.balance ?? 0,
    personalBank: userProfile.profile?.bank_account ?? 0,
    fairySouls: {
      found: userProfile.fairy_soul?.total_collected ?? 0,
      total: FAIRY_SOULS[profile.game_mode ?? "normal"] ?? FAIRY_SOULS["normal"]
    },
    apiSettings: getAPISettings(profile, userProfile, museumData)
  };
}
