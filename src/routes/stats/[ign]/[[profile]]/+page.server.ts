import { fetchPlayer, getProfile, getUUID } from "$lib/server/lib";
import { getMainStats } from "$lib/server/stats/main_stats.js";
import type { PageServerLoad } from "./$types";
export const load = (async ({ params, cookies }) => {
  const { ign: paramPlayer, profile: paramProfile = null } = params;

  const uuid = await getUUID(paramPlayer, { cache: true });
  const [profile, player] = await Promise.all([getProfile(uuid, paramProfile, { cache: true }), fetchPlayer(uuid, { cache: true })]);
  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");

  const stats = getMainStats(profile.members[profile.uuid], profile, player, packs);

  return {
    stats
  };
}) satisfies PageServerLoad;
