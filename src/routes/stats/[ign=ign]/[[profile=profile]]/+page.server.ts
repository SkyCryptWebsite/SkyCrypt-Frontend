import { redirect } from "@sveltejs/kit";
import { getProfileEmbed, getSelectedProfileEmbed } from "#lib/shared/api/skycrypt-api.remote";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, isDataRequest }) => {
  const { ign: paramPlayer, profile: paramProfile = null } = params;
  // Crawlers still follow old links that put a missing profile in the URL as "null".
  if (paramProfile?.toLowerCase() === "null") redirect(301, `/stats/${encodeURIComponent(paramPlayer)}`);
  const embed = Promise.resolve(
    paramProfile
      ? getProfileEmbed({ uuid: paramPlayer, profileId: paramProfile })
      : getSelectedProfileEmbed({ uuid: paramPlayer })
  );

  // Crawlers and Discord only read the server-rendered head, so await it there. Client-side navigations stream it
  // instead of waiting on the embed before the page can start loading.
  if (!isDataRequest) return { embed: await embed };
  // A streamed rejection reaches the browser as an unhandled rejection when nothing awaits it (a hover preload) or an
  // {#await} without a catch rethrows it. The page reports load errors from its own stats boundary.
  return { embed: embed.catch(() => null) };
}) satisfies PageServerLoad;
