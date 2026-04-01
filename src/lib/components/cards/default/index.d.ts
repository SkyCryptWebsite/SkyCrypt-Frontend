import type { CardData } from "$src/lib/components/cards";
import type { ModelsDungeonsOutput, ModelsNetworth } from "$src/lib/shared/api/orval-generated";
import type { DefaultCardSettings } from "./schema";

export type { DefaultCardSettings, OptionDef, OptionGroup } from "./schema";

export type DefaultCardProps = CardData & {
  networth?: ModelsNetworth;
  dungeons?: ModelsDungeonsOutput;
  settings?: DefaultCardSettings;
};

export type DefaultCardData = Omit<DefaultCardProps, "profile">;
