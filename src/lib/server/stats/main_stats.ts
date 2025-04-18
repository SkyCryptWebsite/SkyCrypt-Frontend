import type { MainStats, Member, MuseumRaw, NetworthResultStripped, Profile, RawItems } from "$types/global";
import { parseItems, ProfileNetworthCalculator, type NetworthResult } from "skyhelper-networth";
import { FAIRY_SOULS } from "../constants/constants";

function stripNetworthData(networth: NetworthResult) {
  const output = {
    noInventory: networth.noInventory,
    networth: networth.networth,
    unsoulboundNetworth: networth.unsoulboundNetworth,
    types: {}
  } as NetworthResultStripped;
  for (const [key, value] of Object.entries(networth.types)) {
    if (key.startsWith("storage")) {
      if (output.types["storage"]) {
        continue;
      }

      const total = Object.keys(networth.types)
        .filter((k) => k.startsWith("storage"))
        .reduce((acc, k) => acc + (networth.types[k].total ?? 0), 0);
      // const unsoulboundTotal = Object.keys(networth.types)
      //   .filter((k) => k.startsWith("storage"))
      //   .reduce((acc, k) => acc + (networth.types[k].unsoulboundTotal ?? 0), 0);
      output.types["storage"] = { total };
      continue;
    }

    output.types[key] = {
      total: value.total
      // unsoulboundTotal: value.unsoulboundTotal
    };
  }

  return output;
}

export async function getMainStats(userProfile: Member, userMuseum: MuseumRaw | null, profile: Profile): Promise<MainStats> {
  const RIFT_INVENTORY = userProfile.rift?.inventory;

  const decodedItems = await parseItems(userProfile, userMuseum as object, {
    combineStorage: false,
    removeEmptyItems: false,
    returnRawMuseum: true,
    additionalInventories: {
      rift_inventory: RIFT_INVENTORY?.inv_contents?.data ?? "",
      rift_enderchest: RIFT_INVENTORY?.ender_chest_contents?.data ?? "",
      rift_armor: RIFT_INVENTORY?.inv_armor?.data ?? "",
      rift_equipment: RIFT_INVENTORY?.equipment_contents?.data ?? ""
    }
  });

  // Prepare items for networth calculation, rift inventory is not included in the networth calculation
  const networthItems = { ...decodedItems };
  delete networthItems.museumItems;
  delete networthItems.rift_inventory;
  delete networthItems.rift_enderchest;
  delete networthItems.rift_armor;
  delete networthItems.rift_equipment;

  const bank = profile.banking?.balance ?? 0;
  const networthCalculator = ProfileNetworthCalculator.fromPreParsed(userProfile, networthItems, bank);
  const [networth, nonCosmeticNetworth] = await Promise.all([
    // prettier-ignore
    networthCalculator.getNetworth(),
    networthCalculator.getNonCosmeticNetworth()
  ]);

  // Copy all items with their prices to the items object
  const items = {} as Record<string, object[]>;
  const networthCategories = {} as Record<string, number>;
  for (const [categoryId, categoryData] of Object.entries(networth.types)) {
    items[categoryId] = categoryData.items?.map((item) => ({ ...(item.item ?? item.petData ?? item), price: item.price })) ?? [];
    networthCategories[categoryId] = categoryData.total ?? 0;
  }

  // Add rift inventory items
  for (const [categoryId, categoryData] of Object.entries(decodedItems)) {
    if (!items[categoryId]) {
      items[categoryId] = categoryData;
    }
  }

  // TODO: implement these
  delete items["sacks_bag"];
  delete items["carnival_mask_inventory"];
  delete items["candy_inventory"];
  delete items["sacks"];
  delete items["essence"];

  return {
    joined: userProfile.profile?.first_join ?? 0,
    cookieBuffActive: userProfile.profile?.cookie_buff_active ?? false,
    purse: userProfile.currencies?.coin_purse ?? 0,
    bank: bank,
    personalBank: userProfile.profile?.bank_account ?? 0,
    fairySouls: {
      found: userProfile.fairy_soul?.total_collected ?? 0,
      total: FAIRY_SOULS[profile.game_mode ?? "normal"] ?? FAIRY_SOULS["normal"]
    },
    networth: stripNetworthData(networth),
    nonCosmeticNetworth: stripNetworthData(nonCosmeticNetworth),
    extra: {
      networthCategories,
      rawItems: items as RawItems
    }
  };
}
