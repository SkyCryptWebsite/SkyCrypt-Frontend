import { getProfile } from "$lib/server/lib.js";
import { getCrimsonIsle } from "$lib/server/stats/crimson_isle.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const { paramPlayer, paramProfile } = params;

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const crimsonIsle = getCrimsonIsle(profile.members[paramPlayer]);

  return json(crimsonIsle);
}
