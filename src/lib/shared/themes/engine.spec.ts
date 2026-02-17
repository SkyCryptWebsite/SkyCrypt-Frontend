import { describe, it } from "vitest";
import { DEFAULT_THEME } from "./defaults";
import { mergeThemeWithDefaults } from "./engine";

describe.concurrent("Theme Engine Tests", () => {
  describe.concurrent("mergeThemeWithDefaults", () => {
    it("should pass through provided colors without filling missing ones from defaults", ({ expect }) => {
      const partial = {
        colors: {
          icon: "oklch(0.5 0.2 100)"
        }
      };

      const merged = mergeThemeWithDefaults(partial);

      expect(merged.colors?.icon).toBe("oklch(0.5 0.2 100)");
      // Colors NOT provided should remain undefined (not filled from defaults)
      expect(merged.colors?.link).toBeUndefined();
      expect(merged.colors?.hover).toBeUndefined();
      expect(merged.colors?.text).toBeUndefined();
      // Metadata should still be filled from defaults
      expect(merged.metadata.id).toBe(DEFAULT_THEME.metadata.id);
      expect(merged.metadata.name).toBe(DEFAULT_THEME.metadata.name);
      expect(merged.metadata.author).toBe(DEFAULT_THEME.metadata.author);
      expect(merged.schema).toBe(3);
    });

    it("should preserve override values", ({ expect }) => {
      const customId = "custom-theme-123";
      const customName = "My Custom Theme";
      const customAuthor = "Test Author";
      const customIcon = "oklch(0.8 0.3 50)";
      const customLink = "oklch(0.9 0.2 100)";

      const partial = {
        metadata: {
          id: customId,
          name: customName,
          author: customAuthor
        },
        colors: {
          icon: customIcon,
          link: customLink
        }
      };

      const merged = mergeThemeWithDefaults(partial);

      expect(merged.metadata.id).toBe(customId);
      expect(merged.metadata.name).toBe(customName);
      expect(merged.metadata.author).toBe(customAuthor);
      expect(merged.colors?.icon).toBe(customIcon);
      expect(merged.colors?.link).toBe(customLink);
    });

    it("should pass through backgrounds without filling missing ones from defaults", ({ expect }) => {
      const partial = {
        backgrounds: {
          skillbar: {
            type: "color" as const,
            color: "oklch(0.5 0.1 100)"
          }
        }
      };

      const merged = mergeThemeWithDefaults(partial);

      expect(merged.backgrounds?.skillbar?.type).toBe("color");
      if (merged.backgrounds?.skillbar?.type === "color") {
        expect(merged.backgrounds.skillbar.color).toBe("oklch(0.5 0.1 100)");
      }
      // maxedbar was not provided, so it should be undefined
      expect(merged.backgrounds?.maxedbar).toBeUndefined();
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

      expect(merged.metadata.id).toBe(DEFAULT_THEME.metadata.id);
      expect(merged.metadata.name).toBe(DEFAULT_THEME.metadata.name);
      // Colors and backgrounds should be undefined when not provided
      expect(merged.colors).toBeUndefined();
      expect(merged.backgrounds).toBeUndefined();
      expect(merged.minecraft).toEqual(DEFAULT_THEME.minecraft);
    });

    it("should merge metadata timestamps correctly", ({ expect }) => {
      const customCreatedAt = 1234567890;
      const partial = {
        metadata: {
          createdAt: customCreatedAt
        }
      };

      const merged = mergeThemeWithDefaults(partial);

      expect(merged.metadata.createdAt).toBe(customCreatedAt);
      expect(merged.metadata.updatedAt).toBe(DEFAULT_THEME.metadata.updatedAt);
      expect(merged.metadata.version).toBe(DEFAULT_THEME.metadata.version);
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

      expect(merged.backgrounds?.maxedbar?.type).toBe("stripes");
      if (merged.backgrounds?.maxedbar?.type === "stripes") {
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

      expect(merged.backgrounds?.page?.url).toBe(customUrl);
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
