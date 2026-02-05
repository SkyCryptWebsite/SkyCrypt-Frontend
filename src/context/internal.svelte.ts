import { SettingsTab } from "$lib/components/header/types";
import { sections } from "$lib/sections/constants";
import type { SectionName } from "$lib/sections/types";
import type { ModelsStrippedItem } from "$lib/shared/api/orval-generated";
import type { Snippet } from "svelte";
import { createContext } from "svelte";

interface InternalStateData {
  tabValue: SectionName;
  showItem: boolean;
  itemContent: ModelsStrippedItem | undefined;
  itemContentSpecial: ModelsStrippedItem | undefined;
  content: Snippet | undefined;
  openCommand: boolean;
  settingsOpen: boolean;
  settingsTab: SettingsTab;
}

export class InternalStateContext {
  #data = $state<InternalStateData>({
    tabValue: sections[0].name,
    showItem: false,
    itemContent: undefined,
    itemContentSpecial: undefined,
    content: undefined,
    openCommand: false,
    settingsOpen: false,
    settingsTab: SettingsTab.Packs
  });

  get tabValue() {
    return this.#data.tabValue;
  }

  set tabValue(value: SectionName) {
    this.#data.tabValue = value;
  }

  get showItem() {
    return this.#data.showItem;
  }

  set showItem(value: boolean) {
    this.#data.showItem = value;
  }

  get itemContent() {
    return this.#data.itemContent;
  }

  set itemContent(value: ModelsStrippedItem | undefined) {
    this.#data.itemContent = value;
  }

  get itemContentSpecial() {
    return this.#data.itemContentSpecial;
  }

  set itemContentSpecial(value: ModelsStrippedItem | undefined) {
    this.#data.itemContentSpecial = value;
  }

  get content() {
    return this.#data.content;
  }

  set content(value: Snippet | undefined) {
    this.#data.content = value;
  }

  get openCommand() {
    return this.#data.openCommand;
  }

  set openCommand(value: boolean) {
    this.#data.openCommand = value;
  }

  get settingsOpen() {
    return this.#data.settingsOpen;
  }

  set settingsOpen(value: boolean) {
    this.#data.settingsOpen = value;
  }

  get settingsTab() {
    return this.#data.settingsTab;
  }

  set settingsTab(value: SettingsTab) {
    this.#data.settingsTab = value;
  }
}

const [getInternalState, setInternalState] = createContext<InternalStateContext>();

function initInternalState() {
  const internalState = new InternalStateContext();
  setInternalState(internalState);
  return internalState;
}

export { getInternalState, initInternalState };
