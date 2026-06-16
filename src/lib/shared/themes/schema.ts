import { z } from "zod";

/**
 * Theme V3 Zod Schema
 *
 * Comprehensive schema covering all ~40+ CSS variables for SkyCrypt themes.
 * Organized into logical groups: colors, backgrounds, minecraft, enchantedGlint, meta.
 *
 * Color and background properties are OPTIONAL — when omitted, the CSS cascade
 * provides the correct values (e.g., the `light` utility class in layout.css).
 * Only DEFAULT_THEME is expected to have all properties fully specified.
 */

// --- Helper Validators ---

/**
 * OKLCH color format validator
 * Example: "oklch(0.74 0.21 147.69)" or "oklch(0.74 0.21 147.69 / 0.5)"
 */
const oklchColorSchema = z.string().regex(/^oklch\(\s*[\d.]+%?\s+[\d.]+\s+[\d.]+(?:\s+\/\s+[\d.]+)?\s*\)$/, "Must be a valid OKLCH color format: oklch(L C H) or oklch(L C H / A)");

/**
 * HTTPS URL validator (no HTTP allowed for security)
 */
const httpsUrlSchema = z
  .string()
  .url()
  .refine((url) => url.startsWith("https://"), {
    message: "URL must use HTTPS protocol"
  });

// --- Background Types ---

/**
 * Solid color background
 */
const colorBackgroundSchema = z.object({
  type: z.literal("color"),
  color: oklchColorSchema
});

/**
 * Striped background with angle, colors, and width
 */
const stripesBackgroundSchema = z.object({
  type: z.literal("stripes"),
  angle: z.string(), // e.g., "45deg", "90deg"
  colors: z.tuple([oklchColorSchema, oklchColorSchema]), // Exactly 2 colors
  width: z.number().positive()
});

/**
 * Discriminated union for background types
 */
const backgroundSchema = z.discriminatedUnion("type", [colorBackgroundSchema, stripesBackgroundSchema]);

// --- Color Schema (individual properties optional) ---

const colorsSchema = z.object({
  icon: oklchColorSchema.optional(),
  link: oklchColorSchema.optional(),
  hover: oklchColorSchema.optional(),
  maxed: oklchColorSchema.optional(),
  gold: oklchColorSchema.optional(),
  logo: oklchColorSchema.optional(),
  text: oklchColorSchema.optional(),
  background: oklchColorSchema.optional(),
  header: oklchColorSchema.optional(),
  greyBackground: oklchColorSchema.optional(),
  loreBackground: oklchColorSchema.optional(),
  bg: oklchColorSchema.optional(),
  mctooltipBg: oklchColorSchema.optional()
});

// --- Background Container Schema (individual properties optional) ---

const backgroundsSchema = z.object({
  skillbar: backgroundSchema.optional(),
  maxedbar: backgroundSchema.optional(),
  page: z
    .object({
      url: httpsUrlSchema
    })
    .optional()
});

// --- Main Theme Schema ---

/**
 * Theme V3 Schema
 *
 * Color and background properties are individually optional.
 * When a CSS property is omitted, it won't be applied to the DOM,
 * allowing the CSS cascade (e.g., layout.css light/dark defaults) to take effect.
 */
export const themeV3Schema = z.object({
  schema: z.literal(3),
  light: z.boolean().default(false),
  colors: colorsSchema.optional(),
  backgrounds: backgroundsSchema.optional(),
  minecraft: z.object({
    palette: z.enum(["nice-dark", "nice-light", "true-colors", "april-fools-2024"]).default("nice-dark"),
    overrides: z
      .record(z.string(), oklchColorSchema)
      .refine((data) => Object.keys(data).every((key) => /^[0-9a-f]$/.test(key)), {
        message: "Override keys must be single hex characters (0-9, a-f)"
      })
      .optional()
  }),
  enchantedGlint: httpsUrlSchema.optional(),
  metadata: z.object({
    id: z.string().min(1, "Theme ID is required"),
    name: z.string().min(1, "Theme name is required"),
    author: z.string().min(1, "Author is required"),
    createdAt: z.number().int().positive(),
    updatedAt: z.number().int().positive(),
    version: z.number().int().positive().default(1)
  })
});

/**
 * Partial theme schema for URL sharing / user overrides.
 * ALL fields are optional including metadata.
 */
export const partialThemeV3Schema = z.object({
  schema: z.literal(3).optional(),
  light: z.boolean().optional(),
  colors: colorsSchema.optional(),
  backgrounds: backgroundsSchema.optional(),
  minecraft: z
    .object({
      palette: z.enum(["nice-dark", "nice-light", "true-colors", "april-fools-2024"]).optional(),
      overrides: z
        .record(z.string(), oklchColorSchema)
        .refine((data) => Object.keys(data).every((key) => /^[0-9a-f]$/.test(key)), {
          message: "Override keys must be single hex characters (0-9, a-f)"
        })
        .optional()
    })
    .optional(),
  enchantedGlint: httpsUrlSchema.optional(),
  metadata: z
    .object({
      id: z.string().min(1).optional(),
      name: z.string().min(1).optional(),
      author: z.string().min(1).optional(),
      createdAt: z.number().int().positive().optional(),
      updatedAt: z.number().int().positive().optional(),
      version: z.number().int().positive().optional()
    })
    .optional()
});

export type ThemeV3 = z.infer<typeof themeV3Schema>;

export type PartialThemeV3 = z.infer<typeof partialThemeV3Schema>;

/**
 * Theme colors type — all properties optional.
 * When a property is undefined, the CSS cascade provides the value.
 */
export type ThemeColors = z.infer<typeof colorsSchema>;

/**
 * Convenience type: a color key name
 */
export type ThemeColorKey = keyof ThemeColors;

export type ThemeBackground = z.infer<typeof backgroundSchema>;

export type ColorBackground = z.infer<typeof colorBackgroundSchema>;

export type StripesBackground = z.infer<typeof stripesBackgroundSchema>;
