import { InternalStateContext } from "$ctx/internal.svelte";

export interface TestContextConfig {
  hover?: {
    current: boolean;
  };
  internalState?: {
    content?: any;
    showItem?: boolean;
    settingsOpen?: boolean;
  };
}

export class MockIsHover {
  #current = $state(false);

  constructor(initialValue = false) {
    this.#current = initialValue;
  }

  get current() {
    return this.#current;
  }

  set current(value: boolean) {
    this.#current = value;
  }

  get matches() {
    return this.#current;
  }
}

export function createMockContexts(config: TestContextConfig = {}) {
  const hoverContext = new MockIsHover(config.hover?.current ?? false);
  const internalStateContext = new InternalStateContext();

  if (config.internalState) {
    if (config.internalState.content !== undefined) {
      internalStateContext.content = config.internalState.content;
    }
    if (config.internalState.showItem !== undefined) {
      internalStateContext.showItem = config.internalState.showItem;
    }
    if (config.internalState.settingsOpen !== undefined) {
      internalStateContext.settingsOpen = config.internalState.settingsOpen;
    }
  }

  return {
    hoverContext,
    internalStateContext
  };
}
