import { getEnchantments } from "$lib/shared/api/skycrypt-api.remote";
import { setMaxEnchantments } from "$lib/shared/constants/enchantments";
import type { LayoutServerLoad } from "./$types";

export const load = (async () => {
  try {
    const maxEnchantments = await getEnchantments();
    setMaxEnchantments(maxEnchantments);
    return { maxEnchantments };
  } catch (error) {
    console.error("Failed to load max-level enchantments", error);
    setMaxEnchantments([]);
    return { maxEnchantments: [] };
  }
}) satisfies LayoutServerLoad;
