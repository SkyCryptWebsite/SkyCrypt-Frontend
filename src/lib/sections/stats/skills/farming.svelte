<script lang="ts">
  import { getDynamicCtx } from "$ctx/dynamic.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import Chip from "$lib/components/Chip.svelte";
  import Item from "$lib/components/Item.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import Garden from "$lib/sections/stats/farming/garden.svelte";
  import { SectionName } from "$lib/shared/api";
  import { formatNumber, renderLore } from "$lib/shared/helper";
  import type { SkillsV2 } from "$types/statsv2";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import { Collapsible } from "bits-ui";

  const ctx = getDynamicCtx<() => SkillsV2 | undefined>(SectionName.SKILLS);
  const data = $derived(ctx?.data?.());
  const farming = $derived(data?.farming);
  const farmingTools = $derived(farming?.tools);
  const highestPriorityFarmingTool = $derived(farmingTools?.highest_priority_tool);
</script>

<SectionSubtitle>Farming</SectionSubtitle>
{#if farming}
  <div class="space-y-5">
    <div class="space-y-0.5">
      <AdditionStat text="Farming Weight" data={formatNumber(farming.weight.totalWeight)} asterisk={true}>
        <div class="space-y-5">
          <div>
            <h4 class="font-semibold text-white">Farming Weight</h4>
            <p class="text-text/50 text-sm italic">Weight calculations by <a href="https://elitebot.dev/" target="_blank" class="text-icon underline">Elite</a></p>
          </div>
          <div>
            {#each Object.entries(farming.weight.bonusSources) as [key, value], index (index)}
              <AdditionStat text={key} data={formatNumber(value)} class="capitalize" />
            {/each}
          </div>
          <div>
            {#each farming.weight.crops as crop, index (index)}
              <AdditionStat text={crop.name.toLowerCase().replace("_", " ")} data={formatNumber(crop.amount)} class="capitalize" />
            {/each}
          </div>
        </div>
      </AdditionStat>
      <AdditionStat text="Pelts" data={farming.pelts.toString()} />
      <AdditionStat text="Contests Attended" data={farming.contestsAttended.toString()} />
      <AdditionStat text="Unique Golds" data={farming.uniqueGolds.toString()} maxed={farming.uniqueGolds === 10} />
    </div>

    <div class="space-y-0.5">
      {#each Object.entries(farming.medals) as [medal, medalData], index (index)}
        <AdditionStat text={medal} data={medalData.total.toString()} asterisk={true}>
          {#each Object.entries(medalData) as [key, value], index (index)}
            <AdditionStat text={key} data={value.toString()} class="capitalize" />
          {/each}
        </AdditionStat>
      {/each}
    </div>
  </div>

  <SectionSubtitle>Farming Tools</SectionSubtitle>
  {#if farmingTools && farmingTools.tools.length > 0}
    <Items>
      {#snippet text()}
        <div class="space-y-2">
          {#if highestPriorityFarmingTool && highestPriorityFarmingTool.display_name}
            <p class="text-text/60 space-x-0.5 leading-6 font-bold capitalize">
              <span>Active Tool:</span>
              {@html renderLore(highestPriorityFarmingTool.display_name)}
            </p>
          {/if}
        </div>
      {/snippet}
      {#each farmingTools.tools as tool, index (index)}
        <Item piece={tool} />
      {/each}
    </Items>
  {:else}
    <p class="space-x-0.5 leading-6">This player doesn't have any farming tools.</p>
  {/if}

  {#if Object.entries(farming.contests).find(([_, cropData]) => cropData.amount > 0)}
    <Collapsible.Root class="mt-5">
      <Collapsible.Trigger class="group flex items-center gap-0.5">
        <ChevronDown class="size-5 transition-all duration-300 group-data-[state=open]:-rotate-180" />
        <SectionSubtitle class="my-0">Farming Crops</SectionSubtitle>
      </Collapsible.Trigger>
      <Collapsible.Content class="mt-4 flex flex-wrap gap-4">
        {@const crops = Object.entries(farming.contests)}
        <ScrollItems>
          {#each crops as [_, cropData], index (index)}
            <Chip image={{ src: cropData.texture }} animationOptions={{ animate: true, amountOfItems: crops.length, index: index }}>
              <div class="flex flex-col gap-0.5 whitespace-nowrap">
                <h4 class="text-lg font-semibold">{cropData.name}</h4>
                <AdditionStat text="Personal Best" data={formatNumber(cropData.collected)} />
                <AdditionStat text="Contests" data={cropData.amount.toString()} />
              </div>
            </Chip>
          {/each}
        </ScrollItems>
      </Collapsible.Content>
    </Collapsible.Root>
  {/if}
{:else}
  <p class="space-x-0.5 leading-6">This player doesn't have anything related to farming.</p>
{/if}

<Garden />
