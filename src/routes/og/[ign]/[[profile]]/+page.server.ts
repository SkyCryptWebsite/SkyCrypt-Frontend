import type { EmbedV2 } from "$types/statsv2";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch, params }) => {
  const { ign, profile } = params;

  const response = await fetch(`/api/v2/embed/${ign}${profile ? "/" + profile : ""}`);
  if (!response.ok && response.status !== 500) {
    throw new Error(`${response.status} - Failed to fetch embed - ${response.statusText}`);
  }
  const data = (await response.json()) as EmbedV2 & { message?: string };
  if (data.message) {
    error(500, data.message);
  }

  return {
    embed: data as EmbedV2
  };
}) satisfies PageServerLoad;
