import { PersistedState } from "runed";
import { createContext, untrack } from "svelte";

type DisabledPacksData = string;

export class DisabledPacksContext {
  #data = new PersistedState<DisabledPacksData[]>("skycryptDisabledPacks", []);

  constructor() {
    $effect.pre(() => {
      untrack(() => {
        this.loadOldDisabledPacks();
      });
    });
  }

  get current() {
    return this.#data.current;
  }

  set current(value: DisabledPacksData[]) {
    this.#data.current = value;
  }

  loadOldDisabledPacks() {
    loadSetting("disabledPacks", (value: DisabledPacksData[]) => {
      this.current = value;
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

const [getDisabledPacks, setDisabledPacks] = createContext<DisabledPacksContext>();

function initDisabledPacks() {
  const disabledPacks = new DisabledPacksContext();
  setDisabledPacks(disabledPacks);
  return disabledPacks;
}

export { getDisabledPacks, initDisabledPacks };
