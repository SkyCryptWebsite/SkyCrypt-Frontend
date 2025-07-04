import { REDIS } from "$lib/server/db/redis.js";
import { getProfile, getUUID } from "$lib/server/lib.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const { paramPlayer, paramProfile = null } = params;

  const uuid = await getUUID(paramPlayer, { cache: true });
  const profileId = !paramProfile ? (await getProfile(uuid, null, { cache: true })).profile_id : paramProfile;

  const data = await REDIS.get(`embed_data:${uuid}:${profileId}`);
  if (!data) {
    return json({ error: "Embed data not found" }, { status: 404 });
  }

  const embedData = JSON.parse(data);

  return json(embedData);
}
