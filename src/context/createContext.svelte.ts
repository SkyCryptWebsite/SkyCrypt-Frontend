import type { IsHover } from "$lib/hooks/is-hover.svelte";
import type { IsMobile } from "$lib/hooks/is-mobile.svelte";
import type { ModelsMiscOutput, ModelsResourcePackConfig, ModelsSkillsOutput, ModelsStatsOutput } from "$lib/shared/api/orval-generated";
import { createContext } from "svelte";

export const [getProfileContext, setProfileContext] = createContext<ModelsStatsOutput>();
export const [getSkillsContext, setSkillsContext] = createContext<ModelsSkillsOutput>();
export const [getMiscContext, setMiscContext] = createContext<ModelsMiscOutput>();
export const [getMobileContext, setMobileContext] = createContext<IsMobile>();
export const [getHoverContext, setHoverContext] = createContext<IsHover>();
export const [getPacksContext, setPacksContext] = createContext<ModelsResourcePackConfig[]>();
