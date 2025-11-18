<script lang="ts">
  import { getHoverContext, getProfileContext } from "$ctx";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import Chip from "$lib/components/Chip.svelte";
  import Notice from "$lib/components/Notice.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import { type ModelsGarden } from "$lib/shared/api/orval-generated";
  import { getGarden } from "$lib/shared/api/skycrypt-api.remote";
  import { calculatePercentage, formatNumber, getRarityClass, renderLore } from "$lib/shared/helper";
  import { animateObfuscatedText } from "$lib/shared/mc-text/obfuscated";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { content } from "$lib/stores/internal";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import Image from "@lucide/svelte/icons/image";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { Avatar, Collapsible, Progress, Tooltip } from "bits-ui";
  import { format } from "numerable";

  const profile = $derived(getProfileContext().current);
  const profileId = $derived(profile?.profile_id);
  const gardenLocked = $derived(profile?.skyblock_level?.level ?? 0 <= 5);

  let sectionOpen: boolean = $state(false);

  const isHover = getHoverContext();
</script>

<Collapsible.Root bind:open={sectionOpen}>
  <Collapsible.Trigger class="group flex items-center gap-0.5">
    <ChevronDown class="size-5 transition-all duration-300 ease-out group-data-[state=open]:-rotate-180" />
    <SectionSubtitle class="my-0">Garden</SectionSubtitle>
  </Collapsible.Trigger>
  <Collapsible.Content>
    {#if gardenLocked}
      <p>This player does not have the Garden unlocked.</p>
    {:else}
      <svelte:boundary>
        {#snippet pending()}
          <LoaderCircle class="animate-spin text-icon" />
        {/snippet}
        {#snippet failed(err, retry)}
          <Notice title="An unexpected error has occurred" type="error" error={err} {retry} />
        {/snippet}
        {@const garden = await getGarden({ profileId: profileId! })}
        {#if garden}
          {@const hasMaxed = garden.level?.maxed ?? false}
          <div class="mt-2">
            <AdditionStat text="Level" data="{garden.level?.level} / {garden.level?.maxLevel}" maxed={hasMaxed} asterisk={true}>
              <h3 class="font-bold text-text/85">
                XP:
                <span class="text-text">
                  {format(garden.level?.xp)}
                </span>
              </h3>
              <h3 class="font-bold text-text/85">Progress to next level:</h3>
              <Progress.Root value={garden.level?.xpCurrent} max={hasMaxed ? garden.level?.xpCurrent : garden.level?.xpForNext} class="relative h-4 w-full overflow-hidden rounded-full bg-text/30">
                <div class="absolute z-10 flex h-full w-full justify-center">
                  <div class="text-xs font-semibold shadow-background/50 text-shadow-md">
                    {formatNumber(garden.level?.xpCurrent ?? 0)} / {formatNumber(garden.level?.xpForNext ?? 0)}
                    XP
                  </div>
                </div>
                <div class="h-full w-full flex-1 rounded-full bg-skillbar transition-all duration-300 ease-out data-[maxed=true]:bg-maxedbar" style={`transform: translateX(-${100 - parseFloat(calculatePercentage(garden.level?.xpCurrent ?? 0, hasMaxed ? (garden.level?.xpCurrent ?? 0) : (garden.level?.xpForNext ?? 0)))}%)`} data-maxed={hasMaxed}></div>
              </Progress.Root>
            </AdditionStat>
            <AdditionStat text="Composter" data={Object.values(garden.composter ?? {}).join(" / ")} asterisk={true} maxed={Object.values(garden.composter ?? {}).every((value) => value === 25)}>
              {#each Object.entries(garden.composter ?? {}) as [key, value], index (index)}
                <h3 class="font-bold text-text/85">
                  <span class="capitalize">{key.replaceAll("_", " ")}</span>:
                  <span class="text-text">
                    {value}
                  </span>
                </h3>
              {/each}
            </AdditionStat>
            <AdditionStat text="Visitors" data={format(garden.visitors?.completed)} asterisk={true}>
              {#each Object.entries(garden.visitors?.visitors ?? {}) as [key, value], index (index)}
                <h3 class="font-bold text-text/85">
                  <span class={cn("capitalize", getRarityClass(key, "text"))}>{key}</span>:
                  <span class="text-text">
                    {format(value.completed)}
                  </span>
                </h3>
              {/each}
            </AdditionStat>
            <AdditionStat text="Unique Visitors" data={garden.visitors?.uniqueVisitors ?? 0} asterisk={true}>
              {#each Object.entries(garden.visitors?.visitors ?? {}) as [key, value], index (index)}
                <h3 class="font-bold text-text/85">
                  <span class={cn("capitalize", getRarityClass(key, "text"))}>{key}</span>:
                  <span class="text-text">
                    {format(value.unique)}
                  </span>
                </h3>
              {/each}
            </AdditionStat>
          </div>
          <div class="mt-5">
            {@render milestones(garden)}
          </div>
          <div class="mt-5">
            {@render upgrades(garden)}
          </div>
          <div class="mt-5">
            {@render plots(garden)}
          </div>
        {/if}
      </svelte:boundary>
    {/if}
  </Collapsible.Content>
</Collapsible.Root>

{#snippet plots(garden: ModelsGarden)}
  {@const allMaxed = garden.plot?.unlocked === garden.plot?.total}
  <div class="mb-3 flex items-center gap-1 text-base font-semibold uppercase">
    <h3 class="text-xl">Plots</h3>
    {#if allMaxed}
      <span class="text-gold">Max!</span>
    {:else}
      <span class="text-text/80">({garden.plot?.unlocked} / {garden.plot?.total} max)</span>
    {/if}
  </div>

  <div class="space-y-0.5">
    {#if garden.plot?.unlocked != null && garden.plot?.total != null}
      <AdditionStat text="Unlocked Plots" data={`${garden.plot.unlocked}/${garden.plot?.total}`} maxed={garden.plot.unlocked === garden.plot.total} />
    {/if}
    {#if garden.plot?.barnSkin}
      <AdditionStat text="Barn Skin" data={garden.plot.barnSkin} />
    {/if}
  </div>
  {#if garden.plot}
    <div class="@container relative mt-3 mb-0 rounded-lg bg-background/30 p-5">
      <div class="grid grid-cols-[repeat(5,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
        {#each garden.plot.layout as plot, index (index)}
          {#snippet tooltipContent()}
            {#if plot.display_name}
              <p {@attach animateObfuscatedText}>{@html renderLore(plot.display_name)}</p>
            {/if}
          {/snippet}
          <Tooltip.Root disableCloseOnTriggerClick={false}>
            <Tooltip.Trigger onclick={() => content.set(tooltipContent)}>
              <Avatar.Root class="flex aspect-square items-center justify-center rounded-sm bg-text/4 p-1">
                <Avatar.Image src={plot.texture_path} class="h-auto w-14 select-none [image-rendering:pixelated]" />
                <Avatar.Fallback>
                  <Image class="size-full" />
                </Avatar.Fallback>
              </Avatar.Root>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              {#if isHover.current}
                <Tooltip.Content forceMount class="z-50 rounded-lg bg-background-grey p-4 font-semibold text-text/80" sideOffset={6} side="top" align="center">
                  {#snippet child({ wrapperProps, props, open })}
                    {#if open}
                      <div {...wrapperProps}>
                        <div {...props} transition:flyAndScale>
                          <Tooltip.Arrow />
                          {@render tooltipContent()}
                        </div>
                      </div>
                    {/if}
                  {/snippet}
                </Tooltip.Content>
              {/if}
            </Tooltip.Portal>
          </Tooltip.Root>
        {/each}
      </div>
    </div>
  {/if}
{/snippet}

{#snippet upgrades(garden: ModelsGarden)}
  {#if garden.cropUpgrades}
    {@const allMaxed = Object.values(garden.cropUpgrades).every((upgrade) => upgrade.level?.maxed)}
    <div class="mb-3 flex items-center gap-1 text-base font-semibold uppercase">
      <h3 class="text-xl">Upgrades</h3>
      {#if allMaxed}
        <span class="text-gold">Max!</span>
      {:else}
        <span class="text-text/80">({Object.values(garden.cropUpgrades).filter((upgrade) => upgrade.level?.maxed).length} / {Object.values(garden.cropUpgrades).length} max)</span>
      {/if}
    </div>
    <ScrollItems>
      {#each garden.cropUpgrades as upgrade, index (index)}
        {@const hasMaxed = upgrade.level?.maxed}
        <Chip image={{ src: upgrade.texture ?? "" }} class={cn("h-fit w-fit", { "opacity-50": !upgrade.level?.level })}>
          <div class={cn("flex flex-col")}>
            <div class="font-bold whitespace-nowrap">
              <span class={cn(hasMaxed ? "text-maxed" : "opacity-60")}>{upgrade.name}</span>
              <span class={cn({ "text-gold": hasMaxed })}>{upgrade.level?.level}</span>
            </div>
          </div>
        </Chip>
      {/each}
    </ScrollItems>
  {/if}
{/snippet}

{#snippet milestones(garden: ModelsGarden)}
  {#if garden.cropMilestones}
    {@const allMaxed = Object.values(garden.cropMilestones).every((upgrade) => upgrade.level?.maxed)}
    <div class="mb-3 flex items-center gap-1 text-base font-semibold uppercase">
      <h3 class="text-xl">Milestones</h3>
      {#if allMaxed}
        <span class="text-gold">Max!</span>
      {:else if garden.cropUpgrades}
        <span class="text-text/80">({Object.values(garden.cropMilestones).filter((upgrade) => upgrade.level?.maxed).length} / {Object.values(garden.cropUpgrades).length} max)</span>
      {/if}
    </div>
    <ScrollItems>
      {#each garden.cropMilestones as milestone, index (index)}
        {@const hasMaxed = milestone.level?.maxed}
        <Chip image={{ src: milestone.texture ?? "" }} class={cn("h-fit w-fit flex-col overflow-clip pb-0", { "opacity-50": !milestone.level?.xp })}>
          <div class={cn("flex flex-col")}>
            <div class="font-bold whitespace-nowrap">
              <span class={cn(hasMaxed ? "text-maxed" : "opacity-60")}>{milestone.name}</span>
              <span class={cn({ "text-gold": hasMaxed })}>{milestone.level?.level}</span>
            </div>
          </div>

          {#snippet progress()}
            <Progress.Root value={milestone.level?.xpCurrent} max={hasMaxed ? milestone.level?.xpCurrent : milestone.level?.xpForNext} class="relative h-4 w-full overflow-hidden ">
              <div class="absolute z-10 flex h-full w-full justify-center">
                <div class="text-xs font-semibold shadow-background/50 text-shadow-md">
                  {formatNumber(milestone.level?.xpCurrent ?? 0)} / {formatNumber(milestone.level?.xpForNext ?? 0)}
                  XP
                </div>
              </div>

              <div class="h-full w-full flex-1 bg-skillbar transition-all duration-300 ease-out data-[maxed=true]:bg-maxedbar" style={`transform: translateX(-${100 - parseFloat(calculatePercentage(milestone.level?.xpCurrent ?? 0, hasMaxed ? (milestone.level?.xpCurrent ?? 0) : (milestone.level?.xpForNext ?? 0)))}%)`} data-maxed={hasMaxed}></div>
            </Progress.Root>
          {/snippet}
        </Chip>
      {/each}
    </ScrollItems>
  {/if}
{/snippet}
