import { createContext } from "svelte";
import type { TabNames } from "../types";

export class CurrentTabContext {
  #source: () => TabNames | null;

  constructor(source: () => TabNames | null = () => null) {
    this.#source = source;
  }

  get current() {
    return this.#source();
  }
}

export const [getCurrentTabContext, setCurrentTabContext] = createContext<CurrentTabContext>();
