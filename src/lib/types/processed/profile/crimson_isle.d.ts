export type CrimsonIsle = {
  unlocked: boolean;
  factions: {
    selectedFaction: string;
    barbariansReputation: number;
    magesReputation: number;
  };
  kuudra: {
    totalKills: number;
    tiers: {
      name: string;
      id: string;
      texture: string;
      kills: number;
    }[];
  };
  kuudraFollower: {
    weirdSailor: boolean;
    fishedWetNapkin: boolean;
    foundKuudraHelmet: boolean;
    foundKuudraChestplate: boolean;
    foundKuudraLeggings: boolean;
    foundKuudraBoots: boolean;
    cavityRarity: string?;
  };
  dojo: {
    totalPoints: number;
    challenges: {
      name: string;
      id: string;
      texture: string;
      points: number;
      time: number;
      rank: string;
    }[];
  };
};
