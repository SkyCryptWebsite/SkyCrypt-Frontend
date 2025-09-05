import { RARITY_COLORS } from "$lib/shared/constants/rarities";
import { motdTextToHTML } from "$lib/shared/motd";
import type { ProcessedSkyBlockItem } from "$types/global";
import { tz } from "@date-fns/tz";
import { format } from "date-fns";
import prettyMilliseconds from "pretty-ms";

export { prettyMilliseconds as formatTime };

/**
 * Formats a number using the compact notation (e.g., 1.2K, 3.4M).
 *
 * @param n - The number to format.
 * @param digits - The number of decimal places to include (default is 2).
 * @returns The formatted number as a string.
 */
export function formatNumber(n: number, digits = 2) {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })
    .format(n)
    .replace(/\.0+([A-Za-z])?$/, "$1");
}

/**
 * Converts a string to title case
 * @param {string} string
 * @returns {string}
 */
export function titleCase(string: string): string {
  return string
    .replaceAll(" ", "_")
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Returns the tailwind css color class for a rarity
 * @param {string} rarity the rarity of the item
 * @param {"bg" | "text"} type the type of color to get
 * @returns {string} the tailwind css color class
 */
export function getRarityClass(rarity: string, type: "bg" | "text"): string {
  const rarityColor = RARITY_COLORS[rarity.toLowerCase() as keyof typeof RARITY_COLORS];
  // minecraft colors are safelisted in the tailwind config, so they are always generated
  return rarityColor ? `${type}-minecraft-${rarityColor}` : "";
}

/**
 * Convert Minecraft lore to HTML
 * @param {string} text minecraft lore with color and formatting codes
 * @param {boolean} formatTime whether to format timestamps in the lore
 * @returns {string} HTML
 */
export function renderLore(text: string, formatTime: boolean = true, index?: number): string {
  let lore = motdTextToHTML({ motdString: text, index });

  if (formatTime) {
    const timestampRegex = /{TIMESTAMP:(\d+)}/g;
    const hasTimestamp = lore.match(timestampRegex);

    if (hasTimestamp) {
      const timestampValue = hasTimestamp[0];
      const hasTimestampMatch = timestampValue.match(/{TIMESTAMP:(\d+)}/);
      if (!hasTimestampMatch) return lore;
      const timestampNumber = hasTimestampMatch[1];

      if (isNaN(parseInt(timestampNumber, 10))) return lore;

      const formattedTime = format(parseInt(timestampNumber, 10), "MMM dd, yyyy, h:mm a", {
        in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
      });
      lore = lore.replace(timestampRegex, formattedTime);
    }
  }

  return lore;
}

/**
 * Removes Minecraft formatting codes from a string
 * @param {string} string
 * @returns {string}
 */
export function removeFormatting(string: string): string {
  return string.replaceAll(/§[0-9a-z]/g, "");
}

/**
 * Returns a new array with unique elements based on the specified key.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The array to filter for unique elements.
 * @param {string} key - The key to determine uniqueness.
 * @returns {T[]} A new array with unique elements based on the specified key.
 */
export function uniqBy<T>(arr: T[], key: string): T[] {
  const seen = new Set();
  return arr.filter((item) => {
    const k = (item as Record<string, unknown>)[key];
    return seen.has(k) ? false : seen.add(k);
  });
}

/**
 * Validates a URL and returns the path to the stats page
 * @param {string} url
 * @returns {string} The path to the stats page
 */
export function validateURL(url: string): boolean {
  const urlSegments = url.trim().split("/");
  if (urlSegments.length < 1) {
    console.error("Please enter a Minecraft username or UUID");
    return false;
  } else if (urlSegments.length > 2) {
    console.error(`"${url}" has too many "/"`);
    return false;
  } else {
    if (urlSegments.length === 2) {
      if (urlSegments[1].match(/^[A-Za-z]+/)) {
        urlSegments[1] = urlSegments[1].charAt(0).toUpperCase() + urlSegments[1].substring(1).toLowerCase();
      } else if (!urlSegments[1].match(/^([0-9a-fA-F]{32})$/)) {
        if (urlSegments[1] === "") {
          console.error(`Please enter valid profile name or UUID after "/"`);
          return false;
        }
        console.error(`"${urlSegments[1]}" is not a valid profile name or UUID`);
        return false;
      }
    }
    if (urlSegments[0].match(/^([0-9a-fA-F]{8})-?([0-9a-fA-F]{4})-?([0-9a-fA-F]{4})-?([0-9a-fA-F]{4})-?([0-9a-fA-F]{12})$/)) {
      urlSegments[0] = urlSegments[0].replaceAll("-", "");
    } else if (urlSegments[0].match(/^[\w ]{1,16}$/)) {
      urlSegments[0] = urlSegments[0].replace(" ", "_");
    } else {
      console.error(`"${urlSegments[0]}" is not a valid username or UUID`);
      return false;
    }
    return true;
  }
}

export function calculatePercentage(value: number, total: number, decimal: number = 2): string {
  if (total === 0 || value === 0) {
    return "0";
  }

  return Math.floor((value / total) * 100)
    .toFixed(decimal)
    .replace(/\.0+$/, "");
}

export function shouldShine(item: ProcessedSkyBlockItem): boolean | undefined {
  const enchanted = item.texture_path.includes("/api/leather/") ? false : item.shiny;
  return enchanted || item.shiny;
}
