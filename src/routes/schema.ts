import { validateURL } from "$lib/shared/helper";
import { z } from "zod/v4-mini";

export const schema = z.object({
  query: z.string().check(
    z.refine((value) => validateURL(value), {
      error: "Please enter a valid Minecraft username or UUID"
    })
  )
});
