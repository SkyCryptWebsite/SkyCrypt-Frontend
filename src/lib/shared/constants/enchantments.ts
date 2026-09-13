/** Max-level enchantment lore strings returned by the backend constants endpoint. */
export const MAX_ENCHANTS = new Set<string>();

/** Replace the runtime enchantment set with the backend-owned list. */
export function setMaxEnchantments(enchantments: readonly string[]): void {
  MAX_ENCHANTS.clear();
  for (const enchantment of enchantments) {
    MAX_ENCHANTS.add(enchantment);
  }
}
