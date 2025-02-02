import { BUKKIT_TO_ID } from "./data/bukkitToId";

async function getItems() {
  const data = await fetch("https://api.hypixel.net/resources/skyblock/items");
  const response = await data.json();

  const output = {};
  for (const item of response.items) {
    const { id, name, tier, category, skin, durability, ...rest } = item;

    const obj = { id, name, item_id: BUKKIT_TO_ID[item?.material] || 0, ...rest };
    if (tier) {
      obj.tier = tier.toLowerCase();
    }

    if (category) {
      obj.category = category.toLowerCase();
    }

    if (durability) {
      obj.damage = durability;
    }

    if (skin) {
      obj.texture = getSkinHash(skin.value);
    }

    output[id] = obj;
  }
}

getItems();
