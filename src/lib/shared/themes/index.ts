export { DEFAULT_THEME } from "./defaults";
export { mergeThemeWithDefaults, ThemeEngine } from "./engine";
export { getPaletteColors, MC_PALETTES, paletteNames } from "./presets";
export { partialThemeV3Schema, themeV3Schema, type ColorBackground, type PartialThemeV3, type StripesBackground, type ThemeBackground, type ThemeColorKey, type ThemeColors, type ThemeV3 } from "./schema";
export { decodeTheme, encodeTheme, getThemeShareURL, parseThemeFromURL } from "./sharing";
