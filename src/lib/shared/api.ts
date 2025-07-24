import type { Garden } from "$types/processed/profile/garden";
import type { ProcessedSkyBlockItem } from "$types/stats";
import type { AccessoriesV2, BestiaryV2, CollectionsV2, CrimsonIsleV2, DungeonsV2, EmbedV2, EnchantingV2, FarmingV2, FishingV2, GearV2, InventoryV2, InventoryV2All, MiningV2, MinionsV2, MiscV2, NetworthV2, PetsV2, PlayerStatsV2, RiftV2, SkillsV2, SlayerV2 } from "$types/statsv2";
import ky from "ky";

const customKy = ky.create({
  hooks: {
    beforeError: [
      (error) => {
        const { request, response } = error;
        let kind;

        switch (request.url) {
          case "/api/v2/item/":
            kind = "Item";
            break;
          case "/api/v2/inventory/":
            kind = "Inventory";
            break;
          case "/api/v2/garden/":
            kind = "Garden";
            break;
          default:
            kind = "section";
        }

        if (!response.ok && response.status !== 500) {
          error.message = `${response.status} - Failed to fetch ${kind ? kind + " " : ""} - ${response.statusText}`;
        }
        return error;
      }
    ]
  }
});
// Enum for section names
export enum SectionName {
  NETWORTH = "networth",
  SKILLS = "skills",
  GEAR = "gear",
  MINING = "mining",
  FARMING = "farming",
  FISHING = "fishing",
  SLAYER = "slayer",
  DUNGEONS = "dungeons",
  MINIONS = "minions",
  BESTIARY = "bestiary",
  COLLECTIONS = "collections",
  CRIMSON_ISLE = "crimson_isle",
  RIFT = "rift",
  MISC = "misc",
  ENCHANTING = "enchanting",
  ACCESSORIES = "accessories",
  PETS = "pets",
  INVENTORY = "inventory",
  STATS = "playerStats",
  EMBED = "embed"
}

// Type mapping for section names to their corresponding types
type SectionTypeMap = {
  [SectionName.NETWORTH]: NetworthV2;
  [SectionName.SKILLS]: SkillsV2;
  [SectionName.GEAR]: GearV2;
  [SectionName.MINING]: MiningV2;
  [SectionName.FARMING]: FarmingV2;
  [SectionName.FISHING]: FishingV2;
  [SectionName.SLAYER]: SlayerV2;
  [SectionName.DUNGEONS]: DungeonsV2;
  [SectionName.MINIONS]: MinionsV2;
  [SectionName.BESTIARY]: BestiaryV2;
  [SectionName.COLLECTIONS]: CollectionsV2;
  [SectionName.CRIMSON_ISLE]: CrimsonIsleV2;
  [SectionName.RIFT]: RiftV2;
  [SectionName.MISC]: MiscV2;
  [SectionName.ENCHANTING]: EnchantingV2;
  [SectionName.ACCESSORIES]: AccessoriesV2;
  [SectionName.PETS]: PetsV2;
  [SectionName.INVENTORY]: InventoryV2;
  [SectionName.STATS]: PlayerStatsV2;
  [SectionName.EMBED]: EmbedV2;
};

export const api = () => ({
  getItem: async (itemUUID: string): Promise<ProcessedSkyBlockItem> => {
    const data = await customKy(`/api/v2/item/${itemUUID}`).json<ProcessedSkyBlockItem & { message?: string }>();

    if (data.message) {
      throw new Error(data.message);
    }
    return data;
  },
  getSection: async <T extends keyof SectionTypeMap>(sectionName: T, ign: string, profile?: string): Promise<SectionTypeMap[T]> => {
    const data = await customKy(`/api/v2/${sectionName}/${ign}${profile ? "/" + profile : ""}`).json<SectionTypeMap[T] & { message?: string }>();
    if (data.message) {
      throw new Error(data.message);
    }
    return data;
  },
  // Generic inventory function - returns InventoryV2 if tab specified, InventoryV2All if not
  getInventory: <T extends string | undefined = undefined>(ign: string, profile: string, inventoryTab?: T, searchParam?: string): Promise<T extends string ? InventoryV2 : InventoryV2All> => {
    return (async () => {
      const data = await customKy(`/api/v2/inventory/${ign}/${profile}${inventoryTab ? `/${inventoryTab}` : ""}${searchParam ? `/${encodeURIComponent(searchParam)}` : ""}`).json<(T extends string ? InventoryV2 : InventoryV2All) & { message?: string }>();
      if (data.message) {
        throw new Error(data.message);
      }
      return data;
    })();
  },
  getGarden: async (profile: string): Promise<Garden> => {
    const data = await customKy(`/api/garden/${profile}`).json<Garden & { message?: string }>();
    if (data.message) {
      throw new Error(data.message);
    }
    return data;
  }
});
