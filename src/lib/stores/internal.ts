import { SettingsTab } from "$lib/components/header/types";
import { sections } from "$lib/sections/constants";
import type { SectionName } from "$lib/sections/types";
import type { ModelsStrippedItem } from "$lib/shared/api/orval-generated";
import type { Snippet } from "svelte";
import { writable } from "svelte/store";

export const tabValue = writable<SectionName>(sections[0].name);
export const showItem = writable<boolean>(false);
export const tooltipAnchor = writable<HTMLElement>(null!);
export const itemContent = writable<ModelsStrippedItem | undefined>();
export const itemContentSpecial = writable<ModelsStrippedItem | undefined>();
export const content = writable<Snippet | undefined>(undefined);
export const openCommand = writable<boolean>(false);
export const settingsOpen = writable<boolean>(false);
export const settingsTab = writable<SettingsTab>(SettingsTab.Packs);
export const api_token = writable<{
  token: string;
  timestamp: string;
  route: string;
} | null>(null);
