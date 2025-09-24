export interface NetworthResult {
  /**
   * The total networth of the player.
   */
  networth: number;
  /**
   * The total networth of the player without the soulbound items.
   */
  unsoulboundNetworth: number;
  /**
   * Whether the player has inventory API disabled or not.
   */
  noInventory: boolean;
  /**
   * Whether the non cosmetic items are included in the networth calculation.
   */
  isNonCosmetic: boolean;
  /**
   * The purse balance of the player.
   */
  purse: number;
  /**
   * The bank balance of the player.
   */
  bank: number;
  /**
   * The personal bank balance of the player.
   */
  personalBank: number;
  /**
   * The total networth of the player's inventories.
   */
  types: Record<Inventories, Inventory>;
}

type Inventories = "armor" | "equipment" | "wardrobe" | "inventory" | "enderchest" | "accessories" | "personal_vault" | "fishing_bag" | "potion_bag" | "sacks_bag" | "candy_inventory" | "carnival_mask_inventory" | "storage" | "museum" | "sacks" | "essence" | "pets" | "quiver";

type Inventory = {
  /**
   * The total networth of the inventory.
   */
  total: number;
  /**
   * The total networth of the inventory without the soulbound items.
   */
  unsoulboundTotal: number;
  /**
   * The items in the inventory
   * Only included if the onlyNetworth option is false.
   */
  items?: Array<Item>;
};

export type Item = {
  /**
   * The name of the item.
   */
  name: string;
  /**
   * The display name of the item.
   */
  loreName: string;
  /**
   * The id of the item.
   */
  id: string;
  /**
   * The base price of the item.
   */
  basePrice: number;
  /**
   * The price of the item.
   */
  price: number;
  /**
   * The soulbound portion of the item. This is present when part of an item is soulbound but the item itself is not.
   */
  soulboundPortion?: number;
  /**
   * The calculation of the item.
   */
  calculation: Calculation[];
  /**
   * The amount of the item
   */
  count: number;
  /**
   * Whether the item is soulbound or not.
   */
  soulbound: boolean;
  /**
   * Whether the item is cosmetic or not.
   */
  cosmetic: boolean;
  /**
   * The item data of the item.
   * Only included if the includeItemData option is true.
   */
  item?: object;
  /**
   * The pet data of the item.
   * Only included if the includeItemData option is true.
   */
  petData?: object;
};

type Calculation = {
  /**
   * The name of the item modifier.
   */
  id: string;
  /**
   * The id of the item modifier.
   */
  type: string;
  /**
   * The value of the item modifier.
   */
  price: number;
  /**
   * The amount of the item modifier.
   */
  count: number;
  /**
   * The amount of Attribute Shards on the item.
   */
  shards?: number;
  /**
   * The amount of stars on the item.
   */
  star?: number;
  /**
   * Whether this part of the calculation is soulbound.
   */
  soulbound?: boolean;
};
