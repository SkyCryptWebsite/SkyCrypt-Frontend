import { browser } from "$app/environment";
import { QueryClient } from "@tanstack/svelte-query";
import type { LayoutLoad } from "./$types";

export const load = (async ({ data }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        staleTime: 60 * 1000
      }
    }
  });
  return {
    searchForm: data.searchForm,
    queryClient
  };
}) satisfies LayoutLoad;
