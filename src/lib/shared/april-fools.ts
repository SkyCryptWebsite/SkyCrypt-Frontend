import type { SectionName } from "$lib/sections/types";

const APRIL_FOOLS_YEAR = 2026;
const APRIL_FOOLS_MONTH = 3;
const APRIL_FOOLS_DAY = 1;

const APRIL_FOOLS_PROFILE_BADGES = ["Certified RNG Victim", "Bazaar Goblin", "Dungeon Gremlin", "Minion Micromanager", "Accessory Addict", "Kuudra Queue Survivor", "Definitely Ironman", "Garden Menace", "Suspiciously Lucky", "Necron's Favorite"] as const;

const APRIL_FOOLS_SECTION_LABELS: Partial<Record<SectionName, string>> = {
  Gear: "Loot Goblin Closet",
  Accessories: "Talisman Hoard",
  Pets: "Emotional Support Mobs",
  Inventory: "Definitely Not Duped Items",
  Skills: "Ways To Suffer",
  Dungeons: "Necron Fan Club",
  Slayer: "Anger Management",
  Minions: "Child Labor Spreadsheet",
  Bestiary: "Things You Have Bonked",
  Collections: "Evidence Locker",
  Crimson_Isle: "Lag Volcano",
  Attribute_Shards: "Tiny Expensive Problems",
  Rift: "Other Dimension Nonsense",
  Misc: "Total MAYHEM"
};

export function isAprilFoolsActive(date = new Date()) {
  return date.getFullYear() === APRIL_FOOLS_YEAR && date.getMonth() === APRIL_FOOLS_MONTH && date.getDate() === APRIL_FOOLS_DAY;
}

export function getSectionDisplayName(sectionName: SectionName) {
  if (!isAprilFoolsActive()) {
    return sectionName.replaceAll("_", " ");
  }

  return APRIL_FOOLS_SECTION_LABELS[sectionName] ?? sectionName.replaceAll("_", " ");
}

export function getAprilFoolsProfileBadge(seed: string) {
  if (!seed) {
    return APRIL_FOOLS_PROFILE_BADGES[0];
  }

  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  return APRIL_FOOLS_PROFILE_BADGES[hash % APRIL_FOOLS_PROFILE_BADGES.length];
}
