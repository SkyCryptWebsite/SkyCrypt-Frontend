import { PersistedState } from "runed";
import { createContext, untrack } from "svelte";

interface FavoritesData {
  uuid: string;
  ign: string;
  displayName?: string;
}

export class FavoritesContext {
  #data = new PersistedState<FavoritesData[]>("skycryptFavorites", []);

  constructor() {
    $effect.pre(() => {
      untrack(() => {
        this.loadOldFavorites();
      });
    });
  }

  get current() {
    return this.#data.current;
  }

  set current(value: FavoritesData[]) {
    this.#data.current = value;
  }

  loadOldFavorites() {
    loadSetting("favorites", (value: FavoritesData[]) => {
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

const [getFavorites, setFavorites] = createContext<FavoritesContext>();

function initFavorites() {
  const favorites = new FavoritesContext();
  setFavorites(favorites);
  return favorites;
}

export { getFavorites, initFavorites };
