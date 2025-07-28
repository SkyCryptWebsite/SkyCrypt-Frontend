import { getProfile } from "$lib/server/lib.js";
import { getCollections } from "$lib/server/stats/collections.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const { paramPlayer, paramProfile } = params;

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const collections = await getCollections(profile.members[paramPlayer], profile);

  return json(collections);
}
