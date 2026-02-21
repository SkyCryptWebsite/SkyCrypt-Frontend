import type { ModelsStrippedItem } from "$lib/shared/api/orval-generated";
import { Tooltip, type TooltipContentPropsWithoutHTML } from "bits-ui";
import type { IsInViewport } from "runed";
import type { ClassValue } from "svelte/elements";

type GenericTooltipPayload = TooltipContentPropsWithoutHTML & {
  class: ClassValue | undefined | null;
  tooltipContent?: string;
  showTooltip?: boolean;
  showArrow?: boolean;
};

const itemTooltipTether = Tooltip.createTether<{
  skyblockItem?: ModelsStrippedItem;
  inViewport?: IsInViewport;
}>();

const genericTooltipTether = Tooltip.createTether<GenericTooltipPayload>();

if (!itemTooltipTether || !genericTooltipTether) throw new Error("Failed to create tooltip tether");

export { genericTooltipTether, itemTooltipTether };
