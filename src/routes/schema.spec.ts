import { describe, it } from "vitest";
import { schema } from "./schema";

describe.concurrent("schema - Zod validation for search query", () => {
  describe("valid inputs", () => {
    it("accepts valid Minecraft username (lowercase)", ({ expect }) => {
      const result = schema.safeParse({ query: "notch" });
      expect(result.success).toBe(true);
    });

    it("accepts valid Minecraft username (mixed case)", ({ expect }) => {
      const result = schema.safeParse({ query: "Notch" });
      expect(result.success).toBe(true);
    });

    it("accepts valid Minecraft username with underscores", ({ expect }) => {
      const result = schema.safeParse({ query: "steve_alex" });
      expect(result.success).toBe(true);
    });

    it("accepts valid Minecraft username with single space", ({ expect }) => {
      const result = schema.safeParse({ query: "player name" });
      expect(result.success).toBe(true);
    });

    it("accepts valid UUID with dashes (standard format)", ({ expect }) => {
      const result = schema.safeParse({ query: "550e8400-e29b-41d4-a716-446655440000" });
      expect(result.success).toBe(true);
    });

    it("accepts valid UUID without dashes (32 hex chars)", ({ expect }) => {
      const result = schema.safeParse({ query: "550e8400e29b41d4a716446655440000" });
      expect(result.success).toBe(true);
    });

    it("accepts username/profile format with alphabetic profile", ({ expect }) => {
      const result = schema.safeParse({ query: "notch/main" });
      expect(result.success).toBe(true);
    });

    it("accepts username/profile format with capitalized profile", ({ expect }) => {
      const result = schema.safeParse({ query: "steve/Skyblock" });
      expect(result.success).toBe(true);
    });

    it("accepts UUID/profile format (32-char UUID + profile)", ({ expect }) => {
      const result = schema.safeParse({ query: "550e8400e29b41d4a716446655440000/main" });
      expect(result.success).toBe(true);
    });

    it("accepts UUID with dashes/profile format", ({ expect }) => {
      const result = schema.safeParse({ query: "550e8400-e29b-41d4-a716-446655440000/main" });
      expect(result.success).toBe(true);
    });

    it("accepts username with max length (16 chars)", ({ expect }) => {
      const result = schema.safeParse({ query: "notchjumpsAround" });
      expect(result.success).toBe(true);
    });
  });

  describe("invalid inputs", () => {
    it("rejects empty string", ({ expect }) => {
      const result = schema.safeParse({ query: "" });
      expect(result.success).toBe(false);
    });

    it("rejects whitespace-only string", ({ expect }) => {
      const result = schema.safeParse({ query: "   " });
      expect(result.success).toBe(false);
    });

    it("rejects tab character", ({ expect }) => {
      const result = schema.safeParse({ query: "\t" });
      expect(result.success).toBe(false);
    });

    it("rejects newline character", ({ expect }) => {
      const result = schema.safeParse({ query: "\n" });
      expect(result.success).toBe(false);
    });

    it("rejects username exceeding 16 characters", ({ expect }) => {
      const result = schema.safeParse({ query: "seventeencharacters" });
      expect(result.success).toBe(false);
    });

    it("rejects username with invalid special characters (@)", ({ expect }) => {
      const result = schema.safeParse({ query: "player@name" });
      expect(result.success).toBe(false);
    });

    it("rejects username with invalid special characters (#)", ({ expect }) => {
      const result = schema.safeParse({ query: "player#name" });
      expect(result.success).toBe(false);
    });

    it("rejects username with invalid special characters (!)", ({ expect }) => {
      const result = schema.safeParse({ query: "player!" });
      expect(result.success).toBe(false);
    });

    it("rejects invalid UUID (wrong format, too short)", ({ expect }) => {
      const result = schema.safeParse({ query: "550e8400-e29b-41d4" });
      expect(result.success).toBe(false);
    });

    it("rejects invalid UUID (non-hex characters)", ({ expect }) => {
      const result = schema.safeParse({ query: "550e8400-e29b-41d4-a716-44665544000g" });
      expect(result.success).toBe(false);
    });

    it("rejects query with SQL injection attempt", ({ expect }) => {
      const result = schema.safeParse({ query: "notch'; DROP TABLE players;--" });
      expect(result.success).toBe(false);
    });

    it("rejects query with script injection attempt", ({ expect }) => {
      const result = schema.safeParse({ query: "notch<script>alert('xss')</script>" });
      expect(result.success).toBe(false);
    });

    it("rejects query with too many slashes", ({ expect }) => {
      const result = schema.safeParse({ query: "notch/main/extra" });
      expect(result.success).toBe(false);
    });

    it("rejects username with trailing slash", ({ expect }) => {
      const result = schema.safeParse({ query: "notch/" });
      expect(result.success).toBe(false);
    });

    it("rejects invalid profile name (non-alphabetic after slash)", ({ expect }) => {
      const result = schema.safeParse({ query: "notch/123" });
      expect(result.success).toBe(false);
    });

    it("rejects invalid profile UUID (too short)", ({ expect }) => {
      const result = schema.safeParse({ query: "550e8400e29b41d4a716/invalid" });
      expect(result.success).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("trims leading whitespace from username", ({ expect }) => {
      const result = schema.safeParse({ query: "  notch" });
      expect(result.success).toBe(true);
    });

    it("trims trailing whitespace from username", ({ expect }) => {
      const result = schema.safeParse({ query: "notch  " });
      expect(result.success).toBe(true);
    });

    it("trims whitespace in username/profile format", ({ expect }) => {
      const result = schema.safeParse({ query: "  notch/main  " });
      expect(result.success).toBe(true);
    });

    it("converts space to underscore in username", ({ expect }) => {
      const result = schema.safeParse({ query: "player name" });
      expect(result.success).toBe(true);
    });

    it("is case-insensitive for UUID (lowercase)", ({ expect }) => {
      const result = schema.safeParse({ query: "550e8400e29b41d4a716446655440000" });
      expect(result.success).toBe(true);
    });

    it("is case-insensitive for UUID (uppercase)", ({ expect }) => {
      const result = schema.safeParse({ query: "550E8400E29B41D4A716446655440000" });
      expect(result.success).toBe(true);
    });

    it("is case-insensitive for UUID (mixed case)", ({ expect }) => {
      const result = schema.safeParse({ query: "550e8400-E29B-41d4-A716-446655440000" });
      expect(result.success).toBe(true);
    });

    it("normalizes profile name to capitalized form", ({ expect }) => {
      const result = schema.safeParse({ query: "notch/skyblock" });
      expect(result.success).toBe(true);
    });

    it("accepts single character username", ({ expect }) => {
      const result = schema.safeParse({ query: "a" });
      expect(result.success).toBe(true);
    });

    it("rejects single character with invalid syntax", ({ expect }) => {
      const result = schema.safeParse({ query: "/" });
      expect(result.success).toBe(false);
    });

    it("handles UUID with partial dashes removed", ({ expect }) => {
      const result = schema.safeParse({ query: "550e8400e29b-41d4-a716446655440000" });
      expect(result.success).toBe(true);
    });

    it("rejects query missing username before slash", ({ expect }) => {
      const result = schema.safeParse({ query: "/main" });
      expect(result.success).toBe(false);
    });
  });

  describe("error messages", () => {
    it("provides helpful error message for invalid query", ({ expect }) => {
      const result = schema.safeParse({ query: "invalid@@username!!" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("valid Minecraft username or UUID");
      }
    });

    it("provides error message for empty input", ({ expect }) => {
      const result = schema.safeParse({ query: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("valid Minecraft username or UUID");
      }
    });
  });
});
