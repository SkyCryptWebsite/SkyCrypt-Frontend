import { describe, it } from "vitest";
import {
  calculatePercentage,
  formatNumber,
  formatRunTime,
  getRarityClass,
  removeFormatting,
  titleCase,
  uniqBy,
  validateURL
} from "#lib/shared/helper";

describe.concurrent("formatNumber", () => {
  it("formats thousands with K suffix", ({ expect }) => {
    expect(formatNumber(1000)).toBe("1K");
    expect(formatNumber(1234, 2)).toBe("1.23K");
    expect(formatNumber(9999, 1)).toBe("10K");
  });

  it("formats millions with M suffix", ({ expect }) => {
    expect(formatNumber(1000000)).toBe("1M");
    expect(formatNumber(1234567, 2)).toBe("1.23M");
    expect(formatNumber(9876543, 1)).toBe("9.9M");
  });

  it("formats billions with B suffix", ({ expect }) => {
    expect(formatNumber(1000000000)).toBe("1B");
    expect(formatNumber(1234567890, 2)).toBe("1.23B");
  });

  it("removes trailing zeros from decimals", ({ expect }) => {
    expect(formatNumber(1000, 2)).toBe("1K");
    expect(formatNumber(1100, 2)).toBe("1.10K");
    expect(formatNumber(1001, 2)).toBe("1K");
  });

  it("respects decimal precision parameter", ({ expect }) => {
    expect(formatNumber(1234, 0)).toBe("1K");
    expect(formatNumber(1234, 1)).toBe("1.2K");
    expect(formatNumber(1234, 3)).toBe("1.234K");
  });

  it("handles zero correctly", ({ expect }) => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(0, 5)).toBe("0");
  });

  it("handles negative numbers", ({ expect }) => {
    expect(formatNumber(-1000)).toBe("-1K");
    expect(formatNumber(-1234567, 2)).toBe("-1.23M");
  });

  it("handles large numbers with T suffix", ({ expect }) => {
    expect(formatNumber(1000000000000)).toBe("1T");
    expect(formatNumber(1234567890123, 2)).toBe("1.23T");
  });
});

describe.concurrent("titleCase", () => {
  it("converts underscore-separated words to title case", ({ expect }) => {
    expect(titleCase("hello_world")).toBe("Hello World");
    expect(titleCase("the_quick_brown_fox")).toBe("The Quick Brown Fox");
  });

  it("handles mixed case input", ({ expect }) => {
    expect(titleCase("HeLLo_WoRLd")).toBe("Hello World");
    expect(titleCase("SCREAMING_CASE")).toBe("Screaming Case");
  });

  it("handles mixed spaces and underscores", ({ expect }) => {
    expect(titleCase("hello world_test")).toBe("Hello World Test");
  });

  it("handles multiple consecutive spaces/underscores", ({ expect }) => {
    expect(titleCase("hello__world")).toBe("Hello  World");
    expect(titleCase("hello  world")).toBe("Hello  World");
  });
});

describe.concurrent("getRarityClass", () => {
  it("handles case-insensitive rarity names", ({ expect }) => {
    expect(getRarityClass("LEGENDARY", "text")).toBe("text-minecraft-6");
    expect(getRarityClass("MyThIc", "text")).toBe("text-minecraft-d");
  });

  it("returns empty string for invalid rarity", ({ expect }) => {
    expect(getRarityClass("invalid_rarity", "text")).toBe("");
    expect(getRarityClass("not_a_rarity", "bg")).toBe("");
  });
});

describe.concurrent("removeFormatting", () => {
  it("removes multiple formatting codes", ({ expect }) => {
    expect(removeFormatting("§aHello §bWorld")).toBe("Hello World");
    expect(removeFormatting("§cRed §6Gold §9Blue")).toBe("Red Gold Blue");
  });

  it("removes consecutive formatting codes", ({ expect }) => {
    expect(removeFormatting("§a§l§nFormatted")).toBe("Formatted");
    expect(removeFormatting("§5§k§mMultiple")).toBe("Multiple");
  });

  it("removes all §[0-9a-z] sequences", ({ expect }) => {
    expect(removeFormatting("§ATest")).toBe("§ATest");
    expect(removeFormatting("§xInvalid")).toBe("Invalid");
  });
});

