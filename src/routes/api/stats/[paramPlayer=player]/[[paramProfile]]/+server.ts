import { fetchMuseum, fetchPlayer, getProfile } from "$lib/server/lib";
import { error, json } from "@sveltejs/kit";
import { promisify } from "util";
import { gzip } from "zlib";
import type { RequestHandler } from "./$types";

const gzipPromise = promisify(gzip);

type APIError = { message: string };

export const GET: RequestHandler = async ({ params, cookies, request }) => {
  try {
    const { paramPlayer, paramProfile = null } = params;

    const [profile, player] = await Promise.all([getProfile(paramPlayer, paramProfile, { cache: true }), fetchPlayer(paramPlayer, { cache: true })]);
    const museum = await fetchMuseum(profile.profile_id);

    const packs = JSON.parse(cookies.get("disabledPacks") || "[]");
    // const stats = await getStats(profile, player, { museum, packs });
    const stats = { profile, player, museum, packs };

    const acceptsGzip = request.headers.get("accept-encoding")?.includes("gzip");
    if (acceptsGzip) {
      const jsonData = JSON.stringify(stats);
      const compressedData = await gzipPromise(jsonData);
      return new Response(compressedData, {
        headers: {
          "Content-Type": "application/json",
          "Content-Encoding": "gzip"
        }
      });
    }

    return json(stats);
  } catch (e) {
    return error(500, (e as APIError).message);
  }
};
