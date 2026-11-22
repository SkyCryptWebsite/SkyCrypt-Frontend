import { getRequestEvent, query } from "$app/server";
import { z } from "zod";
import { cachedSkinTextures, fallbackSkinTextures } from "#lib/server/skin";

// The Mojang session server sends no CORS headers, so browsers can't ask it directly.
export const getSkinTextures = query(
  z.string().regex(/^[0-9a-f]{8}-?(?:[0-9a-f]{4}-?){3}[0-9a-f]{12}$/i),
  async (uuid) => {
    try {
      return await cachedSkinTextures(uuid);
    } catch (error) {
      getRequestEvent().locals.log.set({ skin: { fallback: true, reason: String(error) } });
      return fallbackSkinTextures(uuid);
    }
  }
);
