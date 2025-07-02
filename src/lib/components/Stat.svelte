<script lang="ts">
  import type { IsHover } from "$lib/hooks/is-hover.svelte";
  import { STATS_DATA } from "$lib/shared/constants/stats";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { content } from "$lib/stores/internal";
  import { Tooltip } from "bits-ui";
  import { format } from "numerable";
  import { getContext } from "svelte";

  type Props = {
    stat: string;
    statData: {
      [string: string]: number;
      base: number;
    };
    class?: string | null | undefined;
  };

  let { stat, statData, class: className = undefined }: Props = $props();

  let open = $state(false);
  let iconRef = $state<HTMLElement | null>(null);

  const isHover = getContext<IsHover>("isHover");
</script>

<div>
  <Tooltip.Root bind:open>
    <Tooltip.Trigger class={cn(`my-0 flex items-center gap-1 text-sm font-bold whitespace-nowrap ${STATS_DATA[stat].color}`, className)} onpointerdown={() => (open = !open)} onclick={() => content.set(tooltipContent)}>
      <div bind:this={iconRef} class="font-icomoon inline-block text-base">{STATS_DATA[stat].symbol}</div>
      <span class="capitalize">{stat.replace(/_/g, " ")}</span>
      <span class="text-text">
        {format(statData.total)}{#if STATS_DATA[stat]?.percent}%{/if}
      </span>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      {#if isHover.current}
        <Tooltip.Content forceMount class="bg-background-grey z-50 space-y-4 rounded-lg p-4 text-sm" sideOffset={0} side="top" align="center" customAnchor={iconRef}>
          {#snippet child({ wrapperProps, props, open })}
            {#if open}
              <div {...wrapperProps}>
                <div {...props} transition:flyAndScale>
                  {@render tooltipContent()}
                  <Tooltip.Arrow />
                </div>
              </div>
            {/if}
          {/snippet}
        </Tooltip.Content>
      {/if}
    </Tooltip.Portal>
  </Tooltip.Root>
</div>

{#snippet tooltipContent()}
  <div>
    <h3 class="text-text/60 font-bold capitalize">Base {stat.replaceAll("_", " ")}: <span class="text-text">{format(statData.base)}</span></h3>
    <p>Base value every player has at the beginning of their SkyBlock adventure!</p>
  </div>

  {#if statData.total}
    <div>
      <h3 class="text-text/60 font-bold capitalize">Bonus {stat.replaceAll("_", " ")}: <span class="text-text">{format(statData.total)}</span></h3>
      <p>Bonus value obtained from:</p>

      <div class="flex flex-col">
        {#each Object.entries(statData) as [key, value], index (index)}
          {#if !["total", "base"].includes(key)}
            <div class="capitalize">- {key.replaceAll("_", " ")} +{format(value)}</div>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
{/snippet}
