import { error } from "console";
import { REDIS } from "../db/redis";
import { getArmor } from "./items/armor";
import { getEquipment } from "./items/equipment";
import { stripItems } from "./items/stripping";
import { getWardrobe } from "./items/wardrobe";

export async function getMainItems(profileId: string, packs: string[]) {
  const rawItems = await REDIS.get(`profile:${profileId}:${packs.join("")}:main_items`);
  const items = rawItems ? JSON.parse(rawItems) : null;
  if (!items) {
    return error(404, `No items found for profile ${profileId}. Please try again later.`);
  }

  const armor = getArmor(items.armor);
  const equipment = getEquipment(items.equipment);

  return {
    armor: {
      ...armor,
      armor: stripItems(armor.armor)
    },
    equipment: {
      ...equipment,
      equipment: stripItems(equipment.equipment)
    },
    wardrobe: getWardrobe(items.wardrobe).map((set) => stripItems(set))
  };
}
