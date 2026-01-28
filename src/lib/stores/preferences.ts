import { browser } from "$app/environment";
import { sections } from "$lib/sections/constants";
import type { SectionID } from "$lib/sections/types";
import { PersistedState } from "runed";

export const sectionOrderPreferences = new PersistedState<SectionID[]>("sectionOrderPreferences", sections);
export const performanceMode = new PersistedState<boolean>("performanceMode", false);
export const keybind = new PersistedState<string>("keybind", "/");
export const showGlint = new PersistedState<boolean>("showGlint", true);
export const rainbowEnchantments = new PersistedState<boolean>("rainbowEnchantments", false);

// Check for invalid section order and reset if found
if (browser) {
  // @ts-expect-error Armor and Weapons do not exist in SectionName type, that's why we're checking for it and removing it
  if (sectionOrderPreferences.current.find((section) => section.name === "Armor" || section.name === "Weapons")) {
    console.warn("Invalid section order detected! Resetting preferences.");
    localStorage.removeItem("sectionOrderPreferences");
    window.location.reload();
  }
}
