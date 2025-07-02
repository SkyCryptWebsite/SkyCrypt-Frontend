import { getProfile } from "$lib/server/lib.js";
import { getBestiary } from "$lib/server/stats/bestiary.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const { paramPlayer, paramProfile } = params;

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const bestiary = getBestiary(profile.members[paramPlayer]);

  return json(bestiary);
}
