import { MAX_ENCHANTS } from "$lib/shared/constants/enchantments";
import { colorCodes, extras } from "$lib/shared/motd/parser/styleLibrary";
import { BASE_FORMATTING_CODE_REGEX, htmlStringFormatting } from "$lib/shared/motd/parser/utils";

/**
 * Convert motd text to html.
 *
 * This function parses Minecraft-style formatting codes (like §a, §l, §r) and converts them
 * to HTML with appropriate CSS classes and inline styles. It handles:
 * - Color codes (§a-§f, §0-§9) - converted to CSS color values
 * - Formatting codes (§l bold, §o italic, §n underline, etc.) - converted to CSS classes
 * - Reset codes (§r resets all, §f resets formatting only)
 * - Special rainbow enchantment animation for max-level enchants with blue color
 * - Animation delays for the rainbow effect based on the index parameter
 *
 * @param motdString The motd string to convert. (e.g. "§aHello §bWorld")
 * @param breakLine Whether to add a line break at the end of the string.
 * @param index Optional index for animation delay calculation
 * @returns The HTML to render.
 */
export default function motdTextToHTML(...args: [{ motdString: string; breakLine?: boolean; index?: number }]): string {
  const [{ motdString, breakLine = true, index: loreIndex }] = args;

  // Split the motd string by formatting codes (§a, §b, etc.) and filter out empty strings
  // This creates an array where formatting codes and text alternate
  const codeSplit: string[] = motdString.split(BASE_FORMATTING_CODE_REGEX).filter((item) => item !== "");

  // Track current CSS classes to apply (bold, italic, etc.)
  let classList: string[] = [];
  // Track current color as CSS color value
  let colorVar: string | undefined;
  // Accumulate the final HTML string
  let resultHTML: string = "";
  // Flag to check if we should apply rainbow color effect (triggered by §9 blue color code)
  let shouldRainbowColorCheck = false;
  // Flag to check if current text contains max-level enchantments (for special rainbow effect)
  let shouldRainbowEnchantedCheck = false;

  codeSplit.forEach((item: string, index: number) => {
    const motdStringToLowerCase = item.toLowerCase();

    // Check if current item is a color code (§a, §b, etc.)
    if (Object.hasOwn(colorCodes, motdStringToLowerCase)) {
      colorVar = colorCodes[motdStringToLowerCase];

      switch (motdStringToLowerCase) {
        // §f (white) acts as a reset for all formatting except color
        case "§f":
          classList = [];
          shouldRainbowColorCheck = false;
          break;
        // §9 (blue) enables rainbow color checking for enchanted items
        case "§9":
          shouldRainbowColorCheck = true;
          break;
        default:
          break;
      }
    }
    // Check if current item is a formatting code (§l bold, §o italic, etc.) or reset (§r)
    else if (Object.hasOwn(extras, motdStringToLowerCase)) {
      if (motdStringToLowerCase === "§r") {
        // §r resets everything - color and formatting
        colorVar = undefined;
        classList = [];
      } else {
        // Apply formatting styles (bold, italic, underline, etc.)
        classList = extras[motdStringToLowerCase];
      }
    }
    // Current item is actual text content, not a formatting code
    else {
      const resultColor: string | undefined = colorVar ? `color: ${colorVar};` : undefined;
      // Escape HTML characters to prevent XSS attacks and display properly
      const textContent: string = item !== "" ? htmlStringFormatting(item) : item;

      // Check if the text contains max-level enchantments (for special rainbow effect)
      switch (MAX_ENCHANTS.has(item)) {
        case true:
          shouldRainbowEnchantedCheck = true;
          break;

        default:
          shouldRainbowEnchantedCheck = false;
          break;
      }

      // Only create HTML elements for non-empty text content
      if (textContent !== "") {
        const spanEl = document.createElement("span");

        // Apply color styling if a color is set
        if (resultColor && colorVar) spanEl.style.color = colorVar;

        // Special case: Apply rainbow enchantment effect when both conditions are met:
        // 1. Blue color code (§9) was encountered (shouldRainbowColorCheck)
        // 2. Text contains max-level enchantments (shouldRainbowEnchantedCheck)
        if (shouldRainbowColorCheck && shouldRainbowEnchantedCheck) {
          classList.push("lore-enchantment");
          // Add animation delay for lore items (creates a typewriter effect)
          if (loreIndex) spanEl.style.animationDelay = `${index * loreIndex * 2}ms`;
        } else {
          // Remove enchantment class if conditions are no longer met
          classList = classList.filter((cls) => cls !== "lore-enchantment");
        }

        // Apply all accumulated CSS classes (bold, italic, enchantment effects, etc.)
        if (classList.length) spanEl.classList.add(...classList);
        spanEl.innerHTML = textContent;

        // Add the span element to our result HTML
        resultHTML += spanEl.outerHTML;
      }
    }
  });

  // Add a line break at the end if specified
  if (breakLine) {
    const brEl = document.createElement("br");
    resultHTML += brEl.outerHTML;
  }

  return resultHTML;
}
