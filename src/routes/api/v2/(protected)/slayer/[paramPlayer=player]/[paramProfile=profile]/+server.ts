import { getProfile } from "$lib/server/lib.js";
import { getSlayer } from "$lib/server/stats/slayer.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const { paramPlayer, paramProfile } = params;

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const slayer = getSlayer(profile.members[paramPlayer]);

  return json(slayer);
}
