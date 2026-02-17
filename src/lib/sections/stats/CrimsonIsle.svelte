<script lang="ts">
  import { getProfileContext } from "$ctx";
  import { Chip, ScrollItems } from "$lib/components/misc";
  import { Section, SectionSubtitle } from "$lib/components/sections";
  import { AdditionStat } from "$lib/components/stats";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { getCrimsonIsleSection } from "$lib/shared/api/skycrypt-api.remote";
  import { formatTime } from "$lib/shared/helper";
  import { cn } from "$lib/shared/utils";
  import { format } from "numerable";

  let { order }: { order: number } = $props();

  const profile = $derived(getProfileContext().current);

  const profileUUID = $derived(profile?.uuid);
  const profileId = $derived(profile?.profile_id);

  const isle = $derived(await getCrimsonIsleSection({ uuid: profileUUID!, profileId: profileId! }));
</script>

<Section id="Crimson_Isle" {order}>
  {#if isle}
    <Items class="flex-col">
      {#snippet text()}
        {#if isle.factions}
          <div>
            {#if isle.factions.selectedFaction}
              <AdditionStat text="Selected Faction" class="capitalize" data={isle.factions.selectedFaction} />
            {/if}
            {#if isle.factions.magesReputation != null}
              <AdditionStat text="Mage Reputation" data={format(isle.factions.magesReputation)} maxed={isle.factions.magesReputation >= 12000} />
            {/if}
            {#if isle.factions.barbariansReputation != null}
              <AdditionStat text="Barbarian Reputation" data={format(isle.factions.barbariansReputation)} maxed={isle.factions.barbariansReputation >= 12000} />
            {/if}
          </div>
        {/if}
      {/snippet}

      {#if isle.kuudra && isle.kuudra.totalKills}
        <div class="flex flex-col gap-4">
          <SectionSubtitle class="my-0">Kuudra Completions</SectionSubtitle>
          <AdditionStat text="Total Completions" data={isle.kuudra.totalKills} />
        </div>

        <ScrollItems>
          {#each isle.kuudra.tiers as tier, index (index)}
            {@const hasUnlocked = tier.kills}
            <Chip image={{ src: tier.texture ?? "" }} class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })}>
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

      {#if isle.dojo && isle.dojo.totalPoints}
        <div class="flex flex-col gap-4">
          <SectionSubtitle class="my-0">Dojo Completions</SectionSubtitle>
          <AdditionStat text="Total Points" data={format(isle.dojo.totalPoints)} maxed={isle.dojo.totalPoints >= 7000} />
        </div>

        <ScrollItems>
          {#each isle.dojo.challenges as challenge, index (index)}
            {@const hasMaxed = (challenge.points ?? 0) >= 1000}
            {@const hasUnlocked = challenge.points}
            <Chip image={{ src: challenge.texture ?? "" }} class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })}>
              <div class="flex flex-col font-bold whitespace-nowrap">
                <span class={cn(hasMaxed ? "text-maxed" : "opacity-60")}>{challenge.name}</span>
                {#if challenge.points != null}
                  <div class="text-sm">
                    <span class="opacity-60">Points:</span>
                    <span class="text-text">{format(challenge.points)}</span>
                  </div>
                {/if}
                {#if challenge.rank}
                  <div class="text-sm">
                    <span class="opacity-60">Rank:</span>
                    <span class="text-text">{challenge.rank}</span>
                  </div>
                {/if}
                {#if challenge.time}
                  <div class="text-sm">
                    <span class="opacity-60">Time:</span>
                    <span class="text-text">{formatTime(challenge.time)}</span>
                  </div>
                {/if}
              </div>
            </Chip>
          {/each}
        </ScrollItems>
      {/if}
    </Items>
  {/if}
</Section>
