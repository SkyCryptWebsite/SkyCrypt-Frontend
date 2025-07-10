import { validateURL } from "$lib/shared/helper";
import { z } from "zod/mini";

export const schema = z.object({
  query: z.string().check(
    z.refine((value) => validateURL(value), {
      error: "Please enter a valid Minecraft username or UUID"
    })
  )
});
