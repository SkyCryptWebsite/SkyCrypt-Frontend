<script lang="ts">
  import { STAT_ALIASES, STATS_DATA } from "$lib/shared/constants/stats";
  import { cn } from "$lib/shared/utils";
  import type { ItemStats } from "$types/processed/profile/stats";
  import { format } from "numerable";

  type Props = {
    stats: ItemStats;
    title?: string;
    class?: string;
  };

  let { stats, title = "Bonus:", class: classNames }: Props = $props();

  const statsData = Object.entries(stats);
</script>

{#if statsData.length > 0}
  <p class={cn("text-text/60 my-4 space-x-0.5 leading-6 font-bold capitalize", classNames)}>
    <span>{title}</span>
    {#each statsData as [key, value], index (index)}
      {@const displayKey = STAT_ALIASES[key] !== undefined ? STAT_ALIASES[key] : key}
      {#if STATS_DATA[displayKey]}
        <span class={STATS_DATA[displayKey].color}>
          {format(value)}{STATS_DATA[displayKey].suffix}
          {STATS_DATA[displayKey].nameTiny}
        </span>
        {#if statsData.length - 1 !== index}
          // {" "}
        {/if}
      {:else}
        {console.warn(`Unknown stat: ${displayKey}`)}
      {/if}
    {/each}
  </p>
{/if}
