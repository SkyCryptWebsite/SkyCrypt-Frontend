import { PersistedState } from "runed";
import { createContext, untrack } from "svelte";

interface RecentSearchData {
  uuid?: string;
  ign: string;
}

export class RecentSearchesContext {
  #data = new PersistedState<RecentSearchData[]>("skycryptRecentSearches", []);

  constructor() {
    $effect.pre(() => {
      untrack(() => {
        this.loadOldRecentSearches();
      });
    });
  }

  get current() {
    return this.#data.current;
  }

  set current(value: RecentSearchData[]) {
    this.#data.current = value;
  }

  loadOldRecentSearches() {
    loadSetting("recentSearches", (value: RecentSearchData[]) => {
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

const [getRecentSearches, setRecentSearches] = createContext<RecentSearchesContext>();

function initRecentSearches() {
  const recentSearches = new RecentSearchesContext();
  setRecentSearches(recentSearches);
  return recentSearches;
}

export { getRecentSearches, initRecentSearches };
