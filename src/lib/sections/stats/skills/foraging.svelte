<script lang="ts">
  import { getSkillsContext } from "$ctx";
  import { Item } from "$lib/components/item";
  import { Chip, ScrollItems } from "$lib/components/misc";
  import { SectionSubtitle } from "$lib/components/sections";
  import { AdditionStat } from "$lib/components/stats";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { renderLore } from "$lib/shared/helper";
  import { animateObfuscatedText } from "$lib/shared/mc-text/obfuscated";
  import { cn } from "$lib/shared/utils";
  import { format } from "numerable";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  const data = $derived(getSkillsContext().skills);
  const foraging = $derived(data?.foraging);
  const foragingTools = $derived(foraging?.tools);
  const highestPriorityForagingTool = $derived(foragingTools?.highest_priority_tool);
</script>

<SectionSubtitle>Foraging</SectionSubtitle>

{#if foraging}
  <div class="space-y-0.5">
    {#if foraging.whispers}
      <AdditionStat text="Whispers" data={format((foraging.whispers.available ?? 0) + (foraging.whispers.spent ?? 0))} asterisk={true}>
        <ul>
          {#each Object.entries(foraging.whispers) as [type, amount], index (index)}
            {#if amount != null}
              <li>
                <AdditionStat text={type} data={format(amount ?? 0)} class="capitalize" />
              </li>
            {/if}
          {/each}
        </ul>
      </AdditionStat>
    {/if}
    {#if foraging.hinaChapter}
      <AdditionStat text="Hina's Chapters" data="{foraging.hinaChapter.tier}/{foraging.hinaChapter.maxTier}" maxed={foraging.hinaChapter.tier === foraging.hinaChapter.maxTier} />
    {/if}
    {#if foraging.fishFamily}
      <AdditionStat text="Fish Family" data="{foraging.fishFamily.collected}/{foraging.fishFamily.total}" maxed={(foraging.fishFamily.collected ?? 0) >= (foraging.fishFamily.total ?? 0)} />
    {/if}
  </div>

  <SectionSubtitle>Tree Gifts</SectionSubtitle>
  {#if foraging.treeGift}
    <ScrollItems>
      {#each Object.entries(foraging.treeGift) as [name, data], index (index)}
        {#if data != null}
          {@const hasMaxed = data.milestone === data.maxMilestone}
          {@const hasUnlocked = data.milestone}
          <Chip class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })} image={{ src: data.texture ?? "" }}>
            <div class={cn("flex flex-col")}>
              <div class="font-bold whitespace-nowrap">
                <span class={cn("capitalize", { "text-gold": hasMaxed })}>{name.replaceAll("_", " ").toLowerCase()}</span>
                <div class="text-sm">
                  <span class={cn({ "text-gold": hasMaxed })}>Level:</span>
                  <span class={cn({ "text-gold": hasMaxed })}>{format(data.milestone)}</span>
                </div>
              </div>
            </div>
          </Chip>
        {/if}
      {/each}
    </ScrollItems>
  {:else}
    <p class="space-x-0.5 leading-6">This player doesn't have any tree gifts.</p>
  {/if}

  <SectionSubtitle>Foraging Tools</SectionSubtitle>
  {#if foragingTools && foragingTools.tools && foragingTools.tools.length > 0}
    <Items>
      {#snippet text()}
        <div class="space-y-2">
          {#if highestPriorityForagingTool && highestPriorityForagingTool.display_name}
            <p class="space-x-0.5 leading-6 font-bold text-text/60 capitalize" {@attach animateObfuscatedText}>
              <span>Active Tool:</span>
              {@html renderLore(highestPriorityForagingTool.display_name)}
            </p>
          {/if}
        </div>
      {/snippet}
      {#each foragingTools.tools as tool, index (index)}
        <Item piece={tool} />
      {/each}
    </Items>
  {:else}
    <p class="space-x-0.5 leading-6">This player doesn't have any foraging tools.</p>
  {/if}

  <SectionSubtitle class="mt-5">Heart of the Forest</SectionSubtitle>
  <div class="space-y-0.5">
    {#if foraging.level?.level != null}
      <AdditionStat text="Tier" data={foraging.level.level.toString()} maxed={foraging.level.level === foraging.level.maxLevel} />
    {/if}
    {#if foraging.tokens}
      <AdditionStat text="Tokens Of The Forest" data={`${foraging.tokens.spent}/${foraging.tokens.total}`} maxed={foraging.tokens.spent === foraging.tokens.total} />
    {/if}
    {#if foraging.cotf}
      <AdditionStat text="Center Of The Forest" data={`${foraging.cotf.level}/${foraging.cotf.maxLevel}`} maxed={foraging.cotf.level === foraging.cotf.maxLevel} />
    {/if}
    {#if foraging.selectedAxeAbility}
      <AdditionStat text="Axe Ability" data={foraging.selectedAxeAbility} />
    {/if}
  </div>

  {#if foraging.hotf && foraging.hotf.length > 0}
    <div class="pt-5">
      <div class="@container relative mb-0 rounded-lg bg-background/30 p-5">
        <div class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
          {#each foraging.hotf as item, index (index)}
            {#if item.display_name}
              <div class="flex aspect-square items-center justify-center rounded-sm bg-text/4" in:fade|global={{ duration: 300, delay: 5 * (index + 1), easing: cubicOut }}>
                <Item piece={item} isInventory={true} />
              </div>
            {:else}
              <div class="aspect-square rounded-sm bg-text/4" in:fade|global={{ duration: 300, delay: 5 * (index + 1), easing: cubicOut }}></div>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  {/if}
{:else}
  <p class="space-x-0.5 leading-6">This player doesn't have anything related to foraging.</p>
{/if}
