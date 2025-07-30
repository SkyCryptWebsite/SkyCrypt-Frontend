import { PUBLIC_API_URL } from "$env/static/public";
import { api_token } from "$lib/stores/internal";
import type { Garden } from "$types/processed/profile/garden";
import type { ProcessedSkyBlockItem } from "$types/stats";
import type { AccessoriesV2, BestiaryV2, CollectionsV2, CrimsonIsleV2, DungeonsV2, GearV2, InventoryV2, InventoryV2All, MinionsV2, MiscV2, NetworthV2, PetsV2, PlayerStatsV2, RiftV2, SkillsV2, SlayerV2 } from "$types/statsv2";
import ky from "ky";
import { get } from "svelte/store";

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
  SLAYER = "slayer",
  DUNGEONS = "dungeons",
  MINIONS = "minions",
  BESTIARY = "bestiary",
  COLLECTIONS = "collections",
  CRIMSON_ISLE = "crimson_isle",
  RIFT = "rift",
  MISC = "misc",
  ACCESSORIES = "accessories",
  PETS = "pets",
  INVENTORY = "inventory",
  STATS = "playerStats"
}

// Type mapping for section names to their corresponding types
type SectionTypeMap = {
  [SectionName.NETWORTH]: NetworthV2;
  [SectionName.SKILLS]: SkillsV2;
  [SectionName.GEAR]: GearV2;
  [SectionName.SLAYER]: SlayerV2;
  [SectionName.DUNGEONS]: DungeonsV2;
  [SectionName.MINIONS]: MinionsV2;
  [SectionName.BESTIARY]: BestiaryV2;
  [SectionName.COLLECTIONS]: CollectionsV2;
  [SectionName.CRIMSON_ISLE]: CrimsonIsleV2;
  [SectionName.RIFT]: RiftV2;
  [SectionName.MISC]: MiscV2;
  [SectionName.ACCESSORIES]: AccessoriesV2;
  [SectionName.PETS]: PetsV2;
  [SectionName.INVENTORY]: InventoryV2;
  [SectionName.STATS]: PlayerStatsV2;
};

// Client-side token refresh function
async function refreshToken(): Promise<void> {
  const tokenData = get(api_token);
  if (!tokenData?.route) {
    throw new Error("No token data available for refresh");
  }

  try {
    const response = await ky
      .post("/api/auth/refresh", {
        json: { route: tokenData.route }
      })
      .json<{
        success: boolean;
        token: string;
        timestamp: string;
        route: string;
      }>();

    if (response.success) {
      api_token.set({
        token: response.token,
        timestamp: response.timestamp,
        route: response.route
      });
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
}

export const api = () => {
  const tokenData = get(api_token);

  // Check if token exists and is not expired
  if (!tokenData || !tokenData.token || !tokenData.timestamp || !tokenData.route) {
    throw new Error("No authentication token available");
  }

  const now = Date.now();
  const tokenAge = now - Number(tokenData.timestamp);
  const maxAge = 5 * 60 * 1000; // 5 minutes
  const refreshThreshold = 3 * 60 * 1000; // Refresh when 2 minutes left

  // Auto-refresh token if close to expiring
  const shouldRefresh = tokenAge > refreshThreshold && tokenAge < maxAge;

  if (tokenAge > maxAge) {
    throw new Error("Authentication token has expired");
  }

  const extendedCustomKy = customKy.extend({
    prefixUrl: PUBLIC_API_URL,
    hooks: {
      beforeRequest: [
        async (request) => {
          // Check if we should refresh the token before this request
          if (shouldRefresh) {
            try {
              await refreshToken();
              // Get the updated token data
              const updatedTokenData = get(api_token);
              if (updatedTokenData) {
                request.headers.set("Authorization", `Bearer ${updatedTokenData.token}`);
                request.headers.set("X-Timestamp", updatedTokenData.timestamp);
                request.headers.set("X-Route", updatedTokenData.route);
              }
            } catch (error) {
              console.warn("Token refresh failed:", error);
              // Continue with original token - it might still be valid
            }
          }
        }
      ]
    },
    headers: {
      Authorization: `Bearer ${tokenData.token}`,
      "X-Timestamp": tokenData.timestamp,
      "X-Route": tokenData.route
    }
  });

  return {
    getItem: async (itemUUID: string): Promise<ProcessedSkyBlockItem> => {
      const data = await extendedCustomKy(`item/${itemUUID}`).json<ProcessedSkyBlockItem & { message?: string }>();

      if (data.message) {
        throw new Error(data.message);
      }
      return data;
    },
    getSection: async <T extends keyof SectionTypeMap>(sectionName: T, ign: string, profile?: string): Promise<SectionTypeMap[T]> => {
      const data = await extendedCustomKy(`${sectionName}/${ign}${profile ? "/" + profile : ""}`).json<SectionTypeMap[T] & { message?: string }>();

      if (data.message) {
        throw new Error(data.message);
      }
      return data;
    },
    // Generic inventory function - returns InventoryV2 if tab specified, InventoryV2All if not
    getInventory: <T extends string | undefined = undefined>(ign: string, profile: string, inventoryTab?: T, searchParam?: string): Promise<T extends string ? InventoryV2 : InventoryV2All> => {
      return (async () => {
        const data = await extendedCustomKy(`inventory/${ign}/${profile}${inventoryTab ? `/${inventoryTab}` : ""}${searchParam ? `/${encodeURIComponent(searchParam)}` : ""}`).json<(T extends string ? InventoryV2 : InventoryV2All) & { message?: string }>();
        if (data.message) {
          throw new Error(data.message);
        }
        return data;
      })();
    },
    getGarden: async (profile: string): Promise<Garden> => {
      const data = await extendedCustomKy(`garden/${profile}`).json<Garden & { message?: string }>();
      if (data.message) {
        throw new Error(data.message);
      }
      return data;
    }
  };
};
