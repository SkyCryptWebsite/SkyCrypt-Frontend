import { env } from "$env/dynamic/public";
import { generateDynamicKey, generateToken } from "$lib/server/token";
import type { StatsV2 } from "$types/statsv2";
import { encodeBase64 } from "@oslojs/encoding";
import { error } from "@sveltejs/kit";
import ky from "ky";
import type { PageServerLoad } from "./$types";

const { PUBLIC_SERVER_API_URL } = env;

export const load = (async ({ params, getClientAddress, request, route }) => {
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

  // Generate dynamic key based on request context (includes time window)Fetching
  const dynamicKey = generateDynamicKey(ip, userAgent, routeId);
  const tokenData = generateToken(ip, userAgent, routeId);
  const timeWindow = Math.floor(Date.now() / (5 * 60 * 1000)); // Same 5-minute interval

  // Create decoy objects to obfuscate the real token
  const generateDecoyData = (index: number) => ({
    token: Array.from({ length: 128 }, () => Math.random().toString(36).charAt(2)).join(""),
    timestamp: (Date.now() + Math.random() * 1000000).toString(),
    route: `/fake/route/${index}`,
    decoy: true,
    sessionId: Math.random().toString(36).substring(2),
    checksum: Math.random().toString(16).substring(2)
  });

  // Generate 3-7 decoy objects with random keys
  const numDecoys = Math.floor(Math.random() * 5) + 3; // 3-7 decoys
  const allObjects: Array<[string, string]> = [];

  // Add decoy objects
  for (let i = 0; i < numDecoys; i++) {
    const decoyKey = Array.from({ length: 32 }, () => Math.random().toString(36).charAt(2)).join("");
    const decoyData = generateDecoyData(i);
    allObjects.push([encodeBase64(new TextEncoder().encode(decoyKey)), encodeBase64(new TextEncoder().encode(JSON.stringify(decoyData)))]);
  }

  // Add the real token at a random position
  const realTokenEntry: [string, string] = [
    encodeBase64(new TextEncoder().encode(dynamicKey)),
    encodeBase64(
      new TextEncoder().encode(
        JSON.stringify({
          ...tokenData,
          keyId: dynamicKey, // Include the key identifier so client can find it
          timeWindow // Include time window for potential fallback key generation
        })
      )
    )
  ];

  // Insert real token at random position
  const randomPosition = Math.floor(Math.random() * (allObjects.length + 1));
  allObjects.splice(randomPosition, 0, realTokenEntry);

  // Convert back to object
  const shuffledObjects = Object.fromEntries(allObjects);

  console.error(`Fetching ${PUBLIC_SERVER_API_URL}stats/${paramPlayer}${paramProfile ? "/" + paramProfile : ""} with token keyId ${dynamicKey} at position ${randomPosition} of ${allObjects.length}`);

  return {
    stats: ky(`stats/${paramPlayer}${paramProfile ? "/" + paramProfile : ""}`, {
      prefixUrl: PUBLIC_SERVER_API_URL,
      headers: {
        Authorization: `Bearer ${tokenData.token}`,
        "X-Timestamp": tokenData.timestamp,
        "X-Route": tokenData.route
      }
    }).json<{ stats: StatsV2 }>(),
    ...shuffledObjects
  };
}) satisfies PageServerLoad;
