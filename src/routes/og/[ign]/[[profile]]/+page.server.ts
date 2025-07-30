import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  // TODO: Not implemented in GO yet
  error(501, "This endpoint is not implemented in GO yet");
  // const { ign: paramPlayer, profile: paramProfile = null } = params;

  // const uuid = await getUUID(paramPlayer, { cache: true });
  // const profileId = !paramProfile || !isUUID(paramProfile) ? (await getProfile(uuid, paramProfile, { cache: true })).profile_id : paramProfile;

  // const data = await REDIS.get(`embed_data:${uuid}:${profileId}`);
  // if (!data) {
  //   error(404, "Embed data not found");
  // }

  // const embedData = JSON.parse(data) as EmbedV2 & { message?: string };

  // if (embedData.message) {
  //   error(500, embedData.message);
  // }

  // return {
  //   embed: embedData as EmbedV2
  // };
}) satisfies PageServerLoad;
