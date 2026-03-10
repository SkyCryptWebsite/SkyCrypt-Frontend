<script lang="ts">
  import { getProfileContext } from "$ctx";
  import { Chip, ScrollItems } from "$lib/components/misc";
  import { SectionBoundary, SectionSubtitle } from "$lib/components/sections";
  import { AdditionStat, GardenPlotGrid } from "$lib/components/stats";
  import { type ModelsGarden } from "$lib/shared/api/orval-generated";
  import { getGarden } from "$lib/shared/api/skycrypt-api.remote";
  import { calculatePercentage, formatNumber, getRarityClass } from "$lib/shared/helper";
  import { cn } from "$lib/shared/utils";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import { Collapsible, Progress } from "bits-ui";
  import { format } from "numerable";
  import { getCurrentTabContext } from "../SkillsSection.svelte";
  import { TabNamesEnum } from "../types";

  const profile = $derived(getProfileContext().current);
  const profileId = $derived(profile?.profile_id);
  const gardenLocked = $derived((profile?.skyblock_level?.level ?? 0) <= 5);
  let sectionOpen: boolean = $derived(getCurrentTabContext().current === TabNamesEnum.Farming);
  let hasOpened = $state(false);

  $effect(() => {
    if (sectionOpen) {
      hasOpened = true;
    }
  });
</script>

<Collapsible.Root bind:open={sectionOpen}>
  <Collapsible.Trigger class="group flex items-center gap-0.5 pt-4">
    <ChevronDown class="size-5 transition-all duration-300 ease-out group-data-[state=open]:-rotate-180" />
    <SectionSubtitle class="my-0">Garden</SectionSubtitle>
  </Collapsible.Trigger>
  <Collapsible.Content>
    {#if gardenLocked}
      <p>This player does not have the Garden unlocked.</p>
    {:else if hasOpened}
      <SectionBoundary promise={getGarden({ uuid: profile?.uuid ?? "", profileId: profileId! })}>
        {#snippet children(garden)}
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
              <AdditionStat text="DNA Analysis Milestone" data="{garden.dnaAnalysisMilestone?.level} / {garden.dnaAnalysisMilestone?.maxLevel}" maxed={garden.dnaAnalysisMilestone?.level === garden.dnaAnalysisMilestone?.maxLevel} />
            </div>
            {#if garden.gardenUpgrades}
              <div class="mt-5">
                <div class="mb-3 flex items-center gap-1 text-base font-semibold uppercase">
                  <h3 class="text-xl">Garden Upgrades</h3>
                </div>

                <ScrollItems>
                  {#each garden.gardenUpgrades as gardenUpgrade, index (index)}
                    {@const hasUnlocked = gardenUpgrade.level}
                    <Chip class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })} image={{ src: gardenUpgrade.texture ?? "" }}>
                      <div class={cn("flex flex-col")}>
                        <div class="font-bold whitespace-nowrap">
                          <span class="capitalize opacity-60">{gardenUpgrade.name}</span>
                          <div class="text-sm">
                            <span class="opacity-60">Level:</span>
                            <span class="text-text">{format(gardenUpgrade.level)}</span>
                          </div>
                        </div>
                      </div>
                    </Chip>
                  {/each}
                </ScrollItems>
              </div>
            {/if}

            {#if garden.gardenChips != null}
              <div class="space-y-4">
                <SectionSubtitle class="uppercase!">Garden Chips</SectionSubtitle>
                <ScrollItems>
                  {#each garden.gardenChips as gardenChip, index (index)}
                    {@const hasUnlocked = gardenChip.amount}
                    {@const hasMaxed = (gardenChip.amount ?? 0) >= (gardenChip.maxLevel ?? 0)}
                    <Chip class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })} image={{ src: gardenChip.texture ?? "" }}>
                      <div class={cn("flex flex-col")}>
                        <div class="font-bold whitespace-nowrap">
                          <span class={cn("capitalize", hasMaxed ? "text-maxed" : "opacity-60")}>{gardenChip.name}</span>
                          <div class={cn("text-sm", hasMaxed ? "text-gold" : "text-text")}>
                            <span class="opacity-60">Level:</span>
                            {format(gardenChip.amount)}/{gardenChip.maxLevel}
                          </div>
                        </div>
                      </div>
                    </Chip>
                  {/each}
                </ScrollItems>
              </div>
            {/if}
            <div class="mt-5">
              {@render milestones(garden)}
            </div>
            <div class="mt-5">
              {@render upgrades(garden)}
            </div>
            <div class="mt-5">
              <GardenPlotGrid plot={garden.plot} />
            </div>
          {/if}
        {/snippet}
      </SectionBoundary>
    {/if}
  </Collapsible.Content>
</Collapsible.Root>

{#snippet upgrades(garden: ModelsGarden)}
  {#if garden.cropUpgrades}
    {@const allMaxed = Object.values(garden.cropUpgrades).every((upgrade) => upgrade.level?.maxed)}
    <div class="mb-3 flex items-center gap-1 text-base font-semibold uppercase">
      <h3 class="text-xl">Crop Upgrades</h3>
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
