export type StatsData = {
  [key: string]: {
    name: string;
    nameLore: string;
    nameShort?: string;
    nameTiny: string;
    symbol: string;
    suffix?: string;
    color: string;
    percent?: boolean;
  };
};

export type ItemStats = {
  [key in StatName]?: number;
};

// Enum for different API endpoint names
export enum APIEndpointName {
  NETWORTH = "Networth",
  SKILLS = "Skills",
  GEAR = "Gear",
  SLAYER = "Slayer",
  DUNGEONS = "Dungeons",
  MINIONS = "Minions",
  BESTIARY = "Bestiary",
  COLLECTIONS = "Collections",
  CRIMSON_ISLE = "Crimson Isle",
  RIFT = "Rift",
  MISC = "Misc",
  ACCESSORIES = "Accessories",
  PETS = "Pets",
  INVENTORY = "Inventory",
  STATS = "Player Stats",
  PROFILE = "Profile Stats",
  GARDEN = "Garden",
  EMBED = "Embed Data",
  RESOURCEPACK = "Resource Pack"
}
