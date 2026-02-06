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
