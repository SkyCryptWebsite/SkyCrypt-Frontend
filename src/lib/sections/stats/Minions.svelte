<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import Chip from "$lib/components/Chip.svelte";
  import Error from "$lib/components/Error.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import Section from "$lib/components/Section.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { api, SectionName } from "$lib/shared/api";
  import { calculatePercentage } from "$lib/shared/helper";
  import { cn } from "$lib/shared/utils";
  import type { MinionsV2 } from "$types/statsv2";
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { createQuery } from "@tanstack/svelte-query";
  import { Avatar, Button } from "bits-ui";

  let { order }: { order: number } = $props();

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
  const profileUUID = $derived(profile.uuid);
  const profileId = $derived(profile.profile_id);

  const query = createQuery<MinionsV2>({
    queryKey: [SectionName.MINIONS, profileUUID, profileId],
    queryFn: () => api(fetch).getSection(SectionName.MINIONS, profileUUID, profileId)
  });

  const minions = $derived.by(() => {
    if ($query.isPending || $query.error || !$query.data) return;
    return $query.data;
  });

  const romanTiers = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const arabicTiers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
</script>

<Section id="Minions" {order}>
  {#if $query.isPending}
    <LoaderCircle class="text-icon animate-spin" />
  {/if}
  {#if $query.error}
    <Error />
  {/if}
  {#if $query.isSuccess && $query.data && minions}
    <Items class="flex-col">
      {#snippet text()}
        <div>
          <AdditionStat text="Unique Minions" data="{minions.maxedTiers} / {minions.totalTiers} ({calculatePercentage(minions.maxedTiers, minions.totalTiers, 0)}%)" maxed={minions.maxedTiers === minions.totalTiers} />
          <AdditionStat text="Minion Slots" data={minions.minionsSlots.current} subData="({minions.minionsSlots.next} to next slot)" />
          <AdditionStat text="Bonus Minion Slots" data="{minions.minionsSlots.bonusSlots} / 5" maxed={minions.minionsSlots.bonusSlots === 5} />
          <AdditionStat text="Maxed Minions" data="{minions.maxedMinions} / {minions.totalMinions}" maxed={minions.maxedMinions === minions.totalMinions} />
        </div>
      {/snippet}

      <Button.Root href="https://minionah.com" target="_blank" class="bg-background/30 flex h-fit w-fit max-w-fit items-center gap-2 rounded-lg p-2 transition-all duration-300 hover:scale-105">
        <Avatar.Root class="size-12 shrink-0">
          <Avatar.Image loading="lazy" src="/img/icons/minionah.png" alt="MinionAH" class="aspect-square size-12" />
          <Avatar.Fallback class="bg-background/10 flex size-12 items-center justify-center rounded-lg font-semibold">MA</Avatar.Fallback>
        </Avatar.Root>
        <div>
          <h6 class="text-text font-bold text-pretty">Looking for a place to trade minions?</h6>
          <span class="text-text/60 relative block w-fit text-left font-semibold">
            Check out <h5 class="text-link inline underline">MinionAH</h5>
            <ExternalLink class="text-link absolute top-0 -right-3 size-3" />
          </span>
        </div>
      </Button.Root>

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
            {@const hasTier = minion.tiers[minion.tiers.length - 1]}
            {@const hasMaxed = hasTier === minion.maxTier}
            <Chip image={{ src: minion.texture }} class={cn("h-fit w-fit", { "opacity-50": !hasTier })}>
              <div class={cn("flex flex-col", { "text-maxed": hasMaxed })}>
                <div class="font-bold whitespace-nowrap">
                  <span class={cn(hasMaxed ? "text-maxed" : "opacity-60")}>{minion.name}</span>
                  <span class={cn({ "text-gold": hasMaxed })}>{hasTier ? minion.tiers[minion.tiers.length - 1] : 0}</span>
                </div>
              </div>
              {#snippet tooltip()}
                <div class="flex gap-1">
                  {#each arabicTiers.slice(0, minion.maxTier) as tier, index (index)}
                    {@const hasTier = minion.tiers.includes(tier)}
                    <span class={cn("text-sm font-medium", { "text-link": hasTier })}>{romanTiers[tier - 1]}</span>
                  {/each}
                </div>
              {/snippet}
            </Chip>
          {/each}
        </ScrollItems>
      {/each}
    </Items>
  {/if}
</Section>
