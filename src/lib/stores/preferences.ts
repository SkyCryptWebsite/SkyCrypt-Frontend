import { sections } from "$lib/sections/constants";
import type { SectionID } from "$lib/sections/types";
import { persisted } from "svelte-persisted-store";

export const sectionOrderPreferences = persisted<SectionID[]>("sectionOrderPreferences", sections);

export const performanceMode = persisted<boolean>("performanceMode", false);
