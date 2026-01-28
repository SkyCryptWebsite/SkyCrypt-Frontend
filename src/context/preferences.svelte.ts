import { browser } from "$app/environment";
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
}

export class PreferencesContext {
  #data = new PersistedState<PreferencesData>("skycryptPreferences", {
    sectionOrder: sections,
    performanceMode: false,
    keybind: "/",
    showGlint: true,
    rainbowEnchantments: false
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

  loadOldSettings() {
    loadSetting("sectionOrderPreferences", (value: SectionID[]) => {
      this.sectionOrder = value;
    });
    loadSetting("performanceMode", (value: boolean) => {
      this.performanceMode = typeof value === "string" ? value === "true" : value;
    });
    loadSetting("keybind", (value: string) => {
      this.keybind = value;
    });
    loadSetting("showGlint", (value: boolean) => {
      this.showGlint = value;
    });
    loadSetting("rainbowEnchantments", (value: boolean) => {
      this.rainbowEnchantments = value;
    });

    function loadSetting<T>(key: string, setter: (value: T) => void) {
      const item = localStorage.getItem(key);
      if (item !== null) {
        try {
          const value = item.startsWith("{") || item.startsWith("[") ? JSON.parse(item) : item;
          setter(value);
          localStorage.removeItem(key);
        } catch (e) {
          console.error(`Failed to load old setting for ${key}:`, e);
        }
      }
    }
  }
}

const [getPreferences, setPreferences] = createContext<PreferencesContext>();

function initPreferences() {
  const preferences = new PreferencesContext();
  setPreferences(preferences);
  return preferences;
}

export { getPreferences, initPreferences };
