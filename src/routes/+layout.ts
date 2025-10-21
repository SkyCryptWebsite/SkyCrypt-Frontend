import { getPacks } from "$lib/shared/api/skycrypt-api.remote";
import type { LayoutLoad } from "./$types";

export const load = (async ({ data }) => {
  return {
    searchForm: data.searchForm,
    packs: await getPacks()
  };
}) satisfies LayoutLoad;
