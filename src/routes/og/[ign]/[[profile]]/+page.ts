import { api, SectionName } from "$lib/shared/api";
import type { EmbedV2 } from "$types/statsv2";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

type APIError = { body?: { message?: string } };

export const load = (async ({ parent, params, fetch }) => {
  const { queryClient } = await parent();
  const { ign, profile } = params;

  try {
    await queryClient.prefetchQuery<EmbedV2>({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: [SectionName.EMBED, ign, profile],
      queryFn: () => api(fetch).getSection(SectionName.EMBED, ign, profile)
    });
  } catch (e) {
    error(500, (e as APIError).body?.message ?? "Failed to fetch data");
  }
}) satisfies PageLoad;
