import { sections } from "$lib/sections/constants";
import type { SectionName } from "$lib/sections/types";
import { sectionOrderPreferences } from "$lib/stores/preferences";
import type { ProcessedSkyBlockItem } from "$types/global";
import type { PetProcessedSkyBlockItem } from "$types/statsv2";
import type { Snippet } from "svelte";
import { get, writable } from "svelte/store";

export const tabValue = writable<SectionName>(get(sectionOrderPreferences)[0].name || sections[0].name);
export const showItem = writable<boolean>(false);
export const showItemTooltip = writable<boolean>(false);
export const tooltipAnchor = writable<HTMLElement>(null!);
export const itemContent = writable<ProcessedSkyBlockItem | PetProcessedSkyBlockItem | undefined>();

export const content = writable<Snippet | undefined>(undefined);
