import { superValidate } from "sveltekit-superforms";
import { zod4 as zod } from "sveltekit-superforms/adapters";
import type { LayoutServerLoad } from "./$types";
import { schema } from "./schema";

export const load = (async () => {
  return {
    searchForm: await superValidate(zod(schema))
  };
}) satisfies LayoutServerLoad;
