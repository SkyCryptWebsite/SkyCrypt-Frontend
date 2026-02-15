import { z } from "zod";

/**
 * Theme V3 Zod Schema
 *
 * Comprehensive schema covering all ~40+ CSS variables for SkyCrypt themes.
 * Organized into logical groups: colors, backgrounds, minecraft, enchantedGlint, meta.
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

// --- Main Theme Schema ---

/**
 * Theme V3 Schema
 *
 * ALL fields are required for a complete theme (DEFAULT_THEME).
 * Use `.partial()` for user theme overrides that only modify specific fields.
 */
export const themeV3Schema = z.object({
  id: z.string().min(1, "Theme ID is required"),
  name: z.string().min(1, "Theme name is required"),
  author: z.string().min(1, "Author is required"),
  schema: z.literal(3),
  light: z.boolean().default(false),
  colors: z.object({
    icon: oklchColorSchema,
    link: oklchColorSchema,
    hover: oklchColorSchema,
    maxed: oklchColorSchema,
    gold: oklchColorSchema,
    logo: oklchColorSchema,
    text: oklchColorSchema,
    background: oklchColorSchema,
    header: oklchColorSchema,
    greyBackground: oklchColorSchema,
    loreBackground: oklchColorSchema,
    bg: oklchColorSchema,
    mctooltipBg: oklchColorSchema
  }),
  backgrounds: z.object({
    skillbar: backgroundSchema,
    maxedbar: backgroundSchema,
    page: z
      .object({
        url: httpsUrlSchema
      })
      .optional()
  }),
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
  meta: z.object({
    createdAt: z.number().int().positive(),
    updatedAt: z.number().int().positive(),
    version: z.number().int().positive().default(1)
  })
});

export const partialThemeV3Schema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  schema: z.literal(3).optional(),
  light: z.boolean().optional(),
  colors: z
    .object({
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
    })
    .optional(),
  backgrounds: z
    .object({
      skillbar: backgroundSchema.optional(),
      maxedbar: backgroundSchema.optional(),
      page: z
        .object({
          url: httpsUrlSchema
        })
        .optional()
    })
    .optional(),
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
  meta: z
    .object({
      createdAt: z.number().int().positive().optional(),
      updatedAt: z.number().int().positive().optional(),
      version: z.number().int().positive().optional()
    })
    .optional()
});

export type ThemeV3 = z.infer<typeof themeV3Schema>;

export type PartialThemeV3 = z.infer<typeof partialThemeV3Schema>;

export type ThemeBackground = z.infer<typeof backgroundSchema>;

export type ColorBackground = z.infer<typeof colorBackgroundSchema>;

export type StripesBackground = z.infer<typeof stripesBackgroundSchema>;
