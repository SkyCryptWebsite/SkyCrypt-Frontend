/** Lexical text-format bitfield flags. */
export const FORMAT = {
  BOLD: 1,
  ITALIC: 2,
  STRIKETHROUGH: 4,
  UNDERLINE: 8,
  CODE: 16
} as const;

export type Modifier = "bold" | "italic" | "underline" | "strikethrough" | "code";

/** Active text modifiers for a Lexical text node's `format` bitfield, outermost first. */
export function getActiveModifiers(format: number | string | undefined): Modifier[] {
  const bits = typeof format === "number" ? format : 0;
  const mods: Modifier[] = [];
  if (bits & FORMAT.BOLD) mods.push("bold");
  if (bits & FORMAT.ITALIC) mods.push("italic");
  if (bits & FORMAT.UNDERLINE) mods.push("underline");
  if (bits & FORMAT.STRIKETHROUGH) mods.push("strikethrough");
  if (bits & FORMAT.CODE) mods.push("code");
  return mods;
}
