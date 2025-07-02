import { BUKKIT_TO_ID } from "./data/bukkitToId";

function getSkinHash(base64: string) {
  let texture = null;
  try {
    texture = JSON.parse(Buffer.from(base64, "base64").toString()).textures.SKIN.url.split("/").pop();
  } catch {
    // Do nothing
  }

  return texture;
}

async function getItems() {
  const data = await fetch("https://api.hypixel.net/resources/skyblock/items");
  const response = await data.json();

  const items = {};
  for (const item of response.items) {
    const { id, name, tier, category, skin, durability, ...rest } = item;

    const obj = {
      id,
      name,
      item_id: BUKKIT_TO_ID[item?.material] || 0,
      ...rest,
      tier: item.tier ? item.tier.toLowerCase() : "common",
      damage: item.durability || 0
    };

    if (category) {
      obj.category = category.toLowerCase();
    }

    if (skin) {
      obj.texture = getSkinHash(skin.value);
    }

    items[id] = obj;
  }

  console.info(items);
}

getItems();
