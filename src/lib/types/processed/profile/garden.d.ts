import type { ProcessedSkyBlockItem, Skill } from "$types/global";

export type Garden = {
  garden: {
    level: Skill;
    visitors: {
      visited: number;
      completed: number;
      uniqueVisitors: number;
      visitors: Record<
        string,
        {
          visited: number;
          completed: number;
          unique: number;
          maxUnqiue: number;
        }
      >;
    };
    cropMilestones: {
      name: string;
      texture: string;
      level: Skill;
    }[];
    cropUpgrades: {
      name: string;
      texture: string;
      level: Skill;
    }[];
    composter: Record<string, number>;
    plot: {
      unlocked: number;
      total: number;
      barnSkin: string;
      layout: ProcessedSkyBlockItem[];
    };
  };
};
