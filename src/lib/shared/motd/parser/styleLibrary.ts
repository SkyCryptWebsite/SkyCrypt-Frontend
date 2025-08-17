/**
 * Mapping of Minecraft MOTD style codes to (Tailwind) CSS classes.
 * This mapper provides a mapping of Minecraft MOTD style codes to CSS classes
 */
const extras: { [key: string]: string[] } = {
  "§k": ["obfuscated", "font-mono"],
  "§l": ["font-bold"],
  "§m": ["line-through"],
  "§n": ["underline"],
  "§o": ["font-italic"],
  "§r": ["color: inherit;text-decoration: none !important;font-weight:normal!important;font-style: normal!important;"]
} as const;

/**
 * Mapping of Minecraft MOTD color codes to (Tailwind) CSS variables.
 * This mapper provides a mapping of Minecraft MOTD color codes to CSS variables.
 */
const colorCodes: { [key: string]: string } = {
  "§0": "var(--§0)",
  "§1": "var(--§1)",
  "§2": "var(--§2)",
  "§3": "var(--§3)",
  "§4": "var(--§4)",
  "§5": "var(--§5)",
  "§6": "var(--§6)",
  "§7": "var(--§7)",
  "§8": "var(--§8)",
  "§9": "var(--§9)",
  "§a": "var(--§a)",
  "§b": "var(--§b)",
  "§c": "var(--§c)",
  "§d": "var(--§d)",
  "§e": "var(--§e)",
  "§f": "var(--§f)"
} as const;

export { colorCodes, extras };
