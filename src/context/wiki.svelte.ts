import { loadOldStorageKey } from "$ctx/utils";
import { PersistedState } from "runed";
import { createContext, untrack } from "svelte";

export interface WikiOrderData {
  id: number;
  name: string;
  link: string;
}

export class WikiOrderContext {
  #data = new PersistedState<WikiOrderData[]>("skycryptWikiOrder", [
    { id: 1, name: "Official", link: "https://wiki.hypixel.net" },
    { id: 2, name: "Fandom", link: "https://hypixel-skyblock.fandom.com" }
  ]);

  constructor() {
    $effect.pre(() => {
      untrack(() => {
        this.loadOldWikiOrder();
      });
    });
  }

  get current() {
    return this.#data.current;
  }

  set current(value: WikiOrderData[]) {
    this.#data.current = value;
  }

  loadOldWikiOrder() {
    loadOldStorageKey("wikiOrderPreferences", (value: WikiOrderData[]) => {
      this.current = value;
    });
  }
}

const [getWikiOrder, setWikiOrder] = createContext<WikiOrderContext>();

function initWikiOrder() {
  const wikiOrder = new WikiOrderContext();
  setWikiOrder(wikiOrder);
  return wikiOrder;
}

export { getWikiOrder, initWikiOrder };
