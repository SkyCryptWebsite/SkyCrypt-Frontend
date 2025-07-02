<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import Chip from "$lib/components/Chip.svelte";
  import Error from "$lib/components/Error.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import Section from "$lib/components/Section.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { api, SectionName } from "$lib/shared/api";
  import { formatTime } from "$lib/shared/helper";
  import { cn } from "$lib/shared/utils";
  import type { CrimsonIsleV2 } from "$types/statsv2";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { createQuery } from "@tanstack/svelte-query";
  import { format } from "numerable";

  let { order }: { order: number } = $props();

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);

  const profileUUID = $derived(profile.uuid);
  const profileId = $derived(profile.profile_id);

  const query = createQuery<CrimsonIsleV2>({
    queryKey: [SectionName.CRIMSON_ISLE, profileUUID, profileId],
    queryFn: () => api(fetch).getSection(SectionName.CRIMSON_ISLE, profileUUID, profileId)
  });

  const isle = $derived.by(() => {
    if ($query.isPending || $query.error || !$query.data) return;
    return $query.data;
  });
</script>

<Section id="Crimson_Isle" {order}>
  {#if $query.isPending}
    <LoaderCircle class="text-icon animate-spin" />
  {/if}
  {#if $query.error}
    <Error />
  {/if}
  {#if $query.isSuccess && $query.data && isle}
    <Items class="flex-col">
      {#snippet text()}
        <div>
          <AdditionStat text="Selected Faction" class="capitalize" data={isle.factions.selectedFaction} />
          <AdditionStat text="Mage Reputation" data={format(isle.factions.magesReputation)} maxed={isle.factions.magesReputation >= 12000} />
          <AdditionStat text="Barbarian Reputation" data={format(isle.factions.barbariansReputation)} maxed={isle.factions.barbariansReputation >= 12000} />
        </div>
      {/snippet}

      {#if isle.kuudra.totalKills}
        <div class="flex flex-col gap-4">
          <SectionSubtitle class="my-0">Kuudra Completions</SectionSubtitle>
          <AdditionStat text="Total Completions" data={isle.kuudra.totalKills} />
        </div>

        <ScrollItems>
          {#each isle.kuudra.tiers as tier, index (index)}
            {@const hasUnlocked = tier.kills}
            <Chip image={{ src: tier.texture }} class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })}>
              <div class="flex flex-col font-bold whitespace-nowrap">
                <span class="opacity-60">{tier.name}</span>
                <div class="text-sm">
                  <span class="opacity-60">Kills:</span>
                  <span class="text-text">{format(tier.kills)}</span>
                </div>
              </div>
            </Chip>
          {/each}
        </ScrollItems>
      {/if}

      {#if isle.dojo.totalPoints}
        <div class="flex flex-col gap-4">
          <SectionSubtitle class="my-0">Dojo Completions</SectionSubtitle>
          <AdditionStat text="Total Points" data={format(isle.dojo.totalPoints)} maxed={isle.dojo.totalPoints >= 7000} />
        </div>

        <ScrollItems>
          {#each isle.dojo.challenges as challenge, index (index)}
            {@const hasMaxed = challenge.points >= 1000}
            {@const hasUnlocked = challenge.points}
            <Chip image={{ src: challenge.texture }} class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })}>
              <div class="flex flex-col font-bold whitespace-nowrap">
                <span class={cn(hasMaxed ? "text-maxed" : "opacity-60")}>{challenge.name}</span>
                <div class="text-sm">
                  <span class="opacity-60">Points:</span>
                  <span class="text-text">{format(challenge.points)}</span>
                </div>
                <div class="text-sm">
                  <span class="opacity-60">Rank:</span>
                  <span class="text-text">{challenge.rank}</span>
                </div>
                <div class="text-sm">
                  <span class="opacity-60">Time:</span>
                  <span class="text-text">{formatTime(challenge.time)}</span>
                </div>
              </div>
            </Chip>
          {/each}
        </ScrollItems>
      {/if}
    </Items>
  {/if}
</Section>
