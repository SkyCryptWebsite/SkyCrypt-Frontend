<script lang="ts">
  import { getSkillsContext } from "$ctx";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import Chip from "$lib/components/Chip.svelte";
  import Item from "$lib/components/Item.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import Garden from "$lib/sections/stats/farming/garden.svelte";
  import { formatNumber, renderLore } from "$lib/shared/helper";
  import { animateObfuscatedText } from "$lib/shared/mc-text/obfuscated";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import { Collapsible } from "bits-ui";

  const data = $derived(getSkillsContext().skills);
  const farming = $derived(data?.farming);
  const farmingTools = $derived(farming?.tools);
  const highestPriorityFarmingTool = $derived(farmingTools?.highest_priority_tool);
</script>

<SectionSubtitle>Farming</SectionSubtitle>
{#if farming}
  <div class="space-y-5">
    <div class="space-y-0.5">
      {#if farming.pelts}
        <AdditionStat text="Pelts" data={farming.pelts.toString()} />
      {/if}
      {#if farming.contestsAttended}
        <AdditionStat text="Contests Attended" data={farming.contestsAttended.toString()} />
      {/if}
      {#if farming.uniqueGolds}
        <AdditionStat text="Unique Golds" data={farming.uniqueGolds.toString()} maxed={farming.uniqueGolds === 10} />
      {/if}
    </div>

    {#if farming.medals}
      <div class="space-y-0.5">
        {#each Object.entries(farming.medals) as [medal, medalData], index (index)}
          {#if medalData.total}
            <AdditionStat text={medal} data={medalData.total?.toString()} asterisk={true}>
              {#each Object.entries(medalData) as [key, value], index (index)}
                <AdditionStat text={key} data={value.toString()} class="capitalize" />
              {/each}
            </AdditionStat>
          {/if}
        {/each}
      </div>
    {/if}
  </div>

  <SectionSubtitle>Farming Tools</SectionSubtitle>
  {#if farmingTools && farmingTools.tools && farmingTools.tools.length > 0}
    <Items>
      {#snippet text()}
        <div class="space-y-2">
          {#if highestPriorityFarmingTool && highestPriorityFarmingTool.display_name}
            <p class="space-x-0.5 leading-6 font-bold text-text/60 capitalize" {@attach animateObfuscatedText}>
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

  {#if farming.contests}
    {#if Object.entries(farming.contests).find(([_, cropData]) => (cropData.amount ?? 0) > 0)}
      <Collapsible.Root class="mt-5">
        <Collapsible.Trigger class="group flex items-center gap-0.5">
          <ChevronDown class="size-5 transition-all duration-300 ease-out group-data-[state=open]:-rotate-180" />
          <SectionSubtitle class="my-0">Farming Crops</SectionSubtitle>
        </Collapsible.Trigger>
        <Collapsible.Content class="mt-4 flex flex-wrap gap-4">
          {@const crops = Object.entries(farming.contests)}
          <ScrollItems>
            {#each crops as [_, cropData], index (index)}
              <Chip image={{ src: cropData.texture ?? "" }} animationOptions={{ animate: true, amountOfItems: crops.length, index: index }}>
                <div class="flex flex-col gap-0.5 whitespace-nowrap">
                  <h4 class="text-lg font-semibold data-[maxed=true]:text-maxed" data-maxed={cropData.maxed}>{cropData.name}</h4>
                  {#if cropData.collected != null}
                    <AdditionStat text="Personal Best" data={formatNumber(cropData.collected)} />
                  {/if}
                  {#if cropData.amount != null}
                    <AdditionStat text="Contests" data={cropData.amount.toString()} />
                  {/if}
                </div>
              </Chip>
            {/each}
          </ScrollItems>
        </Collapsible.Content>
      </Collapsible.Root>
    {/if}
  {/if}
{:else}
  <p class="space-x-0.5 leading-6">This player doesn't have anything related to farming.</p>
{/if}

<Garden />
