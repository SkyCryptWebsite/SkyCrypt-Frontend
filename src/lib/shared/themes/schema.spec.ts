import { describe, it } from "vitest";
import { DEFAULT_THEME } from "./defaults";
import { partialThemeV3Schema, themeV3Schema } from "./schema";

describe.concurrent("Theme V3 Schema Validation", () => {
  describe.concurrent("themeV3Schema - Full Theme", () => {
    it("should parse valid full theme successfully", ({ expect }) => {
      const result = themeV3Schema.safeParse(DEFAULT_THEME);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.schema).toBe(3);
        expect(result.data.metadata.id).toBe("default");
      }
    });

    it("should reject theme with invalid OKLCH color format", ({ expect }) => {
      const invalidTheme = {
        ...DEFAULT_THEME,
        colors: {
          ...DEFAULT_THEME.colors,
          icon: "oklch(invalid)"
        }
      };
      const result = themeV3Schema.safeParse(invalidTheme);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("OKLCH");
      }
    });

    it("should reject theme with HTTP URL (must be HTTPS)", ({ expect }) => {
      const invalidTheme = {
        ...DEFAULT_THEME,
        backgrounds: {
          ...DEFAULT_THEME.backgrounds,
          page: {
            url: "http://example.com/bg.jpg"
          }
        }
      };
      const result = themeV3Schema.safeParse(invalidTheme);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("HTTPS");
      }
    });

    it("should reject theme with missing required fields", ({ expect }) => {
      const incompleteTheme = {
        id: "test",
        name: "Test",
        author: "Author",
        schema: 3
      };
      const result = themeV3Schema.safeParse(incompleteTheme);
      expect(result.success).toBe(false);
    });

    it("should reject theme with invalid schema version", ({ expect }) => {
      const invalidTheme = {
        ...DEFAULT_THEME,
        schema: 2
      };
      const result = themeV3Schema.safeParse(invalidTheme);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path.includes("schema"))).toBe(true);
      }
    });

    it("should validate MC palette enum values", ({ expect }) => {
      const validPalettes = ["nice-dark", "nice-light", "true-colors", "april-fools-2024"];

      for (const palette of validPalettes) {
        const theme = {
          ...DEFAULT_THEME,
          minecraft: {
            palette: palette as "nice-dark" | "nice-light" | "true-colors" | "april-fools-2024"
          }
        };
        const result = themeV3Schema.safeParse(theme);
        expect(result.success).toBe(true);
      }

      const invalidTheme = {
        ...DEFAULT_THEME,
        minecraft: {
          palette: "invalid-palette"
        }
      };
      const result = themeV3Schema.safeParse(invalidTheme);
      expect(result.success).toBe(false);
    });

    it("should validate MC color override format", ({ expect }) => {
      const validOverride = {
        ...DEFAULT_THEME,
        minecraft: {
          palette: "nice-dark" as const,
          overrides: {
            a: "oklch(0.5 0.1 100)"
          }
        }
      };
      const result = themeV3Schema.safeParse(validOverride);
      expect(result.success).toBe(true);

      const invalidOverride = {
        ...DEFAULT_THEME,
        minecraft: {
          palette: "nice-dark" as const,
          overrides: {
            a: "rgb(255, 0, 0)"
          }
        }
      };
      const invalidResult = themeV3Schema.safeParse(invalidOverride);
      expect(invalidResult.success).toBe(false);
    });

    it("should accept valid HTTPS enchanted glint URL", ({ expect }) => {
      const themeWithGlint = {
        ...DEFAULT_THEME,
        enchantedGlint: "https://example.com/glint.png"
      };
      const result = themeV3Schema.safeParse(themeWithGlint);
      expect(result.success).toBe(true);
    });
  });

  describe.concurrent("partialThemeV3Schema - Partial Theme", () => {
    it("should parse valid partial theme successfully", ({ expect }) => {
      const partial = {
        id: "custom",
        colors: {
          icon: "oklch(0.5 0.2 100)",
          link: "oklch(0.6 0.1 200)"
        }
      };
      const result = partialThemeV3Schema.safeParse(partial);
      expect(result.success).toBe(true);
    });

    it("should accept empty object as valid partial theme", ({ expect }) => {
      const result = partialThemeV3Schema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("should reject partial theme with invalid color format", ({ expect }) => {
      const invalidPartial = {
        colors: {
          icon: "not-a-color"
        }
      };
      const result = partialThemeV3Schema.safeParse(invalidPartial);
      expect(result.success).toBe(false);
    });

    it("should validate partial minecraft overrides", ({ expect }) => {
      const partialMC = {
        minecraft: {
          overrides: {
            "0": "oklch(1 0 0)",
            f: "oklch(0 0 0)"
          }
        }
      };
      const result = partialThemeV3Schema.safeParse(partialMC);
      expect(result.success).toBe(true);
    });
  });

  describe.concurrent("Background Schema Validation", () => {
    it("should validate color background type", ({ expect }) => {
      const colorBg = {
        ...DEFAULT_THEME,
        backgrounds: {
          ...DEFAULT_THEME.backgrounds,
          skillbar: {
            type: "color" as const,
            color: "oklch(0.5 0.1 100)"
          }
        }
      };
      const result = themeV3Schema.safeParse(colorBg);
      expect(result.success).toBe(true);
    });

    it("should validate stripes background type", ({ expect }) => {
      const stripesBg = {
        ...DEFAULT_THEME,
        backgrounds: {
          ...DEFAULT_THEME.backgrounds,
          maxedbar: {
            type: "stripes" as const,
            angle: "45deg",
            colors: ["oklch(0.5 0.1 100)", "oklch(0.6 0.1 200)"] as [string, string],
            width: 5
          }
        }
      };
      const result = themeV3Schema.safeParse(stripesBg);
      expect(result.success).toBe(true);
    });

    it("should reject stripes background with invalid colors tuple", ({ expect }) => {
      const invalidStripes = {
        ...DEFAULT_THEME,
        backgrounds: {
          ...DEFAULT_THEME.backgrounds,
          skillbar: {
            type: "stripes",
            angle: "45deg",
            colors: ["oklch(0.5 0.1 100)"], // Only one color, needs two
            width: 5
          }
        }
      };
      const result = themeV3Schema.safeParse(invalidStripes);
      expect(result.success).toBe(false);
    });
  });
});
