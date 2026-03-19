<script lang="ts">
  import { getCombinedContext } from "$ctx";
  import { Chip, ScrollItems } from "$lib/components/misc";
  import { Section } from "$lib/components/sections";
  import { AdditionStat } from "$lib/components/stats";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { calculatePercentage } from "$lib/shared/helper";
  import { cn } from "$lib/shared/utils";
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import { Avatar, Button } from "bits-ui";

  let { order }: { order: number } = $props();

  const minions = $derived(getCombinedContext().current?.minions);

  const romanTiers = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const arabicTiers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
</script>

<Section id="Minions" {order}>
  {#if minions}
    <Items class="flex-col">
      {#snippet text()}
        <div>
          {#if minions.maxedTiers != null && minions.totalTiers != null}
            <AdditionStat text="Unique Minions" data="{minions.maxedTiers} / {minions.totalTiers} ({calculatePercentage(minions.maxedTiers, minions.totalTiers, 0)}%)" maxed={minions.maxedTiers === minions.totalTiers} />
          {/if}
          {#if minions.minionsSlots}
            <AdditionStat text="Minion Slots" data={minions.minionsSlots.current ?? 0} subData="({minions.minionsSlots.next} to next slot)" maxed={minions.maxedTiers === minions.totalTiers} />
            <AdditionStat text="Bonus Minion Slots" data="{minions.minionsSlots.bonusSlots} / 5" maxed={minions.minionsSlots.bonusSlots === 5} />
          {/if}
          {#if minions.maxedMinions != null && minions.totalMinions != null}
            <AdditionStat text="Maxed Minions" data="{minions.maxedMinions} / {minions.totalMinions}" maxed={minions.maxedMinions === minions.totalMinions} />
          {/if}
        </div>
      {/snippet}

      {#if minions.minions}
        {#each Object.entries(minions.minions) as [category, data], index (index)}
          <div class="flex items-center gap-1 text-base font-semibold uppercase">
            <h3 class="text-xl">{category}</h3>
            {#if data.maxedMinions === data.totalMinions}
              <span class="text-gold">Max!</span>
            {:else}
              <span class="text-text/80">({data.maxedMinions} / {data.totalMinions} max)</span>
            {/if}
          </div>

          <ScrollItems>
            {#each data.minions as minion, index (index)}
              {#if minion.tiers}
                {@const hasTier = minion.tiers[minion.tiers.length - 1]}
                {@const hasMaxed = hasTier === minion.maxTier}
                <Chip image={{ src: minion.texture ?? "" }} class={cn("h-fit w-fit", { "opacity-50": !hasTier })}>
                  <div class={cn("flex flex-col", { "text-maxed": hasMaxed })}>
                    <div class="font-bold whitespace-nowrap">
                      <span class={cn(hasMaxed ? "text-maxed" : "opacity-60")}>{minion.name}</span>
                      <span class={cn({ "text-gold": hasMaxed })}>{hasTier ? minion.tiers[minion.tiers.length - 1] : 0}</span>
                    </div>
                  </div>
                  {#snippet tooltip()}
                    <div class="flex gap-1">
                      {#each arabicTiers.slice(0, minion.maxTier) as tier, index (index)}
                        {#if minion.tiers}
                          {@const hasTier = minion.tiers.includes(tier)}
                          <span class={cn("text-sm font-medium", { "text-link": hasTier })}>{romanTiers[tier - 1]}</span>
                        {/if}
                      {/each}
                    </div>
                  {/snippet}
                </Chip>
              {/if}
            {/each}
          </ScrollItems>
        {/each}
      {/if}
    </Items>
  {/if}
</Section>
