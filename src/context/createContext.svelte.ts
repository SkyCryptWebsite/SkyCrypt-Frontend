import { createContext } from "svelte";
import type { z } from "zod";
import type { IsHover } from "#lib/hooks/is-hover.svelte.js";
import type { IsMobile } from "#lib/hooks/is-mobile.svelte.js";
import type {
  CombinedOutput,
  MiscOutput,
  ResourcePackConfig,
  StatData,
  SkillsOutput,
  StatsOutput
} from "#lib/shared/api/orval-generated";
import type { ListEnchantmentsResponse } from "#lib/shared/api/orval-generated-zod";

export type Enchantments = z.infer<typeof ListEnchantmentsResponse>;

export class ProfileContext {
  #source: () => StatsOutput | null;

  constructor(source: () => StatsOutput | null = () => null) {
    this.#source = source;
  }

  get current() {
    return this.#source();
  }
}

export class AllStatsContext {
  #source: () => StatData[];

  constructor(source: () => StatData[] = () => []) {
    this.#source = source;
  }

  get current() {
    return this.#source();
  }
}

export class EnchantmentsContext {
  #source: () => Enchantments;

  constructor(source: () => Enchantments = () => []) {
    this.#source = source;
  }

  get current() {
    return this.#source();
  }
}

export class CombinedContext {
  #source: () => CombinedOutput | null;

  constructor(source: () => CombinedOutput | null = () => null) {
    this.#source = source;
  }

  get current() {
    return this.#source();
  }
}

export class PacksContext {
  #source: () => ResourcePackConfig[];

  constructor(source: () => ResourcePackConfig[] = () => []) {
    this.#source = source;
  }

  get packs() {
    return this.#source();
  }
}

export class MiscContext {
  #source: () => MiscOutput | null;

  constructor(source: () => MiscOutput | null = () => null) {
    this.#source = source;
  }

  get misc() {
    return this.#source();
  }
}

export class SkillsContext {
  #source: () => SkillsOutput | null;

  constructor(source: () => SkillsOutput | null = () => null) {
    this.#source = source;
  }

  get skills() {
    return this.#source();
  }
}

export const [getProfileContext, setProfileContext] = createContext<ProfileContext>();
export const [getAllStatsContext, setAllStatsContext] = createContext<AllStatsContext>();
export const [getEnchantmentsContext, setEnchantmentsContext] = createContext<EnchantmentsContext>();
export const [getCombinedContext, setCombinedContext] = createContext<CombinedContext>();
export const [getSkillsContext, setSkillsContext] = createContext<SkillsContext>();
export const [getMiscContext, setMiscContext] = createContext<MiscContext>();
export const [getMobileContext, setMobileContext] = createContext<IsMobile>();
export const [getHoverContext, setHoverContext] = createContext<IsHover>();
export const [getPacksContext, setPacksContext] = createContext<PacksContext>();
