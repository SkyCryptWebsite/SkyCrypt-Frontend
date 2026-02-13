import { getEmbedData } from "$lib/shared/api/skycrypt-api.remote";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, request }) => {
  const { ign: paramPlayer, profile: paramProfile = null } = params;
  const { headers } = request;
  const isBot = headers.get("X-Known-Bot") === "true";

  return {
    embed: isBot ? await getEmbedData({ uuid: paramPlayer, profileId: paramProfile ?? undefined }) : null,
    isBot
  };
}) satisfies PageServerLoad;
