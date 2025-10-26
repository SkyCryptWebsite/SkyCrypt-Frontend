import type { IsHover } from "$lib/hooks/is-hover.svelte";
import type { IsMobile } from "$lib/hooks/is-mobile.svelte";
import type { ModelsMiscOutput, ModelsResourcePackConfig, ModelsSkillsOutput, ModelsStatsOutput } from "$lib/shared/api/orval-generated";
import { createContext } from "svelte";

export class PacksContext {
  #packs: ModelsResourcePackConfig[] = $state([]);

  get packs() {
    return this.#packs;
  }

  set packs(value: ModelsResourcePackConfig[]) {
    this.#packs = value;
  }
}

export class MiscContext {
  #misc: ModelsMiscOutput | null = $state(null);

  get misc() {
    return this.#misc;
  }

  set misc(value: ModelsMiscOutput | null) {
    this.#misc = value;
  }
}

export class SkillsContext {
  #skills: ModelsSkillsOutput | null = $state(null);

  get skills() {
    return this.#skills;
  }

  set skills(value: ModelsSkillsOutput | null) {
    this.#skills = value;
  }
}

export const [getProfileContext, setProfileContext] = createContext<ModelsStatsOutput>();
export const [getSkillsContext, setSkillsContext] = createContext<SkillsContext>();
export const [getMiscContext, setMiscContext] = createContext<MiscContext>();
export const [getMobileContext, setMobileContext] = createContext<IsMobile>();
export const [getHoverContext, setHoverContext] = createContext<IsHover>();
export const [getPacksContext, setPacksContext] = createContext<PacksContext>();
