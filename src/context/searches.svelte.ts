import { loadOldStorageKey } from "$ctx/utils";
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
    loadOldStorageKey("recentSearches", (value: RecentSearchData[]) => {
      this.current = value;
    });
  }
}

const [getRecentSearches, setRecentSearches] = createContext<RecentSearchesContext>();

function initRecentSearches() {
  const recentSearches = new RecentSearchesContext();
  setRecentSearches(recentSearches);
  return recentSearches;
}

export { getRecentSearches, initRecentSearches };