describe.concurrent("uniqBy", () => {
  it("preserves first occurrence on duplicate", ({ expect }) => {
    const arr = [
      { id: 1, value: "first" },
      { id: 1, value: "second" },
      { id: 1, value: "third" }
    ];
    const result = uniqBy(arr, "id");
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe("first");
  });
});

describe.concurrent("validateURL", () => {
  it("validates simple username", ({ expect }) => {
    expect(validateURL("Player123")).toBe(true);
    expect(validateURL("test_user")).toBe(true);
    expect(validateURL("a")).toBe(true);
  });

  it("validates UUID without dashes", ({ expect }) => {
    expect(validateURL("12345678901234567890123456789012")).toBe(true);
    expect(validateURL("abcdef1234567890abcdef1234567890")).toBe(true);
  });

  it("validates UUID with dashes", ({ expect }) => {
    expect(validateURL("12345678-1234-1234-1234-123456789012")).toBe(true);
    expect(validateURL("abcdef12-3456-7890-abcd-ef1234567890")).toBe(true);
  });

  it("validates username with profile name", ({ expect }) => {
    expect(validateURL("Player123/Cucumber")).toBe(true);
    expect(validateURL("test/tomato")).toBe(true);
  });

  it("validates username with profile UUID", ({ expect }) => {
    expect(validateURL("Player123/12345678901234567890123456789012")).toBe(true);
  });

  it("rejects empty string", ({ expect }) => {
    expect(validateURL("")).toBe(false);
    expect(validateURL("   ")).toBe(false);
  });

  it("rejects too many segments", ({ expect }) => {
    expect(validateURL("player/profile/extra")).toBe(false);
  });

  it("rejects invalid username characters", ({ expect }) => {
    expect(validateURL("player@123")).toBe(false);
    expect(validateURL("player#test")).toBe(false);
  });

  it("rejects invalid profile name", ({ expect }) => {
    expect(validateURL("player/123abc")).toBe(false);
  });

  it("rejects empty profile segment", ({ expect }) => {
    expect(validateURL("player/")).toBe(false);
  });

  it("handles username with spaces (converts to underscore)", ({ expect }) => {
    expect(validateURL("Player Name")).toBe(true);
  });

  it("validates max length username (16 characters)", ({ expect }) => {
    expect(validateURL("1234567890123456")).toBe(true);
  });

  it("rejects username longer than 16 characters", ({ expect }) => {
    expect(validateURL("12345678901234567")).toBe(false);
  });
});

describe.concurrent("calculatePercentage", () => {
  it("respects decimal precision parameter", ({ expect }) => {
    expect(calculatePercentage(1, 3, 0)).toBe("33");
    expect(calculatePercentage(1, 3, 1)).toBe("33");
    expect(calculatePercentage(1, 3, 2)).toBe("33");
  });

  it("removes trailing zeros from result", ({ expect }) => {
    expect(calculatePercentage(100, 100, 2)).toBe("100");
    expect(calculatePercentage(50, 100, 3)).toBe("50");
  });

  it("handles zero total", ({ expect }) => {
    expect(calculatePercentage(50, 0)).toBe("0");
    expect(calculatePercentage(100, 0, 3)).toBe("0");
  });

  it("calculates percentage less than 1", ({ expect }) => {
    expect(calculatePercentage(1, 1000, 2)).toBe("0");
    expect(calculatePercentage(5, 1000, 2)).toBe("0");
  });

  it("uses floor for calculation", ({ expect }) => {
    // 66.66% floors to 66%
    expect(calculatePercentage(2, 3, 0)).toBe("66");
    // 33.33% floors to 33%
    expect(calculatePercentage(1, 3, 0)).toBe("33");
  });
});

describe.concurrent("formatRunTime", () => {
  it("keeps hours instead of wrapping past 59 minutes", ({ expect }) => {
    expect(formatRunTime(307_000)).toBe("05:07");
    expect(formatRunTime(3_907_000)).toBe("1:05:07");
  });

  it("matches Intl.DurationFormat output in the fallback", ({ expect }) => {
    expect(formatRunTime(307_000, null)).toBe("05:07");
    expect(formatRunTime(3_907_000, null)).toBe("1:05:07");
    expect(formatRunTime(0, null)).toBe("00:00");
  });
});
