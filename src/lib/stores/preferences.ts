import { browser } from "$app/environment";
import { sections } from "$lib/sections/constants";
import type { SectionID } from "$lib/sections/types";
import { persisted } from "svelte-persisted-store";

export const sectionOrderPreferences = persisted<SectionID[]>("sectionOrderPreferences", sections);
export const performanceMode = persisted<boolean>("performanceMode", false);
export const keybind = persisted<string>("keybind", "/");
export const showGlint = persisted<boolean>("showGlint", true);
export const rainbowEnchantments = persisted<boolean>("rainbowEnchantments", true);

// Check for invalid section order and reset if found
if (browser) {
  sectionOrderPreferences.subscribe((value) => {
    // @ts-expect-error Armor and Weapons do not exist in SectionName type, that's why we're checking for it and removing it
    if (value.find((section) => section.name === "Armor" || section.name === "Weapons")) {
      console.warn("Invalid section order detected! Resetting preferences.");
      localStorage.removeItem("sectionOrderPreferences");
      window.location.reload();
    }
  });
}
