<script lang="ts">
  import { genericTooltipTether, getInternalState } from "$ctx";
  import type { ModelsStatsInfo } from "$lib/shared/api/orval-generated";
  import { STATS_DATA } from "$lib/shared/constants/stats";
  import { cn } from "$lib/shared/utils";
  import { Tooltip } from "bits-ui";
  import { format } from "numerable";

  type Props = {
    stat: string;
    statData: ModelsStatsInfo;
    class?: string | null | undefined;
  };

  let { stat, statData, class: className = undefined }: Props = $props();

  let open = $state(false);
  let iconRef = $state<HTMLElement | null>(null);

  const internalState = getInternalState();
</script>

<Tooltip.Trigger
  class={cn("my-0 flex items-center gap-1 text-sm font-bold whitespace-nowrap ", STATS_DATA[stat].color, className)}
  onpointerdown={() => (open = !open)}
  onclick={() => (internalState.content = tooltipContent)}
  tether={genericTooltipTether}
  payload={{
    class: "z-50 space-y-4 rounded-lg bg-background-grey p-4 text-sm",
    side: "top",
    align: "center",
    customAnchor: iconRef,
    children: tooltipContent
  }}>
  <div bind:this={iconRef} class="inline-block font-icomoon text-base">{STATS_DATA[stat].symbol}</div>
  <span class="capitalize">{stat.replace(/_/g, " ")}</span>
  <span class="text-text">
    {format(statData.total)}{#if STATS_DATA[stat]?.percent}%{/if}
  </span>
</Tooltip.Trigger>

{#snippet tooltipContent()}
  <div>
    <h3 class="font-bold text-text/60 capitalize">Base {stat.replaceAll("_", " ")}: <span class="text-text">{format(statData.base)}</span></h3>
    <p>Base value every player has at the beginning of their SkyBlock adventure!</p>
  </div>

  {#if statData.total}
    <div>
      <h3 class="font-bold text-text/60 capitalize">Bonus {stat.replaceAll("_", " ")}: <span class="text-text">{format(statData.total)}</span></h3>
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
