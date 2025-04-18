import type { RawInventory } from "$types/global";

export type NetworthResultStripped = {
  noInventory: boolean;
  networth: number;
  unsoulboundNetworth: number;
  types: Record<string, { total: number; unsoulboundTotal?: number }>;
};

export type MainStats = {
  joined: number;
  cookieBuffActive: boolean;
  purse: number;
  bank: number;
  personalBank: number;
  fairySouls: {
    found: number;
    total: number;
  };
  networth: NetworthResultStripped;
  nonCosmeticNetworth: NetworthResultStripped;
  extra: {
    networthCategories: Record<string, number>;
    rawItems: RawInventory;
  };
};
