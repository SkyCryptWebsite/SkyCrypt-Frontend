import { getEmbedData } from "$lib/shared/api/skycrypt-api.remote";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const { ign: paramPlayer, profile: paramProfile = null } = params;

  return {
    embed: await getEmbedData({ uuid: paramPlayer, profileId: paramProfile ?? undefined })
  };
}) satisfies PageServerLoad;
