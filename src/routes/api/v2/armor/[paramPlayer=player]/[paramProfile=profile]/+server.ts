import { getMainItems } from "$lib/server/stats/main_items.js";
import { json } from "@sveltejs/kit";

export async function GET({ params, cookies }) {
  const { paramProfile = null } = params;

  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");
  const stats = await getMainItems(paramProfile as string, packs);

  return json(stats);
}
