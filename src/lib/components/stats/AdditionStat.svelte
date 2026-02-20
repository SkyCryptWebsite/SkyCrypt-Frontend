<script lang="ts">
  import { genericTooltipTether, getInternalState } from "$ctx";
  import { RARITY_COLORS } from "$lib/shared/constants/rarities";
  import { cn } from "$lib/shared/utils";
  import { Tooltip } from "bits-ui";
  import { type Snippet } from "svelte";

  type Props = {
    text: string;
    data: string | number;
    subData?: string | undefined;
    asterisk?: boolean;
    maxed?: boolean;
    dataMaxed?: boolean;
    textRarityColor?: string | undefined;
    dataRarityColor?: string | undefined;
    subDataRarityColor?: string | undefined;
    class?: string | null | undefined;
    children?: Snippet;
  };

  let { text, data, subData = undefined, asterisk = false, maxed = false, dataMaxed = false, textRarityColor = undefined, dataRarityColor = undefined, subDataRarityColor = undefined, class: className = undefined, children }: Props = $props();

  let asteriskRef = $state<HTMLElement | null>(null);

  const internalState = getInternalState();
</script>

<Tooltip.Trigger
  class={cn(`my-0 flex items-center gap-1 font-bold text-text/60 data-[is-tooltip=false]:cursor-default`, { "text-maxed": maxed }, className)}
  data-is-tooltip={asterisk}
  onclick={() => (internalState.content = children)}
  tether={genericTooltipTether}
  payload={{
    class: "z-50 rounded-lg bg-background-grey p-4",
    sideOffset: 0,
    side: "top",
    align: "center",
    customAnchor: asteriskRef,
    showTooltip: asterisk,
    children
  }}>
  {#snippet child({ props })}
    <button {...props}>
      <div class={!asterisk ? cn("my-0 flex items-center gap-1 font-bold text-text/60 data-[is-tooltip=false]:cursor-default", { "text-maxed": maxed }, className) : "contents"}>
        <div style={textRarityColor ? `color: var(--§${RARITY_COLORS[textRarityColor]})` : ""} class="capitalize">
          {text}:
        </div>

        <span class={cn("-mr-0.5", maxed || dataMaxed ? "text-gold" : "text-text")}>
          <span style={dataRarityColor ? `color: var(--§${RARITY_COLORS[dataRarityColor]})` : ""}>
            {data}
          </span>

          {#if subData}
            <span class="text-text/80" style={subDataRarityColor ? `color: var(--§${RARITY_COLORS[subDataRarityColor]})` : ""}> {subData}</span>
          {/if}
        </span>

        {#if asterisk}
          <span bind:this={asteriskRef}> * </span>
        {/if}
      </div>
    </button>
  {/snippet}
</Tooltip.Trigger>
