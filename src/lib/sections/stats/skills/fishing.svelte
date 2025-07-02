<script lang="ts">
  import { getDynamicCtx } from "$ctx/dynamic.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import Chip from "$lib/components/Chip.svelte";
  import Item from "$lib/components/Item.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { SectionName } from "$lib/shared/api";
  import { renderLore, titleCase } from "$lib/shared/helper";
  import type { SkillsV2 } from "$types/statsv2";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import Image from "@lucide/svelte/icons/image";
  import { Avatar, Collapsible } from "bits-ui";
  import { format } from "numerable";
  import { fade } from "svelte/transition";

  const ctx = getDynamicCtx<() => SkillsV2 | undefined>(SectionName.SKILLS);
  const data = $derived(ctx?.data?.());
  const fishing = $derived(data?.fishing);
  const fishingTools = $derived(fishing?.tools);
  const highestPriorityFishingTool = $derived(fishingTools?.highest_priority_tool);
</script>

<SectionSubtitle>Fishing</SectionSubtitle>
{#if fishing}
  <div class="space-y-0.5">
    <AdditionStat text="Items Fished" data={format(fishing.itemsFished)} />
    <AdditionStat text="Treasures Fished" data={format(fishing.treasure)} />
    <AdditionStat text="Large Treasures Fished" data={format(fishing.treasureLarge)} />
    <AdditionStat text="Sea Creatures Killed" data={format(fishing.seaCreaturesFished)} />
    {#if fishing.trophyFish}
      <AdditionStat text="Trophy Fish Fished" data={format(fishing.trophyFish.totalCaught)} />
    {/if}
  </div>

  <SectionSubtitle>Fishing Rods</SectionSubtitle>
  {#if fishingTools && fishingTools.tools.length > 0}
    <Items>
      {#snippet text()}
        <div class="space-y-2">
          {#if highestPriorityFishingTool && highestPriorityFishingTool.display_name}
            <p class="text-text/60 space-x-0.5 leading-6 font-bold capitalize">
              <span>Active Rod:</span>
              {@html renderLore(highestPriorityFishingTool.display_name)}
            </p>
          {/if}
        </div>
      {/snippet}
      {#each fishingTools.tools as tool, index (index)}
        <Item piece={tool} />
      {/each}
    </Items>
  {:else}
    <p class="space-x-0.5 leading-6">This player doesn't have any fishing tools.</p>
  {/if}

  {#if Object.entries(fishing.kills).find(([_, seaCreature]) => seaCreature.amount > 0)}
    <Collapsible.Root>
      <Collapsible.Trigger class="group flex items-center gap-0.5 pt-4">
        <ChevronDown class="size-5 transition-all duration-300 group-data-[state=open]:-rotate-180" />
        <SectionSubtitle class="my-0">Sea Creatures</SectionSubtitle>
      </Collapsible.Trigger>
      <Collapsible.Content class="mt-4 flex flex-wrap gap-4">
        {@const seaCreatures = Object.entries(fishing.kills)}
        <ScrollItems>
          {#each seaCreatures as [_, seaCreature], index (index)}
            <div class="bg-background/30 flex h-full max-h-56 flex-col rounded-lg p-2 whitespace-nowrap" in:fade|global={{ duration: 300, delay: 25 * (index + 1) }} out:fade={{ duration: 300, delay: 5 * (seaCreatures.length - index) }}>
              <div class="border-icon flex h-12 items-center justify-center border-b-2 pb-2 text-center font-bold">
                {seaCreature.name}
              </div>
              <div class="mt-2 flex h-full w-full flex-col items-center justify-center gap-4">
                <Avatar.Root class="flex items-center justify-center">
                  <Avatar.Image loading="lazy" src={seaCreature.texture} class="aspect-square size-24 object-contain" />
                  <Avatar.Fallback>
                    <Image class="size-24" />
                  </Avatar.Fallback>
                </Avatar.Root>
                <div class="text-center font-bold">
                  {seaCreature.amount} <span class="text-text/60">Kills</span>
                </div>
              </div>
            </div>
          {/each}
        </ScrollItems>
      </Collapsible.Content>
    </Collapsible.Root>
  {/if}

  {#if fishing.trophyFish != null && fishing.trophyFish.totalCaught > 0}
    <Collapsible.Root>
      <Collapsible.Trigger class="group flex items-center gap-0.5 pt-4">
        <ChevronDown class="size-5 transition-all duration-300 group-data-[state=open]:-rotate-180" />
        <SectionSubtitle class="my-0">Trophy Fish</SectionSubtitle>
      </Collapsible.Trigger>
      <Collapsible.Content class="mt-4 space-y-4">
        <div class="space-y-0.5">
          {#if fishing.trophyFish}
            <AdditionStat text="Total Caught" data={format(fishing.trophyFish.totalCaught)} />
            <AdditionStat text="Current Stage" data={fishing.trophyFish.stage.name} asterisk={true}>
              <div class="mb-4">
                {#each fishing.trophyFish.stage.progress as tier, index (index)}
                  <AdditionStat text={titleCase(tier.tier)} data={`${tier.caught} / ${tier.total}`} />
                {/each}
              </div>
            </AdditionStat>
          {/if}
        </div>

        {#if fishing.trophyFish}
          {@const trophyFishes = Object.entries(fishing.trophyFish.trophyFish)}

          <ScrollItems>
            {#each trophyFishes as [_, trophyFish], index (index)}
              <Chip class="px-4 whitespace-nowrap" animationOptions={{ animate: true, amountOfItems: trophyFishes.length, index: index }} image={{ src: trophyFish.texture }}>
                <div class="flex flex-col">
                  <div class="flex flex-col gap-0.5">
                    <h4 class="text-text/60 font-bold">{trophyFish.name} <span class="text-text/70 font-medium">x{format(trophyFish.bronze + trophyFish.silver + trophyFish.gold + trophyFish.diamond)}</span></h4>
                  </div>
                  <div class="grid grid-cols-2 grid-rows-2">
                    <div class="flex items-center gap-1">
                      <div class="size-4 rounded-full bg-[oklch(55.23%_0.1295_59.21)]"></div>
                      {format(trophyFish.bronze)}
                    </div>
                    <div class="flex items-center gap-1">
                      <div class="size-4 rounded-full bg-[oklch(77.02%_0.0014_286.37)]"></div>
                      {format(trophyFish.silver)}
                    </div>
                    <div class="flex items-center gap-1">
                      <div class="size-4 rounded-full bg-[oklch(82.61%_0.1706_80.88)]"></div>
                      {format(trophyFish.gold)}
                    </div>
                    <div class="flex items-center gap-1">
                      <div class="size-4 rounded-full bg-[oklch(87.66%_0.1178_208.16)]"></div>
                      {format(trophyFish.diamond)}
                    </div>
                  </div>
                </div>
                {#snippet tooltip()}
                  {@html renderLore(trophyFish.description)}
                {/snippet}
              </Chip>
            {/each}
          </ScrollItems>
        {/if}
      </Collapsible.Content>
    </Collapsible.Root>
  {/if}
{:else}
  <p class="space-x-0.5 leading-6">This player doesn't have anything related to fishing.</p>
{/if}
