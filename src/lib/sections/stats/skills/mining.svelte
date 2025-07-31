<script lang="ts">
  import { getDynamicCtx } from "$ctx/dynamic.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import Chip from "$lib/components/Chip.svelte";
  import Item from "$lib/components/Item.svelte";
  import Notice from "$lib/components/Notice.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { SectionName } from "$lib/shared/api";
  import { renderLore } from "$lib/shared/helper";
  import { cn } from "$lib/shared/utils";
  import type { SkillsV2 } from "$types/statsv2";
  import { tz } from "@date-fns/tz";
  import { formatDate, formatDistanceToNowStrict } from "date-fns";
  import { format } from "numerable";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  const ctx = getDynamicCtx<() => SkillsV2 | undefined>(SectionName.SKILLS);
  const data = $derived(ctx?.data?.());
  const mining = $derived(data?.mining);
  const miningTools = $derived(mining?.tools);
  const highestPriorityMiningTool = $derived(miningTools?.highest_priority_tool);
</script>

<SectionSubtitle>Mining Tools</SectionSubtitle>
{#if mining}
  {#if miningTools && miningTools.tools.length > 0}
    <Items>
      {#snippet text()}
        <div class="space-y-2">
          {#if highestPriorityMiningTool && highestPriorityMiningTool.display_name}
            <p class="text-text/60 space-x-0.5 leading-6 font-bold capitalize">
              <span>Active Tool:</span>
              {@html renderLore(highestPriorityMiningTool.display_name)}
            </p>
          {/if}
        </div>
      {/snippet}
      {#each miningTools.tools as tool, index (index)}
        <Item piece={tool} />
      {/each}
    </Items>
  {:else}
    <p class="space-x-0.5 leading-6">This player doesn't have any mining tools.</p>
  {/if}

  <SectionSubtitle class="mt-5">Dwarven Mines & Crystal Hollows</SectionSubtitle>
  <div class="space-y-0.5">
    <AdditionStat text="Commissions Milestone" data={mining.commissions.milestone.toString()} maxed={mining.commissions.milestone === 6} />
    <AdditionStat text="Commissions" data={mining.commissions.completions.toString()} asterisk={true}>Commissions from achievements across profiles</AdditionStat>
    <AdditionStat text="Crystal Hollows Pass" data={mining.crystalHollows.crystalHollowsLastAccess > Date.now() - 5 * 60 * 60 * 1000 ? "Purchased" : "Expired"} asterisk={true}>
      {@const passActive = mining.crystalHollows.crystalHollowsLastAccess > Date.now() - 5 * 60 * 60 * 1000}
      <h3 class="text-text/85 font-bold">
        Last purchased:
        <span class="text-text">
          {#if passActive}
            {formatDistanceToNowStrict(mining.crystalHollows.crystalHollowsLastAccess, {
              addSuffix: true,
              in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
            })}
          {:else}
            {formatDate(mining.crystalHollows.crystalHollowsLastAccess, "dd MMMM yyyy 'at' HH:mm", { in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone) })}
            ({formatDistanceToNowStrict(mining.crystalHollows.crystalHollowsLastAccess, {
              addSuffix: true,
              in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
            })})
          {/if}
        </span>
      </h3>
    </AdditionStat>
    <AdditionStat text="Crystal Nucleus" data={`Completed ${mining.crystalHollows.nucleusRuns} ${mining.crystalHollows.nucleusRuns > 1 ? "times" : "time"}`} asterisk={true}>
      {@const placableCrystals = ["jade", "amber", "amethyst", "sapphire", "topaz"]}
      <h3 class="text-text/85 text-sm font-bold">Crystals:</h3>
      <ul class="mt-0.5 space-y-0.5 text-sm font-bold">
        {#each Object.entries(mining.crystalHollows.progress.crystals).filter(([crystalName, _crystalStatus]) => placableCrystals.includes(crystalName)) as [crystalName, crystalStatus], index (index)}
          <li class="flex">
            <span class="text-text/85 flex-1 capitalize">
              - {crystalName}:
              <span class={cn("capitalize", crystalStatus === "PLACED" ? "text-minecraft-e" : crystalStatus === "FOUND" ? "text-minecraft-a" : "text-minecraft-c")}>
                {crystalStatus.replace("_", " ").toLowerCase()}
              </span>
            </span>
          </li>
        {/each}
      </ul>

      <h3 class="text-text/85 mt-5 text-sm font-bold">Other Crystals:</h3>
      <ul class="mt-0.5 space-y-0.5 text-sm font-bold">
        {#each Object.entries(mining.crystalHollows.progress.crystals).filter(([crystalName, _crystalStatus]) => !placableCrystals.includes(crystalName)) as [crystalName, crystalStatus], index (index)}
          <li class="flex">
            <span class="text-text/85 flex-1 capitalize">
              - {crystalName}:
              <span class={cn("capitalize", crystalStatus === "FOUND" ? "text-minecraft-a" : "text-minecraft-c")}>
                {crystalStatus.replace("_", " ").toLowerCase()}
              </span>
            </span>
          </li>
        {/each}
      </ul>

      <h3 class="text-text/85 mt-5 text-sm font-bold">Precursor parts delivered:</h3>
      <ul class="mt-0.5 space-y-0.5 text-sm font-bold">
        {#each Object.entries(mining.crystalHollows.progress.parts) as [partName, partStatus], index (index)}
          {@const delivered = partStatus === "DELIVERED"}
          <li class={cn("capitalize", delivered ? "text-minecraft-a" : "text-minecraft-c")}>
            {delivered ? "✔" : "✖"}
            {#if partName.startsWith("FTX")}
              {partName.replace("_", " ")}
            {:else}
              {partName.replace("_", " ").toLowerCase()}
            {/if}
          </li>
        {/each}
      </ul>
    </AdditionStat>
  </div>

  <SectionSubtitle class="mt-5">Heart of the Mountain</SectionSubtitle>
  <div class="space-y-0.5">
    <AdditionStat text="Tier" data={mining.level.level.toString()} maxed={mining.level.level === mining.level.maxLevel} />
    <AdditionStat text="Token Of The Mountain" data={`${mining.tokens.spent}/${mining.tokens.total}`} />
    <AdditionStat text="Peak Of The Mountain" data={`${mining.peak_of_the_mountain.level}/${mining.peak_of_the_mountain.maxLevel}`} maxed={mining.peak_of_the_mountain.level === mining.peak_of_the_mountain.maxLevel} />
    {#each Object.entries(mining.powder) as [key, value], index (index)}
      <AdditionStat text={`${key} Powder`} data={format(value.available + value.spent)} asterisk={true}>
        <ul>
          {#each Object.entries(value) as [type, amount], index (index)}
            <li>
              <AdditionStat text={type} data={format(amount)} class="capitalize" />
            </li>
          {/each}
        </ul>
      </AdditionStat>
    {/each}
    <AdditionStat text="Pickaxe Ability" data={mining.selectedPickaxeAbility} />
  </div>

  {#if mining.hotm.length > 0}
    <div class="pt-5">
      <Notice type="warning" title="Heart of the Mountain" class="mb-5">
        <p class="text-text/80">Unfortunately, Hypixel broke the Heart of the Mountain API after the Foraging update.<br />So we are unable to display the Heart of the Mountain data, because it simply doesn't exist anymore.</p>
        <p class="text-text/80">We will add this back as soon as Hypixel fixes it.</p>
      </Notice>
      <div class="bg-background/30 @container relative mb-0 rounded-lg p-5">
        <div class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
          {#each mining.hotm as item, index (index)}
            {#if item.display_name}
              <div class="bg-text/[0.04] flex aspect-square items-center justify-center rounded-sm" in:fade|global={{ duration: 300, delay: 5 * (index + 1), easing: cubicOut }}>
                <Item piece={item} isInventory={true} />
              </div>
            {:else}
              <div class="bg-text/[0.04] aspect-square rounded-sm" in:fade|global={{ duration: 300, delay: 5 * (index + 1), easing: cubicOut }}></div>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  {/if}

  <SectionSubtitle class="mt-5">Glacite Tunnels</SectionSubtitle>
  <div class="space-y-0.5">
    <AdditionStat text="Fossil Dust" data={mining.glaciteTunnels.fossilDust.toString()} />
    <AdditionStat text="Mineshafts Entered" data={mining.glaciteTunnels.mineshaftsEntered.toString()} />
    <Items class="flex-col" subtitle="Fossils">
      <AdditionStat text="Fossils Found" data={mining.glaciteTunnels.fossils.found} maxed={mining.glaciteTunnels.fossils.found === mining.glaciteTunnels.fossils.max} />
      <ScrollItems>
        {#each mining.glaciteTunnels.fossils.fossils as fossil, index (index)}
          {@const hasFound = fossil.found}
          <Chip image={{ src: fossil.texture_path }} class={cn("h-fit w-fit", { "opacity-50": !hasFound })}>
            <div class={cn("flex flex-col")}>
              <div class="font-bold whitespace-nowrap">
                {fossil.name}
              </div>
            </div>
            {#snippet tooltip()}
              <div class="text-sm font-bold">
                <span class="text-text">{fossil.found ? "Found" : "Not Found"}</span>
              </div>
            {/snippet}
          </Chip>
        {/each}
      </ScrollItems>
    </Items>

    <Items class="flex-col" subtitle="Corpses">
      <AdditionStat text="Corpses Found" data={mining.glaciteTunnels.corpses.found} maxed={mining.glaciteTunnels.corpses.found === mining.glaciteTunnels.corpses.max} />

      <ScrollItems>
        {#each mining.glaciteTunnels.corpses.corpses as corpse, index (index)}
          {@const hasUnlocked = corpse.amount}
          <Chip image={{ src: corpse.texture_path }} class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })}>
            <div class="flex flex-col">
              <div class="font-bold whitespace-nowrap">
                <span class="opacity-60">{corpse.name}</span>
                <div class="text-sm">
                  <span class="opacity-60">Amount:</span>
                  <span class="text-text">{format(corpse.amount)}</span>
                </div>
              </div>
            </div>
          </Chip>
        {/each}
      </ScrollItems>
    </Items>
  </div>

  <SectionSubtitle class="mt-5">Forge</SectionSubtitle>
  <div class="space-y-1">
    {#if mining.forge.length === 0}
      No items currently forging!
    {/if}
    {#each mining.forge as item, index (index)}
      {@const ended = item.endingTime < Date.now()}
      <AdditionStat text={`Slot ${item.slot}`} data={`${item.name} - ${ended ? "ended" : `ends ${formatDistanceToNowStrict(item.endingTime, { addSuffix: true, in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone) })}`}`} asterisk={true}>
        {formatDate(item.endingTime, "dd MMMM yyyy 'at' HH:mm")}
      </AdditionStat>
    {/each}
  </div>
{:else}
  <p class="space-x-0.5 leading-6">This player doesn't have anything related to mining.</p>
{/if}
