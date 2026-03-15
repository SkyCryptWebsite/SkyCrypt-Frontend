import { getContributors } from "$routes/contributors.remote";
import type { RequestHandler } from "@sveltejs/kit";
import * as sitemap from "super-sitemap";

const BASE_URL = "https://sky.shiiyu.moe";

export const GET: RequestHandler = async () => {
  const statsPaths = new Set<string>();

  try {
    const contributors = await getContributors();

    for (const contributor of contributors) {
      const ign = contributor.name ?? contributor.id;
      if (!ign) continue;
      statsPaths.add(`/stats/${encodeURIComponent(ign)}`);
    }
  } catch (error) {
    console.error("Failed to generate contributor sitemap entries", error);
  }

  return sitemap.response({
    origin: BASE_URL,
    additionalPaths: [...statsPaths],
    excludeRoutePatterns: ["^/api/.*", "^/stats.*"],
    headers: {
      "cache-control": "max-age=0, s-maxage=3600"
    }
  });
};
