import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { z } from "zod";
import { cachedSkinTextures } from "#lib/server/skin";

// The Mojang session server sends no CORS headers, so browsers can't ask it directly.
export const getSkinTextures = query(
  z.string().regex(/^[0-9a-f]{8}-?(?:[0-9a-f]{4}-?){3}[0-9a-f]{12}$/i),
  async (uuid) => {
    try {
      return await cachedSkinTextures(uuid);
    } catch {
      error(502, "Couldn't load this player's skin.");
    }
  }
);
