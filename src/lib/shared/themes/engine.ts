import { DEFAULT_THEME } from "./defaults";
import { getPaletteColors } from "./presets";
import type { PartialThemeV3, ThemeBackground, ThemeColorKey, ThemeV3 } from "./schema";

const COLOR_CSS_MAP: Record<ThemeColorKey, string> = {
  icon: "--icon",
  link: "--link",
  hover: "--hover",
  maxed: "--maxed",
  gold: "--gold",
  logo: "--logo",
  text: "--text",
  background: "--background",
  header: "--header",
  greyBackground: "--grey_background",
  loreBackground: "--lore_background",
  bg: "--bg",
  mctooltipBg: "--mctooltip-bg"
};

export function mergeThemeWithDefaults(partial: PartialThemeV3): ThemeV3 {
  return {
    schema: 3,
    light: partial.light ?? DEFAULT_THEME.light,
    colors: partial.colors,
    backgrounds: partial.backgrounds,
    minecraft: {
      palette: partial.minecraft?.palette ?? DEFAULT_THEME.minecraft.palette,
      overrides: partial.minecraft?.overrides ?? DEFAULT_THEME.minecraft.overrides
    },
    enchantedGlint: partial.enchantedGlint,
    metadata: {
      ...DEFAULT_THEME.metadata,
      ...partial.metadata
    }
  };
}

function applyBackgroundVar(root: HTMLElement, cssVar: string, bg: ThemeBackground | undefined): void {
  if (!bg) {
    root.style.removeProperty(cssVar);
    return;
  }

  if (bg.type === "color") {
    root.style.setProperty(cssVar, bg.color);
  } else {
    const { angle, colors, width } = bg;
    root.style.setProperty(cssVar, `repeating-linear-gradient(${angle}, ${colors[0]} 0px, ${colors[0]} ${width}px, ${colors[1]} ${width}px, ${colors[1]} ${width * 2}px)`);
  }
}

export class ThemeEngine {
  static applyTheme(theme: ThemeV3): void {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    root.dataset.theme = theme.metadata.id;
    root.dataset.mode = theme.light ? "light" : "dark";

    if (theme.light) {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }

    for (const [key, cssVar] of Object.entries(COLOR_CSS_MAP)) {
      const value = theme.colors?.[key as ThemeColorKey];
      if (value) {
        root.style.setProperty(cssVar, value);
      } else {
        root.style.removeProperty(cssVar);
      }
    }

    const mcColors = getPaletteColors(theme.minecraft.palette, theme.minecraft.overrides);
    for (const [code, color] of Object.entries(mcColors)) {
      root.style.setProperty(`--${code}`, color);
    }

    applyBackgroundVar(root, "--skillbar", theme.backgrounds?.skillbar);
    applyBackgroundVar(root, "--maxedbar", theme.backgrounds?.maxedbar);

    if (theme.backgrounds?.page?.url) {
      root.style.setProperty("--bg-url", `url(/api/image-proxy?url=${encodeURIComponent(theme.backgrounds.page.url)})`);
    } else {
      root.style.removeProperty("--bg-url");
    }

    if (theme.enchantedGlint) {
      root.style.setProperty("--enchanted-glint", `url(/api/image-proxy?url=${encodeURIComponent(theme.enchantedGlint)})`);
    } else {
      root.style.removeProperty("--enchanted-glint");
    }
  }
}
