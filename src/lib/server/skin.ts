import ky from "ky";

interface ProfileResponse {
  properties: { name: string; value: string; signature?: string }[];
}

function sanitizeUrl(url?: string): string | undefined {
  return url ? url.replace(/^http:/, "https:") : undefined;
}

/** Looks up a player's skin and cape texture URLs through the Mojang session server. */
export async function fetchSkinTextures(uuid: string) {
  const profile = await ky(
    `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`
  ).json<ProfileResponse>();

  const texturesProperty = profile.properties.find((prop) => prop.name === "textures");

  if (!texturesProperty?.value) {
    throw new Error("No texture properties found");
  }

  const texturesJson = JSON.parse(atob(texturesProperty.value));
  const skinUrl = sanitizeUrl(texturesJson.textures?.SKIN?.url);
  const capeUrl = sanitizeUrl(texturesJson.textures?.CAPE?.url);

  if (!skinUrl) {
    throw new Error("No skin URL present in texture payload");
  }

  return { skinUrl, capeUrl };
}

export type SkinTextures = Awaited<ReturnType<typeof fetchSkinTextures>>;

/** Caches lookups per UUID, sharing one in-flight request. Failures aren't kept, so the next call retries. */
export function createSkinTexturesCache(
  fetchTextures: (uuid: string) => Promise<SkinTextures>,
  ttlMs: number,
  maxEntries: number,
  now: () => number = Date.now
) {
  const cache = new Map<string, { expiresAt: number; textures: Promise<SkinTextures> }>();
  return (uuid: string): Promise<SkinTextures> => {
    const key = uuid.replaceAll("-", "").toLowerCase();
    const hit = cache.get(key);
    if (hit && hit.expiresAt > now()) return hit.textures;

    cache.delete(key);
    if (cache.size >= maxEntries) cache.delete(cache.keys().next().value!);
    const textures = fetchTextures(key);
    cache.set(key, { expiresAt: now() + ttlMs, textures });
    textures.catch(() => {
      if (cache.get(key)?.textures === textures) cache.delete(key);
    });
    return textures;
  };
}

// Mojang rate limits the session server per IP, and every visitor's 3D skin goes through this server.
export const cachedSkinTextures = createSkinTexturesCache(fetchSkinTextures, 60 * 60 * 1000, 5000);
