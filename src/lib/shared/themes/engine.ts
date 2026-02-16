import { DEFAULT_THEME } from "./defaults";
import { getPaletteColors } from "./presets";
import type { PartialThemeV3, ThemeV3 } from "./schema";

/**
 * Deep merge partial theme with DEFAULT_THEME
 * Reconstructs full ThemeV3 from user overrides
 */
export function mergeThemeWithDefaults(partial: PartialThemeV3): ThemeV3 {
  const merged: ThemeV3 = {
    ...DEFAULT_THEME,
    ...partial,
    colors: {
      ...DEFAULT_THEME.colors,
      ...partial.colors
    },
    backgrounds: {
      ...DEFAULT_THEME.backgrounds,
      ...partial.backgrounds,
      skillbar: partial.backgrounds?.skillbar ?? DEFAULT_THEME.backgrounds.skillbar,
      maxedbar: partial.backgrounds?.maxedbar ?? DEFAULT_THEME.backgrounds.maxedbar,
      page: partial.backgrounds?.page ?? DEFAULT_THEME.backgrounds.page
    },
    minecraft: {
      ...DEFAULT_THEME.minecraft,
      ...partial.minecraft,
      palette: partial.minecraft?.palette ?? DEFAULT_THEME.minecraft.palette,
      overrides: partial.minecraft?.overrides ?? DEFAULT_THEME.minecraft.overrides
    },
    metadata: {
      ...DEFAULT_THEME.metadata,
      ...partial.metadata
    }
  };

  return merged;
}

/**
 * ThemeEngine: Applies theme CSS variables to DOM
 */
export class ThemeEngine {
  /**
   * Apply theme to document root
   */
  static applyTheme(theme: ThemeV3): void {
    if (typeof document === "undefined") return; // SSR guard
    const root = document.documentElement;

    // Set data attributes
    root.dataset.theme = theme.metadata.id;
    root.dataset.mode = theme.light ? "light" : "dark";

    // Set dark/light classes
    if (theme.light) {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }

    // Apply color CSS variables
    root.style.setProperty("--icon", theme.colors.icon);
    root.style.setProperty("--link", theme.colors.link);
    root.style.setProperty("--hover", theme.colors.hover);
    root.style.setProperty("--maxed", theme.colors.maxed);
    root.style.setProperty("--gold", theme.colors.gold);
    root.style.setProperty("--logo", theme.colors.logo);
    root.style.setProperty("--text", theme.colors.text);
    root.style.setProperty("--background", theme.colors.background);
    root.style.setProperty("--header", theme.colors.header);
    root.style.setProperty("--grey_background", theme.colors.greyBackground);
    root.style.setProperty("--lore_background", theme.colors.loreBackground);
    root.style.setProperty("--bg", theme.colors.bg);
    root.style.setProperty("--mctooltip-bg", theme.colors.mctooltipBg);

    // Apply Minecraft palette colors (§0-§f)
    const mcColors = getPaletteColors(theme.minecraft.palette, theme.minecraft.overrides);
    Object.entries(mcColors).forEach(([code, color]) => {
      root.style.setProperty(`--${code}`, color);
    });

    // Apply background styles
    if (theme.backgrounds.skillbar.type === "color") {
      root.style.setProperty("--skillbar", theme.backgrounds.skillbar.color);
    } else {
      const { angle, colors, width } = theme.backgrounds.skillbar;
      root.style.setProperty("--skillbar", `repeating-linear-gradient(${angle}, ${colors[0]} 0px, ${colors[0]} ${width}px, ${colors[1]} ${width}px, ${colors[1]} ${width * 2}px)`);
    }

    if (theme.backgrounds.maxedbar.type === "color") {
      root.style.setProperty("--maxedbar", theme.backgrounds.maxedbar.color);
    } else {
      const { angle, colors, width } = theme.backgrounds.maxedbar;
      root.style.setProperty("--maxedbar", `repeating-linear-gradient(${angle}, ${colors[0]} 0px, ${colors[0]} ${width}px, ${colors[1]} ${width}px, ${colors[1]} ${width * 2}px)`);
    }

    // Apply page background
    if (theme.backgrounds.page?.url) {
      root.style.setProperty("--bg-url", `url(/api/image-proxy?url=${encodeURIComponent(theme.backgrounds.page.url)})`);
    } else {
      root.style.removeProperty("--bg-url");
    }

    // Apply enchanted glint
    if (theme.enchantedGlint) {
      root.style.setProperty("--enchanted-glint", `url(/api/image-proxy?url=${encodeURIComponent(theme.enchantedGlint)})`);
    } else {
      root.style.removeProperty("--enchanted-glint");
    }
  }
}
