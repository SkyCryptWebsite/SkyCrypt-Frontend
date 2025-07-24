import { getProfile } from "$lib/server/lib.js";
import { getPets } from "$lib/server/stats/pets.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const { paramPlayer, paramProfile } = params;
  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const pets = await getPets(profile.members[paramPlayer], profile);
  if (!pets) {
    return json({});
  }

  return json(pets);
}
