import { describe, it } from "vitest";
import { mergeThemeWithDefaults } from "./engine";
import { DEFAULT_THEME } from "./defaults";

describe.concurrent("Theme Engine Tests", () => {
  describe.concurrent("mergeThemeWithDefaults", () => {
    it("should fill missing fields from DEFAULT_THEME", ({ expect }) => {
      const partial = {
        colors: {
          icon: "oklch(0.5 0.2 100)"
        }
      };

      const merged = mergeThemeWithDefaults(partial);

      expect(merged.colors.icon).toBe("oklch(0.5 0.2 100)");
      expect(merged.colors.link).toBe(DEFAULT_THEME.colors.link);
      expect(merged.colors.hover).toBe(DEFAULT_THEME.colors.hover);
      expect(merged.colors.text).toBe(DEFAULT_THEME.colors.text);
      expect(merged.id).toBe(DEFAULT_THEME.id);
      expect(merged.name).toBe(DEFAULT_THEME.name);
      expect(merged.author).toBe(DEFAULT_THEME.author);
      expect(merged.schema).toBe(3);
    });

    it("should preserve override values", ({ expect }) => {
      const customId = "custom-theme-123";
      const customName = "My Custom Theme";
      const customAuthor = "Test Author";
      const customIcon = "oklch(0.8 0.3 50)";
      const customLink = "oklch(0.9 0.2 100)";

      const partial = {
        id: customId,
        name: customName,
        author: customAuthor,
        colors: {
          icon: customIcon,
          link: customLink
        }
      };

      const merged = mergeThemeWithDefaults(partial);

      expect(merged.id).toBe(customId);
      expect(merged.name).toBe(customName);
      expect(merged.author).toBe(customAuthor);
      expect(merged.colors.icon).toBe(customIcon);
      expect(merged.colors.link).toBe(customLink);
    });

    it("should merge nested backgrounds correctly", ({ expect }) => {
      const partial = {
        backgrounds: {
          skillbar: {
            type: "color" as const,
            color: "oklch(0.5 0.1 100)"
          }
        }
      };

      const merged = mergeThemeWithDefaults(partial);

      expect(merged.backgrounds.skillbar.type).toBe("color");
      if (merged.backgrounds.skillbar.type === "color") {
        expect(merged.backgrounds.skillbar.color).toBe("oklch(0.5 0.1 100)");
      }
      expect(merged.backgrounds.maxedbar).toEqual(DEFAULT_THEME.backgrounds.maxedbar);
    });

    it("should merge minecraft palette and overrides", ({ expect }) => {
      const partial = {
        minecraft: {
          palette: "true-colors" as const,
          overrides: {
            a: "oklch(0.5 0.1 100)"
          } as Record<string, string>
        }
      };

      const merged = mergeThemeWithDefaults(partial);

      expect(merged.minecraft.palette).toBe("true-colors");
      expect(merged.minecraft.overrides).toEqual({ a: "oklch(0.5 0.1 100)" });
    });

    it("should handle empty partial theme", ({ expect }) => {
      const merged = mergeThemeWithDefaults({});

      expect(merged.id).toBe(DEFAULT_THEME.id);
      expect(merged.name).toBe(DEFAULT_THEME.name);
      expect(merged.colors).toEqual(DEFAULT_THEME.colors);
      expect(merged.backgrounds).toEqual(DEFAULT_THEME.backgrounds);
      expect(merged.minecraft).toEqual(DEFAULT_THEME.minecraft);
    });

    it("should merge meta timestamps correctly", ({ expect }) => {
      const customCreatedAt = 1234567890;
      const partial = {
        meta: {
          createdAt: customCreatedAt
        }
      };

      const merged = mergeThemeWithDefaults(partial);

      expect(merged.meta.createdAt).toBe(customCreatedAt);
      expect(merged.meta.updatedAt).toBe(DEFAULT_THEME.meta.updatedAt);
      expect(merged.meta.version).toBe(DEFAULT_THEME.meta.version);
    });

    it("should handle stripes background override", ({ expect }) => {
      const partial = {
        backgrounds: {
          maxedbar: {
            type: "stripes" as const,
            angle: "90deg",
            colors: ["oklch(0.7 0.2 100)", "oklch(0.8 0.1 200)"] as [string, string],
            width: 10
          }
        }
      };

      const merged = mergeThemeWithDefaults(partial);

      expect(merged.backgrounds.maxedbar.type).toBe("stripes");
      if (merged.backgrounds.maxedbar.type === "stripes") {
        expect(merged.backgrounds.maxedbar.angle).toBe("90deg");
        expect(merged.backgrounds.maxedbar.colors).toEqual(["oklch(0.7 0.2 100)", "oklch(0.8 0.1 200)"]);
        expect(merged.backgrounds.maxedbar.width).toBe(10);
      }
    });

    it("should preserve page background URL override", ({ expect }) => {
      const customUrl = "https://example.com/custom-bg.jpg";
      const partial = {
        backgrounds: {
          page: {
            url: customUrl
          }
        }
      };

      const merged = mergeThemeWithDefaults(partial);

      expect(merged.backgrounds.page?.url).toBe(customUrl);
    });

    it("should handle enchantedGlint override", ({ expect }) => {
      const customGlint = "https://example.com/custom-glint.png";
      const partial = {
        enchantedGlint: customGlint
      };

      const merged = mergeThemeWithDefaults(partial);

      expect(merged.enchantedGlint).toBe(customGlint);
    });

    it("should preserve light mode flag", ({ expect }) => {
      const partial = {
        light: true
      };

      const merged = mergeThemeWithDefaults(partial);

      expect(merged.light).toBe(true);
    });
  });
});
