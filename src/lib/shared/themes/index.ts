export { themeV3Schema, partialThemeV3Schema, type ThemeV3, type PartialThemeV3, type ThemeBackground, type ColorBackground, type StripesBackground } from "./schema";
export { DEFAULT_THEME } from "./defaults";
export { ThemeEngine, mergeThemeWithDefaults } from "./engine";
export { MC_PALETTES, paletteNames, getPaletteColors } from "./presets";
export { encodeTheme, decodeTheme, getThemeShareURL, parseThemeFromURL } from "./sharing";
