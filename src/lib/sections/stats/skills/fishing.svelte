<script lang="ts">
  import { getSkillsContext } from "$ctx";
  import { Item } from "$lib/components/item";
  import { Chip, ScrollItems } from "$lib/components/misc";
  import { SectionSubtitle } from "$lib/components/sections";
  import { AdditionStat } from "$lib/components/stats";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { renderLore, titleCase } from "$lib/shared/helper";
  import { animateObfuscatedText } from "$lib/shared/mc-text/obfuscated";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import Image from "@lucide/svelte/icons/image";
  import { Avatar, Collapsible } from "bits-ui";
  import { format } from "numerable";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  const tiers = ["diamond", "gold", "silver", "bronze"] as const;
  type ColorSchema = Record<(typeof tiers)[number], { bg: string; text: string }>;

  const data = $derived(getSkillsContext().skills);
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
  {#if fishingTools && fishingTools.tools && fishingTools.tools.length > 0}
    <Items>
      {#snippet text()}
        <div class="space-y-2">
          {#if highestPriorityFishingTool && highestPriorityFishingTool.display_name}
            <p class="space-x-0.5 leading-6 font-bold text-text/60 capitalize" {@attach animateObfuscatedText}>
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

  {#if fishing.kills}
    {#if Object.entries(fishing.kills).find(([_, seaCreature]) => (seaCreature.amount ?? 0) > 0)}
      <Collapsible.Root>
        <Collapsible.Trigger class="group flex items-center gap-0.5 pt-4">
          <ChevronDown class="size-5 transition-all duration-300 ease-out group-data-[state=open]:-rotate-180" />
          <SectionSubtitle class="my-0">Sea Creatures</SectionSubtitle>
        </Collapsible.Trigger>
        <Collapsible.Content class="mt-4 flex flex-wrap gap-4">
          {@const seaCreatures = Object.entries(fishing.kills)}
          <ScrollItems>
            {#each seaCreatures as [_, seaCreature], index (index)}
              <div class="flex h-full max-h-56 flex-col rounded-lg bg-background/30 p-2 whitespace-nowrap" in:fade|global={{ duration: 300, delay: 25 * (index + 1), easing: cubicOut }} out:fade={{ duration: 300, delay: 5 * (seaCreatures.length - index), easing: cubicOut }}>
                <div class="flex h-12 items-center justify-center border-b-2 border-icon pb-2 text-center font-bold">
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
  {/if}

  {#if fishing.trophyFish != null && (fishing.trophyFish.totalCaught ?? 0) > 0}
    <Collapsible.Root>
      <Collapsible.Trigger class="group flex items-center gap-0.5 pt-4">
        <ChevronDown class="size-5 transition-all duration-300 ease-out group-data-[state=open]:-rotate-180" />
        <SectionSubtitle class="my-0">Trophy Fish</SectionSubtitle>
      </Collapsible.Trigger>
      <Collapsible.Content class="mt-4 space-y-4">
        <div class="space-y-0.5">
          {#if fishing.trophyFish}
            <AdditionStat text="Total Caught" data={format(fishing.trophyFish.totalCaught)} />
            {#if fishing.trophyFish.stage && fishing.trophyFish.stage.name}
              <AdditionStat text="Current Stage" data={fishing.trophyFish.stage.name} asterisk={true}>
                <div class="mb-4">
                  {#each fishing.trophyFish.stage.progress as tier, index (index)}
                    {#if tier.tier}
                      <AdditionStat text={titleCase(tier.tier)} data={`${tier.caught} / ${tier.total}`} />
                    {/if}
                  {/each}
                </div>
              </AdditionStat>
            {/if}
          {/if}
        </div>

        {#if fishing.trophyFish && fishing.trophyFish.trophyFish}
          {@const trophyFishes = Object.entries(fishing.trophyFish.trophyFish)}

          <ScrollItems>
            {@const colors = {
              bronze: {
                bg: "bg-[oklch(55.23%_0.1295_59.21)]",
                text: "text-[oklch(55.23%_0.1295_59.21)]/80"
              },
              silver: {
                bg: "bg-[oklch(77.02%_0.0014_286.37)]",
                text: "text-[oklch(77.02%_0.0014_286.37)]/80"
              },
              gold: {
                bg: "bg-[oklch(82.61%_0.1706_80.88)]",
                text: "text-[oklch(82.61%_0.1706_80.88)]/80"
              },
              diamond: {
                bg: "bg-[oklch(87.66%_0.1178_208.16)]",
                text: "text-[oklch(87.66%_0.1178_208.16)]/80"
              }
            } satisfies ColorSchema}
            {#each trophyFishes as [_, trophyFish], index (index)}
              {@const highestTier = tiers.find((tier) => (trophyFish[tier] ?? 0) > 0)}
              {@const highestTierColor = highestTier ? colors[highestTier].text : "text-text/60"}
              <Chip class="px-4 whitespace-nowrap" animationOptions={{ animate: true, amountOfItems: trophyFishes.length, index: index }} image={{ src: trophyFish.texture ?? "" }}>
                <div class="flex flex-col">
                  <div class="flex flex-col gap-0.5">
                    <h4 class="font-bold {highestTierColor}">{trophyFish.name} <span class="font-medium text-text/70">x{format((trophyFish.bronze ?? 0) + (trophyFish.silver ?? 0) + (trophyFish.gold ?? 0) + (trophyFish.diamond ?? 0))}</span></h4>
                  </div>
                  <div class="grid grid-cols-2 grid-rows-2">
                    <div class="flex items-center gap-1">
                      <div class="size-4 rounded-full {colors.bronze.bg}"></div>
                      {format(trophyFish.bronze)}
                    </div>
                    <div class="flex items-center gap-1">
                      <div class="size-4 rounded-full {colors.silver.bg}"></div>
                      {format(trophyFish.silver)}
                    </div>
                    <div class="flex items-center gap-1">
                      <div class="size-4 rounded-full {colors.gold.bg}"></div>
                      {format(trophyFish.gold)}
                    </div>
                    <div class="flex items-center gap-1">
                      <div class="size-4 rounded-full {colors.diamond.bg}"></div>
                      {format(trophyFish.diamond)}
                    </div>
                  </div>
                </div>
                {#snippet tooltip()}
                  {#if trophyFish.description}
                    <div class="contents" {@attach animateObfuscatedText}>
                      {@html renderLore(trophyFish.description)}
                    </div>
                  {/if}
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
