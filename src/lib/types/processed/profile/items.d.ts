import type { Pet } from "$types/global";
import type { ItemStats } from "./stats";

export type Item = {
  id: number;
  Damage: number;
  Count: number;
  tag: {
    ExtraAttributes: {
      id?: string;
      enchantments?: Record<string, number>;
    };
    display?: {
      Name: string;
      Lore?: string[];
    };
    SkullOwner?: {
      Properties: {
        textures: {
          Value: string;
        }[];
      };
    };
    ench?: string[];
  };
  texture?: string;
  texture_path?: string;
  material?: string;
  itemId?: string;
  glowing?: boolean;
  price?: number;
};

export type DatabaseItem = {
  material?: string;
  skin?: string;
  name?: string;
  category?: string;
  tier?: string;
  id?: string;
  item_id?: number;
  skyblock_id?: string;
  color?: string;
  damage?: number;
  museum_data?: {
    armor_set_donation_xp: number;
    donation_xp: number;
    type: string;
    parent: Record<string, string>;
    game_stage: string;
  };
};

export type ItemQuery = {
  skyblockId?: string;
  name?: string;
  item_id?: number;
  id?: number;
  damage?: number;
  packs?: string[];
  texture?: string;
  texture_path?: string;
  static?: boolean;
};

export type ProcessedItem = {
  id: number;
  Damage: number;
  Count: number;
  tag: {
    display: {
      Lore: string[];
      Name: string;
      color: string;
    };
    ExtraAttributes: {
      rarity_upgrades?: number;
      hot_potato_count?: number;
      color?: string;
      modifier?: string;
      dungeon_item_level?: number;
      id?: string;
      enchantments?: Record<string, number>;
      uuid?: string;
      donated_museum?: boolean;
      timestamp?: number;
      model?: string;
      petInfo: {
        uuuid: string;
        type: string;
        exp: number;
        active: boolean;
        tier: number;
        heldItem: string | null;
        candyUsed: number;
        skin: string | null;
      };
      talisman_enrichment?: string;
      gems: Record<string, string>;
    };
    SkullOwner: {
      Properties: {
        textures: {
          Value: string;
        }[];
      };
    };
    ench?: string[];
  };
  exp?: number;
  extra: {
    hpbs?: number;
    recombobulated?: boolean;
    timestamp?: number;
    reforge?: string;
    source?: string;
    model?: string;
    enrichment?: string;
    price?: number;
    wiki?: {
      fandom?: string;
      official?: string;
    };
  };
  texture_path: string;
  texture_pack?: string;
  display_name: string;
  rarity: string | null;
  recombobulated?: boolean;
  dungeon?: boolean;
  shiny?: boolean;
  inBackpack?: boolean;
  item_index: number;
  containsItems?: ProcessedItem[];
  armor_name?: string;
  categories?: string[];
  backpackIndex?: number;
  hidden?: boolean;
  isInactive?: boolean;
  isUnique?: boolean;
  name?: string;
  tier?: string;
  item_id?: number;
  damage?: number;
  glowing?: boolean;
  position?: number;
  item_index: number;
  price: number;
};

export type ProcessedSkyBlockItem = {
  display_name: string;
  lore: string[];
  rarity?: string;
  recombobulated?: boolean;
  Count?: number;
  texture_path: string;
  containsItems?: ProcessedSkyBlockItem[];
  shiny?: boolean;
  texture_pack?: string;
  wiki?: { fandom?: string; official?: string } | null;
  [key: string]: string | boolean;
};

export type ProcessedSkyblockPet = {
  display_name: string;
  lore: string[];
  type: string;
  rarity: string | null;
  texture_path: string;
  level: number;
  active: boolean;
  stats?: ItemStats;
  wiki?: { fandom?: string; official?: string } | null;
};

export type getTextureParams = {
  pack_ids?: string[];
  hotm?: boolean;
};

export type GemTier = {
  quality: number;
};

export type Gemstone = {
  slot_type: string;
  slot_number: number;
  gem_type: string;
  gem_tier: string | number;
  lore: string;
};

