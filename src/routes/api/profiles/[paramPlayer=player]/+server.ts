import { getProfiles } from "$lib/server/lib";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

// GET /api/profiles/[id=player]
export const GET: RequestHandler = async ({ params }) => {
  const { paramPlayer } = params;
  if (!paramPlayer) {
    throw error(404, "Profiles not found");
  }

  const profiles = await getProfiles(paramPlayer).catch((e) => {
    throw error(404, e.message);
  });

  return json(profiles);
};
