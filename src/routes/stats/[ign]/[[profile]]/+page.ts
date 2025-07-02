import { api } from "$lib/shared/api";
import type { StatsV2 } from "$types/statsv2";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

type APIError = { body?: { message?: string } };

export const load = (async ({ parent, params, fetch }) => {
  const { queryClient } = await parent();
  const { ign, profile } = params;

  try {
    await queryClient.prefetchQuery<StatsV2>({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: ["profile", ign, profile],
      queryFn: () => api(fetch).getProfile(ign, profile)
    });
  } catch (e) {
    error(500, (e as APIError).body?.message ?? "Failed to fetch data");
  }
}) satisfies PageLoad;
