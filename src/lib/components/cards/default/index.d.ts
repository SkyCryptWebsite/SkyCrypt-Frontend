import type { CardData } from "$src/lib/components/cards";
import type { DungeonsOutput, Networth } from "$src/lib/shared/api/orval-generated";
import type { DefaultCardSettings } from "./schema";

export type { DefaultCardSettings, OptionDef, OptionGroup } from "./schema";

export type DefaultCardProps = CardData & {
  networth?: Networth;
  dungeons?: DungeonsOutput;
  settings?: DefaultCardSettings;
};

export type DefaultCardData = Omit<DefaultCardProps, "profile">;
