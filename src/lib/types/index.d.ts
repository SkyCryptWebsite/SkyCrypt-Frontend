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
