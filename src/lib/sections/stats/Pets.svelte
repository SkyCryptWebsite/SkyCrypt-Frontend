<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import Bonus from "$lib/components/Bonus.svelte";
  import Error from "$lib/components/Error.svelte";
  import Item from "$lib/components/Item.svelte";
  import Section from "$lib/components/Section.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { api, SectionName } from "$lib/shared/api";
  import { formatNumber, getRarityClass, renderLore, uniqBy } from "$lib/shared/helper";
  import { cn } from "$lib/shared/utils";
  import type { PetsV2 } from "$types/statsv2";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { createQuery } from "@tanstack/svelte-query";
  import { Collapsible } from "bits-ui";

  let { order }: { order: number } = $props();

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
  const profileUUID = $derived(profile.uuid);
  const profileId = $derived(profile.profile_id);

  const query = createQuery<PetsV2>({
    queryKey: [SectionName.PETS, profileUUID, profileId],
    queryFn: () => api(fetch).getSection(SectionName.PETS, profileUUID, profileId)
  });

  const pets = $derived.by(() => {
    if ($query.isPending || $query.error || !$query.data) return;
    return $query.data;
  });

  const activePet = $derived(pets?.pets.find((pet) => pet.active === true));
  const uniquePets = $derived(uniqBy(pets?.pets ?? [], "type"));
  const otherPets = $derived(pets?.pets.filter((pet) => !uniquePets.includes(pet)));
</script>

<Section id="Pets" {order}>
  {#if $query.isPending}
    <LoaderCircle class="text-icon animate-spin" />
  {/if}
  {#if $query.error}
    <Error />
  {/if}
  {#if $query.isSuccess && $query.data && pets}
    {#if pets.pets?.length}
      <Items>
        {#snippet text()}
          <div>
            <AdditionStat text="Unique Pets" data={`${pets.amount} / ${pets.total}`} maxed={pets.amount === pets.total} />
            <AdditionStat text="Unique Pet Skins" data={`${pets.amountSkins} / ${pets.totalSkins}`} maxed={pets.amountSkins === pets.totalSkins} />
            {#if pets.petScore != null}
              <AdditionStat text="Pet Score" data={`${pets.petScore.amount} (+${pets.petScore.stats.magic_find} MF) `} asterisk={true}>
                <div class="max-w-xs space-y-6 font-bold">
                  <h3 class="text-text/85">Pet score is calculated based on how many unique pets you have and the rarity of these pets.</h3>
                  <h3 class="text-text/85">You gain an additional score for each max level pet you have!</h3>
                  <div class="flex flex-col">
                    {#each pets.petScore.reward as { score, bonus, unlocked }, index (index)}
                      <div>
                        {score} Score: <span style="color: var(--§b)">+{bonus} Magic Find</span>
                        {#if unlocked}
                          <span style="color: var(--§5);"> «</span>
                        {/if}
                      </div>
                    {/each}
                  </div>
                </div>
              </AdditionStat>
            {/if}
            <AdditionStat text="Total Candies Used" data={pets.totalCandyUsed} maxed={pets.totalCandyUsed === 0} />
            <AdditionStat text="Total Pet XP" data={formatNumber(pets.totalPetExp)} />
          </div>
        {/snippet}
        <div class="mb-4">
          {#if activePet != null}
            <SectionSubtitle class="mt-2">Active Pet</SectionSubtitle>
            <Items>
              <div>
                <div class="flex items-center">
                  <Item piece={activePet} />
                  <div class="ml-4 flex flex-col justify-center">
                    <h4 class={cn(getRarityClass(activePet.rarity ?? "common", "text"), "text-xl font-bold capitalize")}>{(activePet.rarity ?? "common").toLowerCase()} {@html renderLore(activePet.display_name.toLowerCase())}</h4>
                    <h4 class="text-text text-xl font-medium capitalize">Level {activePet.level}</h4>
                  </div>
                </div>
                {#if activePet.stats}
                  <Bonus stats={activePet.stats} class="my-2" />
                {/if}
              </div>
            </Items>

            {#if uniquePets.length > 0 && uniquePets.find((pet) => !pet.active)}
              <SectionSubtitle class="mt-0">Other Pets</SectionSubtitle>
              <Items>
                {#each uniquePets as pet, index (index)}
                  {#if !pet.active}
                    <div>
                      <Item piece={pet} />
                      <p class="mt-2 text-center font-semibold">LVL {pet.level}</p>
                    </div>
                  {/if}
                {/each}
              </Items>
            {/if}
          {:else}
            <Items>
              {#each uniquePets as pet, index (index)}
                {#if !pet.active}
                  <div>
                    <Item piece={pet} />
                    <p class="mt-2 text-center font-semibold">LVL {pet.level}</p>
                  </div>
                {/if}
              {/each}
            </Items>
          {/if}

          {#if otherPets && otherPets.length > 0}
            <Collapsible.Root>
              <Collapsible.Trigger class="group flex items-center gap-0.5 pt-1.5">
                <ChevronDown class="size-5 transition-all duration-300 group-data-[state=open]:-rotate-180" />
                <SectionSubtitle class="my-0">Show More Pets</SectionSubtitle>
              </Collapsible.Trigger>
              <Collapsible.Content class="mt-4 flex flex-wrap gap-4">
                <Items>
                  {#each otherPets as pet, index (index)}
                    <div>
                      <Item piece={pet} />
                      <p class="mt-2 text-center font-semibold">LVL {pet.level}</p>
                    </div>
                  {/each}
                </Items>
              </Collapsible.Content>
            </Collapsible.Root>
          {/if}

          {#if pets.missing.length > 0}
            <Collapsible.Root>
              <Collapsible.Trigger class="group flex items-center gap-0.5 pt-5">
                <ChevronDown class="size-5 transition-all duration-300 group-data-[state=open]:-rotate-180" />
                <SectionSubtitle class="my-0">Missing Pets</SectionSubtitle>
              </Collapsible.Trigger>
              <Collapsible.Content class="mt-4 flex flex-wrap gap-4">
                <Items>
                  {#each pets.missing as pet, index (index)}
                    <div class="grayscale-[80%] hover:grayscale-0">
                      <Item piece={pet} />
                    </div>
                  {/each}
                </Items>
              </Collapsible.Content>
            </Collapsible.Root>
          {/if}
        </div>
      </Items>
    {:else}
      <Items>
        <p class="space-x-0.5 leading-6">{profile.username} doesn't have any pets</p>
      </Items>
    {/if}
  {/if}
</Section>
