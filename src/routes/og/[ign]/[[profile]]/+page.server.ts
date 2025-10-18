import { env } from "$env/dynamic/public";
import type { EmbedV2 } from "$types/statsv2";
import { error } from "@sveltejs/kit";
import ky from "ky";
import type { PageServerLoad } from "./$types";
const { PUBLIC_SERVER_API_URL } = env;

export const load = (async ({ params }) => {
  const { ign: paramPlayer, profile: paramProfile = null } = params;

  try {
    const embedData = await ky(`embed/${paramPlayer}${paramProfile ? "/" + paramProfile : ""}`, {
      prefixUrl: PUBLIC_SERVER_API_URL
    }).json<{ embed: EmbedV2 } | { error?: string }>();

    if ("error" in embedData && embedData.error) {
      error(500, embedData.error);
    }

    if ("embed" in embedData) {
      return {
        embed: embedData.embed
      };
    }

    error(500, "Invalid response format");
  } catch (err) {
    console.error("Error fetching embed data:", err);
    error(500, "Failed to fetch embed data");
  }
}) satisfies PageServerLoad;
