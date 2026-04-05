import { browser } from "$app/environment";
import { loadOldStorageKey } from "$ctx/utils";
import { PersistedState } from "runed";
import { createContext, untrack } from "svelte";

type DisabledPacksData = string;

export class DisabledPacksContext {
  #data = new PersistedState<DisabledPacksData[]>("skycryptDisabledPacks", []);

  constructor() {
    $effect.pre(() => {
      untrack(() => {
        this.loadOldDisabledPacks();
        this.syncCookie(this.#data.current);
      });
    });
  }

  get current() {
    return this.#data.current;
  }

  set current(value: DisabledPacksData[]) {
    this.#data.current = value;
    this.syncCookie(value);
  }

  syncCookie(value: DisabledPacksData[]) {
    if (!browser) return;

    document.cookie = `disabledPacks=${JSON.stringify(value)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
  }

  loadOldDisabledPacks() {
    loadOldStorageKey("disabledPacks", (value: DisabledPacksData[]) => {
      this.current = value;
    });
  }
}

const [getDisabledPacks, setDisabledPacks] = createContext<DisabledPacksContext>();

function initDisabledPacks() {
  const disabledPacks = new DisabledPacksContext();
  setDisabledPacks(disabledPacks);
  return disabledPacks;
}

export { getDisabledPacks, initDisabledPacks };
