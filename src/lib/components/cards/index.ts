import type { ModelsStatsOutput } from "$src/lib/shared/api/orval-generated";
import { createContext } from "svelte";
import type { OptionGroup } from "./default/schema";
import { cardConfigSchema } from "./default/schema";

export type CardData = {
  profile?: ModelsStatsOutput;
};

export type CardPreset = {
  id: string;
  name: string;
  description: string;
  schema: readonly OptionGroup[];
};

export { default as DefaultCard } from "./default/Base.svelte";

export const defaultPreset: CardPreset = {
  id: "default",
  name: "Default",
  description: "The classic SkyCrypt profile card",
  schema: cardConfigSchema
};

export const cardPresets: CardPreset[] = [defaultPreset];

export const [getCardDataContext, setCardDataContext] = createContext<CardData>();
