import type { EmbedV2 } from "$types/statsv2";
import { error } from "@sveltejs/kit";
import ky from "ky";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const { ign, profile } = params;

  const data = await ky(`/api/v2/embed/${ign}${profile ? "/" + profile : ""}`, {
    hooks: {
      beforeError: [
        (error) => {
          const { response } = error;

          if (!response.ok && response.status !== 500) {
            error.message = `${response.status} - Failed to fetch embed - ${response.statusText}`;
          }
          return error;
        }
      ]
    }
  }).json<EmbedV2 & { message?: string }>();

  if (data.message) {
    error(500, data.message);
  }

  return {
    embed: data as EmbedV2
  };
}) satisfies PageServerLoad;
