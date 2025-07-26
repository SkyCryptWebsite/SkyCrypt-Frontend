import { getProfile } from "$lib/server/lib.js";
import { getDungeons } from "$lib/server/stats/dungeons.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const { paramPlayer, paramProfile } = params;

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const dungeons = getDungeons(profile.members[paramPlayer]);

  return json(dungeons);
}
