import { fetchPlayer, getProfile, getUUID } from "$lib/server/lib";
import { getMainStats } from "$lib/server/stats/main_stats.js";
import { generateToken } from "$lib/server/token";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
export const load = (async ({ params, cookies, getClientAddress, request, route }) => {
  const { ign: paramPlayer, profile: paramProfile = null } = params;
  const ip = getClientAddress();
  const userAgent = request.headers.get("User-Agent");
  const routeId = route.id;
  if (!ip) {
    error(400, "IP address not found");
  }
  if (!userAgent) {
    error(400, "User-Agent header not found");
  }

  const uuid = await getUUID(paramPlayer, { cache: true });
  const [profile, player] = await Promise.all([getProfile(uuid, paramProfile, { cache: true }), fetchPlayer(uuid, { cache: true })]);
  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");

  const stats = getMainStats(profile.members[profile.uuid], profile, player, packs);

  return {
    stats,
    api_token: generateToken(ip, userAgent, routeId)
  };
}) satisfies PageServerLoad;
