export type PackConfig = {
  id: string;
  link: string;
  name: string;
  version?: string;
  author: string;
  folder: string;
}[];

export const packConfigs: PackConfig = [
  {
    id: "FURFSKY_REBORN",
    link: "https://furfsky.net/",
    name: "FurfSky Reborn",
    version: "v1.8.0",
    author: "The Reborn Team",
    folder: "FurfSky_Reborn"
  },
  {
    id: "HYPIXELPLUS",
    link: "https://hypixel.net/threads/4174260/",
    name: "Hypixel Plus",
    version: "v0.22.1",
    author: "ic22487",
    folder: "Hypixel_Plus"
  },
  {
    id: "SKYBLOCK_PACK",
    link: "https://hypixel.net/threads/2103515",
    name: "Hypixel Skyblock Pack 16x",
    version: "v14",
    author: "Packs HQ",
    folder: "PacksHQ_16x_14"
  },
  {
    id: "RNBW_PLUS",
    link: "https://hypixel.net/threads/3470904",
    name: "RNBW+",
    version: "v0.7",
    author: "rainbowcraft2",
    folder: "RNBW+_0_7"
  },
  {
    id: "VANILLA_PLUS",
    link: "https://hypixel.net/threads/2147652",
    name: "Vanilla+",
    version: "v1.441",
    author: "TBlazeWarriorT",
    folder: "Vanilla+_1_441"
  },
  {
    id: "WORLDS_AND_BEYOND",
    link: "https://hypixel.net/threads/worlds-and-beyond-16x-crimson-isles-update-version-1-6.3597207/",
    name: "Worlds and Beyond",
    version: "v1.6",
    author: "Skeletony_",
    folder: "Worlds_and_Beyond_1_4_1"
  }
];
