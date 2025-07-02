import { fetchPlayer, getProfile, getUUID } from "$lib/server/lib";
import { getMainStats } from "$lib/server/stats/main_stats.js";
import { json } from "@sveltejs/kit";

export async function GET({ params, cookies }) {
  const { paramPlayer, paramProfile = null } = params;

  const uuid = await getUUID(paramPlayer, { cache: true });
  const [profile, player] = await Promise.all([getProfile(uuid, paramProfile, { cache: true }), fetchPlayer(uuid, { cache: true })]);
  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");

  const stats = await getMainStats(profile.members[profile.uuid], profile, player, packs);

  return json(stats);
}
