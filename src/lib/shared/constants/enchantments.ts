import { getEnchantmentsContext } from "$ctx";

/** Check whether an enchantment is at its maximum level according to the backend constants. */
export function isMaxEnchantment(enchantment: string): boolean {
  return getEnchantmentsContext().current.includes(enchantment);
}
