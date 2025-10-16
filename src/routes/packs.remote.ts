import { query } from "$app/server";
import { env } from "$env/dynamic/public";
import type { ResourcePacks } from "$lib/shared/constants/packs";
import { error, isHttpError } from "@sveltejs/kit";

const { PUBLIC_SERVER_API_URL } = env;

export const getPacks = query(async () => {
  try {
    const packsRes = await fetch(PUBLIC_SERVER_API_URL + "resourcepacks");
    const packs: { resourcepacks: ResourcePacks; message?: string } = await packsRes.json();
    if (packs.message) {
      console.error(packs.message);
      error(500, packs.message);
    }

    return packs;
  } catch (err) {
    if (isHttpError(err)) {
      error(err.status, err.body);
    }
    console.error("Error fetching resource packs:", err);
    error(500, "Failed to fetch resource packs");
  }
});
