import type { ModelsEmbedData } from "$lib/shared/api/orval-generated";
import { getLongDescription, getMetaTitle, getShortDescription } from "$lib/shared/embedGenerator";
import { afterEach, describe, it, vi } from "vitest";

describe.concurrent("embedGenerator", () => {
  describe.concurrent("getMetaTitle", () => {
    it("should return title without profile name when missing", ({ expect }) => {
      expect.assertions(1);
      const embedData: ModelsEmbedData = {
        displayName: "TestPlayer"
      };

      const result = getMetaTitle(embedData);
      expect(result).toBe("TestPlayer (undefined)");
    });

    it("should return title with profile name and no icon for default game mode", ({ expect }) => {
      expect.assertions(1);
      const embedData: ModelsEmbedData = {
        displayName: "TestPlayer",
        profile_cute_name: "Banana"
      };

      const result = getMetaTitle(embedData);
      expect(result).toBe("TestPlayer (Banana)");
    });

    it("should return title with ironman icon for ironman game mode", ({ expect }) => {
      expect.assertions(1);
      const embedData: ModelsEmbedData = {
        displayName: "IronPlayer",
        profile_cute_name: "Iron Profile",
        game_mode: "ironman"
      };

      const result = getMetaTitle(embedData);
      expect(result).toBe("IronPlayer (Iron Profile ♻️)");
    });

    it("should return title with bingo icon for bingo game mode", ({ expect }) => {
      expect.assertions(1);
      const embedData: ModelsEmbedData = {
        displayName: "BingoPlayer",
        profile_cute_name: "Bingo Profile",
        game_mode: "bingo"
      };

      const result = getMetaTitle(embedData);
      expect(result).toBe("BingoPlayer (Bingo Profile 🎲)");
    });

    it("should return title with island icon for island game mode", ({ expect }) => {
      expect.assertions(1);
      const embedData: ModelsEmbedData = {
        displayName: "IslandPlayer",
        profile_cute_name: "Island Profile",
        game_mode: "island"
      };

      const result = getMetaTitle(embedData);
      expect(result).toBe("IslandPlayer (Island Profile 🌴)");
    });

    it("should handle unknown game mode as default", ({ expect }) => {
      expect.assertions(1);
      const embedData: ModelsEmbedData = {
        displayName: "UnknownPlayer",
        profile_cute_name: "Custom Profile",
        game_mode: "unknown_mode"
      };

      const result = getMetaTitle(embedData);
      expect(result).toBe("UnknownPlayer (Custom Profile)");
    });
  });

  describe.concurrent("getLongDescription", () => {
    it("should return empty string when embedData is null", ({ expect }) => {
      expect.assertions(1);
      // @ts-expect-error Testing null case
      const result = getLongDescription(null);
      expect(result).toBe("");
    });

    it("should return empty string when embedData is undefined", ({ expect }) => {
      expect.assertions(1);
      // @ts-expect-error Testing undefined case
      const result = getLongDescription(undefined);
      expect(result).toBe("");
    });

    it("should format skyblock level with emoji", ({ expect }) => {
      expect.assertions(2);
      const embedData: ModelsEmbedData = {
        skyblock_level: 250.5
      };

      const result = getLongDescription(embedData);
      expect(result).toContain("🌟 Level:");
      expect(result).toContain("250.5");
    });

    it("should format networth with emoji when normal value exists", ({ expect }) => {
      expect.assertions(2);
      const embedData: ModelsEmbedData = {
        networth: {
          normal: 1500000000
        }
      };

      const result = getLongDescription(embedData);
      expect(result).toContain("💸 Networth:");
      expect(result).toContain("1.50B");
    });

    it("should not include networth when normal value is null", ({ expect }) => {
      expect.assertions(1);
      const embedData: ModelsEmbedData = {
        networth: {
          normal: undefined
        }
      };

      const result = getLongDescription(embedData);
      expect(result).not.toContain("💸 Networth:");
    });

    it("should format purse with emoji", ({ expect }) => {
      expect.assertions(2);
      const embedData: ModelsEmbedData = {
        purse: 50000000
      };

      const result = getLongDescription(embedData);
      expect(result).toContain("💰 Purse:");
      expect(result).toContain("50M");
    });

    it("should format bank with emoji", ({ expect }) => {
      expect.assertions(2);
      const embedData: ModelsEmbedData = {
        bank: 100000000
      };

      const result = getLongDescription(embedData);
      expect(result).toContain("🏦 Bank:");
      expect(result).toContain("100M");
    });

    it("should format skills with emojis and skill average", ({ expect }) => {
      expect.assertions(5);
      const embedData: ModelsEmbedData = {
        skills: {
          skillAverage: 45.5,
          skills: {
            farming: 50,
            mining: 60,
            combat: 50,
            foraging: 50
          }
        }
      };

      const result = getLongDescription(embedData);
      expect(result).toContain("📚 Skills: 45.5");
      expect(result).toContain("🌾 50");
      expect(result).toContain("⛏️ 60");
      expect(result).toContain("⚔️ 50");
      expect(result).toContain("🌳 50");
    });

    it("should not include skills when skills object is empty", ({ expect }) => {
      expect.assertions(1);
      const embedData: ModelsEmbedData = {
        skills: {
          skillAverage: 0,
          skills: {}
        }
      };

      const result = getLongDescription(embedData);
      expect(result).not.toContain("📚 Skills:");
    });

    it("should skip null skills in skills object", ({ expect }) => {
      expect.assertions(2);
      const embedData: ModelsEmbedData = {
        skills: {
          skillAverage: 25,
          skills: {
            farming: 50,
            combat: 30
          }
        }
      };

      const result = getLongDescription(embedData);
      expect(result).toContain("🌾 50");
      expect(result).toContain("⚔️ 30");
    });

    it("should format dungeons with class average and dungeoneering level", ({ expect }) => {
      expect.assertions(3);
      const embedData: ModelsEmbedData = {
        dungeons: {
          classAverage: 40.5,
          dungeoneering: 50,
          classes: {
            healer: 45,
            mage: 50,
            berserk: 40,
            archer: 35,
            tank: 30
          }
        }
      };

      const result = getLongDescription(embedData);
      expect(result).toContain("🪦 Dungeons: 40.5");
      expect(result).toContain("💀 50");
      expect(result).toContain("🧙🏽 50");
    });

    it("should default dungeoneering to 0 when undefined", ({ expect }) => {
      expect.assertions(1);
      const embedData: ModelsEmbedData = {
        dungeons: {
          classAverage: 20
        }
      };

      const result = getLongDescription(embedData);
      expect(result).toContain("💀 0");
    });

    it("should default class values to 0 when undefined", ({ expect }) => {
      expect.assertions(1);
      const embedData: ModelsEmbedData = {
        dungeons: {
          dungeoneering: 30,
          classes: {
            mage: 40
          }
        }
      };

      const result = getLongDescription(embedData);
      expect(result).toContain("🧙🏽 40");
    });

    it("should format slayers with total xp and individual slayer levels", ({ expect }) => {
      expect.assertions(4);
      const embedData: ModelsEmbedData = {
        slayers: {
          xp: 5000000,
          slayers: {
            zombie: 9,
            spider: 8,
            wolf: 8,
            enderman: 5
          }
        }
      };

      const result = getLongDescription(embedData);
      expect(result).toContain("🤺 Slayer: 5M");
      expect(result).toContain("🧟 9");
      expect(result).toContain("🕸️ 8");
      expect(result).toContain("🐺 8");
    });

    it("should not include slayers section when xp is 0", ({ expect }) => {
      expect.assertions(1);
      const embedData: ModelsEmbedData = {
        slayers: {
          xp: 0,
          slayers: {
            zombie: 5
          }
        }
      };

      const result = getLongDescription(embedData);
      expect(result).not.toContain("🤺 Slayer:");
    });

    it("should not include slayers section when xp is undefined", ({ expect }) => {
      expect.assertions(1);
      const embedData: ModelsEmbedData = {
        slayers: {
          slayers: {
            zombie: 5
          }
        }
      };

      const result = getLongDescription(embedData);
      expect(result).not.toContain("🤺 Slayer:");
    });

    it("should skip slayers with undefined values", ({ expect }) => {
      expect.assertions(2);
      const embedData: ModelsEmbedData = {
        slayers: {
          xp: 1000000,
          slayers: {
            zombie: 7,
            wolf: 6
          }
        }
      };

      const result = getLongDescription(embedData);
      expect(result).toContain("🧟 7");
      expect(result).toContain("🐺 6");
    });

    it("should handle complete embedData with all fields", ({ expect }) => {
      expect.assertions(10);
      const embedData: ModelsEmbedData = {
        skyblock_level: 300,
        networth: {
          normal: 2000000000
        },
        purse: 75000000,
        bank: 150000000,
        skills: {
          skillAverage: 50,
          skills: {
            farming: 60,
            mining: 60,
            combat: 60
          }
        },
        dungeons: {
          classAverage: 45,
          dungeoneering: 50,
          classes: {
            mage: 50
          }
        },
        slayers: {
          xp: 10000000,
          slayers: {
            zombie: 9,
            spider: 9
          }
        }
      };

      const result = getLongDescription(embedData);
      expect(result).toContain("🌟 Level: 300");
      expect(result).toContain("💸 Networth: 2B");
      expect(result).toContain("💰 Purse: 75M");
      expect(result).toContain("🏦 Bank: 150M");
      expect(result).toContain("📚 Skills: 50");
      expect(result).toContain("🌾 60");
      expect(result).toContain("🪦 Dungeons: 45");
      expect(result).toContain("💀 50");
      expect(result).toContain("🤺 Slayer: 10M");
      expect(result).toContain("🧟 9");
    });

    it("should handle embedData with all fields missing gracefully", ({ expect }) => {
      expect.assertions(1);
      const embedData: ModelsEmbedData = {};

      const result = getLongDescription(embedData);
      expect(result).toBe("\n\n");
    });
  });

  describe("getShortDescription", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return empty string when joined is undefined", ({ expect }) => {
      expect.assertions(1);
      const embedData: ModelsEmbedData = {
        displayName: "TestPlayer"
      };

      const result = getShortDescription(embedData);
      expect(result).toBe("");
    });

    it("should format time distance correctly with fake timers", ({ expect }) => {
      expect.assertions(1);
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-15T00:00:00.000Z"));

      const embedData: ModelsEmbedData = {
        displayName: "TestPlayer",
        joined: new Date("2023-01-01T00:00:00.000Z").getTime()
      };

      const result = getShortDescription(embedData);
      expect(result).toBe("TestPlayer has been playing SkyBlock for 2 years");
    });

    it("should handle recent join date with fake timers - months", ({ expect }) => {
      expect.assertions(1);
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-15T00:00:00.000Z"));

      const embedData: ModelsEmbedData = {
        displayName: "NewPlayer",
        joined: new Date("2025-01-15T00:00:00.000Z").getTime()
      };

      const result = getShortDescription(embedData);
      expect(result).toBe("NewPlayer has been playing SkyBlock for 5 months");
    });

    it("should handle very recent join date with fake timers - days", ({ expect }) => {
      expect.assertions(1);
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-15T00:00:00.000Z"));

      const embedData: ModelsEmbedData = {
        displayName: "VeryNewPlayer",
        joined: new Date("2025-06-01T00:00:00.000Z").getTime()
      };

      const result = getShortDescription(embedData);
      expect(result).toBe("VeryNewPlayer has been playing SkyBlock for 14 days");
    });

    it("should handle join date less than a day with fake timers", ({ expect }) => {
      expect.assertions(1);
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-15T12:00:00.000Z"));

      const embedData: ModelsEmbedData = {
        displayName: "BrandNewPlayer",
        joined: new Date("2025-06-15T06:00:00.000Z").getTime()
      };

      const result = getShortDescription(embedData);
      expect(result).toBe("BrandNewPlayer has been playing SkyBlock for 6 hours");
    });

    it("should handle exact year boundary with fake timers", ({ expect }) => {
      expect.assertions(1);
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));

      const embedData: ModelsEmbedData = {
        displayName: "AnniversaryPlayer",
        joined: new Date("2024-01-01T00:00:00.000Z").getTime()
      };

      const result = getShortDescription(embedData);
      expect(result).toBe("AnniversaryPlayer has been playing SkyBlock for 1 year");
    });

    it("should handle leap year date with fake timers", ({ expect }) => {
      expect.assertions(1);
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-02-28T00:00:00.000Z"));

      const embedData: ModelsEmbedData = {
        displayName: "LeapPlayer",
        joined: new Date("2024-02-29T00:00:00.000Z").getTime()
      };

      const result = getShortDescription(embedData);
      expect(result).toBe("LeapPlayer has been playing SkyBlock for 1 year");
    });

    it("should handle timestamp as number (milliseconds)", ({ expect }) => {
      expect.assertions(1);
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-15T00:00:00.000Z"));

      const embedData: ModelsEmbedData = {
        displayName: "TimestampPlayer",
        joined: 1672531200000
      };

      const result = getShortDescription(embedData);
      expect(result).toBe("TimestampPlayer has been playing SkyBlock for 2 years");
    });

    it("should handle displayName with special characters", ({ expect }) => {
      expect.assertions(1);
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-15T00:00:00.000Z"));

      const embedData: ModelsEmbedData = {
        displayName: "Player_123",
        joined: new Date("2024-06-15T00:00:00.000Z").getTime()
      };

      const result = getShortDescription(embedData);
      expect(result).toBe("Player_123 has been playing SkyBlock for 1 year");
    });
  });
});
