import { getProfile } from "$lib/server/lib.js";
import { getMinions } from "$lib/server/stats/minions.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const { paramPlayer, paramProfile } = params;

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const minions = getMinions(profile);

  return json(minions);
}
