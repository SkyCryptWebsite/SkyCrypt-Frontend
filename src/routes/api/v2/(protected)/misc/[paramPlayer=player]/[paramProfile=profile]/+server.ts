import { fetchPlayer, getProfile } from "$lib/server/lib.js";
import { getMisc } from "$lib/server/stats/misc.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const { paramPlayer, paramProfile } = params;

  const [profile, player] = await Promise.all([getProfile(paramPlayer, paramProfile as string, { cache: true }), fetchPlayer(paramPlayer, { cache: true })]);

  const misc = getMisc(profile.members[paramPlayer], profile, player);

  return json(misc);
}
