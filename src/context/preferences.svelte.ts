import { browser } from "$app/environment";
import { loadOldStorageKey } from "$ctx/utils";
import { sections } from "$lib/sections/constants";
import type { SectionID } from "$lib/sections/types";
import { PersistedState } from "runed";
import { createContext, untrack } from "svelte";

interface PreferencesData {
  sectionOrder: SectionID[];
  performanceMode: boolean;
  keybind: string;
  showGlint: boolean;
  rainbowEnchantments: boolean;
  mctooltip: boolean;
}

export class PreferencesContext {
  #data = new PersistedState<PreferencesData>("skycryptPreferences", {
    sectionOrder: sections,
    performanceMode: false,
    keybind: "/",
    showGlint: true,
    rainbowEnchantments: false,
    mctooltip: false
  });

  constructor() {
    $effect.pre(() => {
      untrack(() => {
        this.loadOldSettings();
        // Apply rainbow setting on load
        this.rainbowEnchantments = !!this.rainbowEnchantments;
      });
    });
  }

  get sectionOrder() {
    return this.#data.current.sectionOrder;
  }

  set sectionOrder(value: SectionID[]) {
    const newOrder = [];
    // Validate all sections exist
    for (const id of value) {
      const existing = sections.find((section) => section.id === id.id);
      if (existing) {
        // New object to avoid reference issues
        newOrder.push({ ...existing });
      }
    }
    this.#data.current = { ...this.#data.current, sectionOrder: newOrder };
  }

  get performanceMode() {
    return this.#data.current.performanceMode;
  }

  set performanceMode(value: boolean) {
    this.#data.current = { ...this.#data.current, performanceMode: value };
  }

  get keybind() {
    return this.#data.current.keybind;
  }

  set keybind(value: string) {
    this.#data.current = { ...this.#data.current, keybind: value };
  }

  get showGlint() {
    return this.#data.current.showGlint;
  }

  set showGlint(value: boolean) {
    this.#data.current = { ...this.#data.current, showGlint: value };
  }

  get rainbowEnchantments() {
    return this.#data.current.rainbowEnchantments;
  }

  set rainbowEnchantments(value: boolean) {
    this.#data.current = { ...this.#data.current, rainbowEnchantments: value };
    if (browser) {
      document.documentElement.dataset.rainbow = value ? "true" : "false";
    }
  }

  get mctooltip() {
    return this.#data.current.mctooltip;
  }

  set mctooltip(value: boolean) {
    this.#data.current = { ...this.#data.current, mctooltip: value };
  }

  loadOldSettings() {
    loadOldStorageKey("sectionOrderPreferences", (value: SectionID[]) => {
      this.sectionOrder = value;
    });
    loadOldStorageKey("performanceMode", (value: boolean) => {
      this.performanceMode = typeof value === "string" ? value === "true" : value;
    });
    loadOldStorageKey("keybind", (value: string) => {
      this.keybind = value;
    });
    loadOldStorageKey("showGlint", (value: boolean) => {
      this.showGlint = value;
    });
    loadOldStorageKey("rainbowEnchantments", (value: boolean) => {
      this.rainbowEnchantments = value;
    });
  }
}

const [getPreferences, setPreferences] = createContext<PreferencesContext>();

function initPreferences() {
  const preferences = new PreferencesContext();
  setPreferences(preferences);
  return preferences;
}

export { getPreferences, initPreferences };