export type GetItemsItems = {
  armor: {
    armor: ProcessedItem[];
    stats: ItemStats;
    set_name?: string;
    set_rarity?: string;
  };
  accessories: ProcessedItem[];
  personal_vault: ProcessedItem[];
  inventory: ProcessedItem[];
  enderchest: ProcessedItem[];
  backpack: ProcessedItem[];
  equipment: {
    equipment: ProcessedItem[];
    stats: ItemStats;
  };
  wardrobe: ProcessedItem[][];
  weapons: {
    weapons: ProcessedItem[];
    highest_priority_weapon: ProcessedItem;
  };
  farming_tools: {
    highest_priority_tool: ProcessedItem | null;
    tools: ProcessedItem[];
  };
  mining_tools: {
    highest_priority_tool: ProcessedItem | null;
    tools: ProcessedItem[];
  };
  fishing_tools: {
    highest_priority_tool: ProcessedItem | null;
    tools: ProcessedItem[];
  };
  pets: ProcessedItem[];
  fishing_bag: ProcessedItem[];
  potion_bag: ProcessedItem[];
  quiver: ProcessedItem[];
  // candy_inventory: ProcessedItem[];
  museumItems: ProcessedItem[];
  museum: ProcessedItem[];
};

export type Items = {
  armor: {
    armor: ProcessedSkyBlockItem[];
    stats: ItemStats;
    set_name?: string;
    set_rarity?: string;
  };
  accessories: ProcessedSkyBlockItem[];
  personal_vault: ProcessedSkyBlockItem[];
  inventory: ProcessedSkyBlockItem[];
  enderchest: ProcessedSkyBlockItem[];
  backpack: ProcessedSkyBlockItem[];
  equipment: {
    equipment: ProcessedSkyBlockItem[];
    stats: ItemStats;
  };
  wardrobe: ProcessedSkyBlockItem[][];
  weapons: {
    weapons: ProcessedSkyBlockItem[];
    highest_priority_weapon?: ProcessedSkyBlockItem;
  };
  farming_tools: {
    highest_priority_tool?: ProcessedSkyBlockItem | null;
    tools: ProcessedSkyBlockItem[];
  };
  mining_tools: {
    highest_priority_tool?: ProcessedSkyBlockItem | null;
    tools: ProcessedSkyBlockItem[];
  };
  fishing_tools: {
    highest_priority_tool?: ProcessedSkyBlockItem | null;
    tools: ProcessedSkyBlockItem[];
  };
  pets: ProcessedSkyBlockItem[];
  fishing_bag: ProcessedSkyBlockItem[];
  potion_bag: ProcessedSkyBlockItem[];
  quiver: ProcessedSkyBlockItem[];
  // candy_inventory: ProcessedItem[];
  museumItems: ProcessedSkyBlockItem[];
  museum: ProcessedSkyBlockItem[];
  rift_inventory: ProcessedSkyBlockItem[];
  rift_enderchest: ProcessedSkyBlockItem[];
  rift_armor: {
    armor: ProcessedSkyBlockItem[];
    stats: ItemStats;
    set_name?: string;
    set_rarity?: string;
  };
  rift_equipment: {
    equipment: ProcessedSkyBlockItem[];
    stats: ItemStats;
  };
};

export type SpecialAccessory = {
  id: string;
  rarity: string;
  allowsRecomb?: boolean;
  allowsEnrichment?: boolean;
  rarities?: string[];
  customPrice?: boolean;
  upgrade?: {
    item: string;
    cost: Record<string, number>;
  };
};

export type Accessory = {
  id: string;
  rarity: string;
  name: string;
};

export type AccessoryRarities = {
  common: number;
  uncommon: number;
  rare: number;
  epic: number;
  legendary: number;
  mythic: number;
  special: number;
  very_special: number;
  abicase: {
    model: string | null;
  };
  rift_prism: boolean;
};

export type Accessories = {
  accessories: ProcessedItem[];
  accessory_ids: { id: string; rarity: string }[];
  accessory_rarities: Partial<AccessoryRarities>;
};

