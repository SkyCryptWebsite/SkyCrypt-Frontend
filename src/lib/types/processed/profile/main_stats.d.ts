import type { NetworthResult } from "$types/networth-result";

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
  networth: NetworthResult;
};
