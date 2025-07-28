import { getGarden } from "$lib/server/lib";
import { formatGarden } from "$lib/server/stats/garden";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  const { paramProfile } = params;

  const garden = await getGarden(paramProfile);
  const gardenData = formatGarden(garden);

  return json(gardenData);
};
