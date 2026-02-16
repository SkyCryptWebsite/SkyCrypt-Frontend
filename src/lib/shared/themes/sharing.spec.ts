import { DEFAULT_THEME } from "$lib/shared/themes/defaults";
import { decodeTheme, encodeTheme, parseThemeFromURL } from "$lib/shared/themes/sharing";
import { describe, expect, it } from "vitest";

describe("Theme Sharing", () => {
  describe("encodeTheme / decodeTheme", () => {
    it("should roundtrip a theme with overrides", async () => {
      const testTheme = {
        ...DEFAULT_THEME,
        metadata: {
          ...DEFAULT_THEME.metadata,
          name: "Test Theme"
        },
        colors: {
          ...DEFAULT_THEME.colors,
          icon: "oklch(0.5 0.1 100)"
        }
      };

      const encoded = await encodeTheme(testTheme);

      expect(encoded.length).toBeLessThan(300);
      expect(encoded).not.toContain("+");
      expect(encoded).not.toContain("/");
      expect(encoded).not.toContain("=");

      const decoded = await decodeTheme(encoded);

      expect(decoded).not.toBeNull();
      expect(decoded!.colors.icon).toBe("oklch(0.5 0.1 100)");
      expect(decoded!.colors.link).toBe(DEFAULT_THEME.colors.link);
      expect(decoded!.metadata.name).toBe("Test Theme");
    });

    it("should produce compact strings for minimal changes", async () => {
      const minimalTheme = {
        ...DEFAULT_THEME,
        colors: {
          ...DEFAULT_THEME.colors,
          icon: "oklch(0.5 0.1 100)",
          link: "oklch(0.6 0.1 200)",
          hover: "oklch(0.7 0.1 300)"
        }
      };

      const encoded = await encodeTheme(minimalTheme);

      expect(encoded.length).toBeLessThan(300);
    });
  });

  describe("decodeTheme error handling", () => {
    it("should return null for invalid base64", async () => {
      const result = await decodeTheme("invalid!!!");
      expect(result).toBeNull();
    });

    it("should return null for empty string", async () => {
      const result = await decodeTheme("");
      expect(result).toBeNull();
    });

    it("should return null for corrupted data", async () => {
      const result = await decodeTheme("YWJjZGVmZ2g");
      expect(result).toBeNull();
    });
  });

  describe("parseThemeFromURL", () => {
    it("should extract and decode theme from URL", async () => {
      const testTheme = {
        ...DEFAULT_THEME,
        colors: {
          ...DEFAULT_THEME.colors,
          icon: "oklch(0.5 0.1 100)"
        }
      };

      const encoded = await encodeTheme(testTheme);
      const url = `https://example.com/page?theme=${encoded}`;
      const parsed = await parseThemeFromURL(url);

      expect(parsed).not.toBeNull();
      expect(parsed!.colors.icon).toBe("oklch(0.5 0.1 100)");
    });

    it("should return null for URL without theme param", async () => {
      const result = await parseThemeFromURL("https://example.com/page");
      expect(result).toBeNull();
    });

    it("should return null for URL with invalid theme param", async () => {
      const result = await parseThemeFromURL("https://example.com/page?theme=invalid");
      expect(result).toBeNull();
    });
  });
});
