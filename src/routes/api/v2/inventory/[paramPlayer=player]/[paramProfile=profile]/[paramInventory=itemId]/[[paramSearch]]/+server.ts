import { REDIS } from "$lib/server/db/redis";
import { processItems } from "$lib/server/stats/items/processing.js";
import { stripItems } from "$lib/server/stats/items/stripping.js";
import { getMuseumItems } from "$lib/server/stats/museum.js";
import { titleCase } from "$lib/shared/helper.js";
import { json } from "@sveltejs/kit";

const ICONS = {
  backpack: "/api/item/chest",
  enderchest: "/api/item/ender_chest",
  personal_vault: "/api/head/f7aadff9ddc546fdcec6ed5919cc39dfa8d0c07ff4bc613a19f2e6d7f2593",
  talisman_bag: "/api/head/961a918c0c49ba8d053e522cb91abc74689367b4d8aa06bfc1ba9154730985ff",
  potion_bag: "/api/head/9f8b82427b260d0a61e6483fc3b2c35a585851e08a9a9df372548b4168cc817c",
  fishing_bag: "/api/head/eb8e297df6b8dffcf135dba84ec792d420ad8ecb458d144288572a84603b1631",
  quiver: "/api/head/4cb3acdc11ca747bf710e59f4c8e9b3d949fdd364c6869831ca878f0763d1787",
  museum: "/api/head/438cf3f8e54afc3b3f91d20a49f324dca1486007fe545399055524c17941f4dc",
  rift_inventory: "/api/head/445240fcf1a9796327dda5593985343af9121a7156bc76e3d6b341b02e6a6e52",
  rift_enderchest: "/api/head/a6cc486c2be1cb9dfcb2e53dd9a3e9a883bfadb27cb956f1896d602b4067",
  search: "/api/item/EYE_OF_ENDER",
  unknown: "/api/item/BARRIER"
} as Record<string, string>;

const getIcon = (inventory: string | undefined, uuid: string) => {
  if (!inventory) {
    return ICONS.unknown;
  }

  if (inventory.includes("backpack")) {
    inventory = "backpack";
  }

  return ICONS[inventory] || `https://crafatar.com/renders/head/${uuid}?overlay`;
};

export async function GET({ params, cookies }) {
  const { paramPlayer, paramProfile, paramInventory, paramSearch } = params;

  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");
  const rawItems = await REDIS.get(`profile:${paramProfile}:${packs.join("")}:items`);
  const items = JSON.parse(rawItems as string);

  if (paramInventory === "search" && paramSearch) {
    const combinedItems = [];

    delete items.museum;
    for (const key in items) {
      const item = processItems(items[key], key, packs, { pack: false, category: false });
      const containsItems = item.map((i) => i.containsItems || []).flat();
      const allItems = item.concat(containsItems);

      combinedItems.push(...stripItems(allItems, ["extra.source"]));
    }

    const searchQuery = paramSearch.toLowerCase();
    const foundItems = combinedItems
      .filter((item) => {
        const displayName = item.display_name?.toLowerCase() || "";
        return displayName.includes(searchQuery) || (item.lore && item.lore.some((line) => line.toLowerCase().includes(searchQuery)));
      })
      .map((item) => ({
        ...item,
        sourceTab: { name: titleCase(item.source ?? "unknown"), icon: getIcon(item.source, paramPlayer) }
      }));

    return json(foundItems);
  }

  if (paramInventory === "museum") {
    const museumInventory = getMuseumItems(items[paramInventory]).inventory;
    const strippedMuseumInventory = stripItems(museumInventory);

    return json(strippedMuseumInventory);
  }

  const processedItems = processItems(items[paramInventory], paramInventory, packs, { pack: false, category: false });
  const strippedItems = stripItems(processedItems);
  return json(strippedItems);
}