export type allAccessories = {
  id: string;
  texture_path?: string;
  rarity?: string;
  item_id?: number;
  damage?: number;
  texture?: string;
  material?: string;
  tier?: string;
  display_name?: string;
  name?: string;
  origin?: string;
  rift_transferrable?: boolean;
};

export type AccessoriesOutput = {
  accessories: ProcessedSkyBlockItem[];
  missing: ProcessedSkyBlockItem[];
  upgrades: ProcessedSkyBlockItem[];
  stats: ItemStats;
  enrichments: Record<string, number>;
  unique: number;
  total: number;
  recombobulated: number;
  totalRecombobulated: number;
  selectedPower: string | null;
  magicalPower: {
    total: number;
    accessories: number;
    abiphone: number;
    riftPrism: number;
    hegemony: {
      rarity: string | null;
      amount: number;
    };
    rarities: Record<string, { amount: number; magicalPower: number }>;
  };
};

export type SpecialAccessoryConstant = {
  allowsRecomb?: boolean;
  allowsEnrichment?: boolean;
  rarities?: string[];
  customPrice?: boolean;
};
/*
  'armor',
  'equipment',
  'wardrobe',
  'inventory',
  'enderchest',
  'accessories',
  'personal_vault',
  'fishing_bag',
  'potion_bag',
  'sacks_bag',
  'carnival_mask_inventory',
  'storage_0',
  'storage_1',
  'storage_2',
  'storage_3',
  'storage_7',
  'storage_8',
  'storage_9',
  'storage_10',
  'storage_14',
  'storage_15',
  'storage_16',
  'storage_17',
  'storage_icon_0',
  'storage_icon_1',
  'storage_icon_2',
  'storage_icon_3',
  'storage_icon_4',
  'storage_icon_5',
  'storage_icon_6',
  'storage_icon_7',
  'storage_icon_8',
  'storage_icon_9',
  'storage_icon_10',
  'storage_icon_11',
  'storage_icon_12',
  'storage_icon_13',
  'storage_icon_14',
  'storage_icon_15',
  'storage_icon_16',
  'storage_icon_17',
  'museum',
  'sacks',
  'essence',
  'pets',
  'candy_inventory',
  'quiver',
  'storage_4',
  'storage_5',
  'storage_6',
  'storage_11',
  'storage_12',
  'storage_13',
  'rift_inventory',
  'rift_enderchest',
  'rift_armor',
  'rift_equipment',
  'museumItems'
  */

export type RawInventoryType = "armor" | "equipment" | "wardrobe" | "inventory" | "enderchest" | "accessories" | "personal_vault" | "fishing_bag" | "potion_bag" | "sacks_bag" | "carnival_mask_inventory" | "storage_0" | "storage_1" | "storage_2" | "storage_3" | "storage_7" | "storage_8" | "storage_9" | "storage_10" | "storage_14" | "storage_15" | "storage_16" | "storage_17" | "storage_icon_0" | "storage_icon_1" | "storage_icon_2" | "storage_icon_3" | "storage_icon_4" | "storage_icon_5" | "storage_icon_6" | "storage_icon_7" | "storage_icon_8" | "storage_icon_9" | "storage_icon_10" | "storage_icon_11" | "storage_icon_12" | "storage_icon_13" | "storage_icon_14" | "storage_icon_15" | "storage_icon_16" | "storage_icon_17" | "museum" | "sacks" | "essence" | "pets" | "candy_inventory" | "quiver" | "storage_4" | "storage_5" | "storage_6" | "storage_11" | "storage_12" | "storage_13" | "rift_inventory" | "rift_enderchest" | "rift_armor" | "rift_equipment" | "museumItems";

export type RawItems = Record<Exclude<RawInventoryType, "museumItems">, Item[] | Pet[]> & {
  museumItems: {
    items: {
      donated_timed: NumerableFormatNumberOptions;
      borrowing?: boolean;
      items: Item[];
    };
    special: {
      donated_timed: number;
      items: Item[];
    };
  };
};
