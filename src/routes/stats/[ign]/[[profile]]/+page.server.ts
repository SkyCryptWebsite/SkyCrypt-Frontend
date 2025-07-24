import { fetchPlayer, getProfile, getUUID } from "$lib/server/lib";
import { getMainStats } from "$lib/server/stats/main_stats.js";
import { generateDynamicKey, generateToken } from "$lib/server/token";
import { encodeBase64 } from "@oslojs/encoding";
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

  // Generate dynamic key based on request context (includes time window)
  const dynamicKey = generateDynamicKey(ip, userAgent, routeId);
  const tokenData = generateToken(ip, userAgent, routeId);
  const timeWindow = Math.floor(Date.now() / (5 * 60 * 1000)); // Same 5-minute interval

  return {
    stats,
    // Use dynamic key and include key identifier and time window in token data
    [encodeBase64(new TextEncoder().encode(dynamicKey))]: encodeBase64(
      new TextEncoder().encode(
        JSON.stringify({
          ...tokenData,
          keyId: dynamicKey, // Include the key identifier so client can find it
          timeWindow // Include time window for potential fallback key generation
        })
      )
    )
  };
}) satisfies PageServerLoad;
