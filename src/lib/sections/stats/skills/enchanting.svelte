<script lang="ts">
  import { getDynamicCtx } from "$ctx/dynamic.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import Chip from "$lib/components/Chip.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import { SectionName } from "$lib/shared/api";
  import type { SkillsV2 } from "$types/statsv2";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import { Collapsible } from "bits-ui";
  import { formatDistanceToNowStrict } from "date-fns";
  import { fade } from "svelte/transition";

  const ctx = getDynamicCtx<() => SkillsV2 | undefined>(SectionName.SKILLS);
  const data = $derived(ctx?.data?.());
  const enchanting = $derived(data?.enchanting);
</script>

<SectionSubtitle>Enchanting</SectionSubtitle>
{#if enchanting}
  {#if enchanting.unlocked === false}
    <p class="space-x-0.5 leading-6">This player hasn't unlocked Enchanting yet.</p>
  {:else}
    <Collapsible.Root open>
      <Collapsible.Trigger class="group flex items-center gap-0.5">
        <ChevronDown class="size-5 transition-all duration-300 group-data-[state=open]:-rotate-180" />
        <SectionSubtitle class="my-0">Experiments</SectionSubtitle>
      </Collapsible.Trigger>
      <Collapsible.Content class="mt-4 flex flex-wrap gap-5">
        {#if enchanting}
          {@const enchantingStats = Object.entries(enchanting.data)}
          <ScrollItems>
            {#each enchantingStats as [_key, enchating], index (index)}
              <div class="bg-background/30 flex min-w-80 flex-col items-center gap-1 space-y-5 rounded-lg" in:fade|global={{ duration: 300, delay: 25 * (index + 1) }} out:fade={{ duration: 300, delay: 5 * (enchantingStats.length - index) }}>
                <div class="border-icon flex w-full items-center justify-center border-b-2 py-2 text-center font-semibold uppercase">
                  {enchating.name}
                </div>
                <div class="w-full px-5">
                  {#if enchating.stats.bonusClicks}
                    <AdditionStat text="Bonus Clicks" data={`${enchating.stats.bonusClicks}`} />
                  {/if}
                  {#if enchating.stats.lastAttempt}
                    <AdditionStat text="Last Attempt" data={formatDistanceToNowStrict(enchating.stats.lastAttempt, { addSuffix: true })} />
                  {/if}
                  {#if enchating.stats.lastClaimed}
                    <AdditionStat text="Last Claimed" data={formatDistanceToNowStrict(enchating.stats.lastClaimed, { addSuffix: true })} />
                  {/if}
                </div>
                <div class="w-full space-y-5 px-5 pb-5">
                  {#each enchating.stats.games as game, index (index)}
                    <Chip image={{ src: game.texture }} class="w-full max-w-none">
                      <div class="flex flex-col">
                        <div class="flex flex-col gap-0.5">
                          <h4 class="text-text/60 font-bold">{`${game.name}`}</h4>
                        </div>
                        <div class="flex w-full flex-col gap-0.5">
                          {#if game.attempts}
                            <AdditionStat text="Attempts" data={`${game.attempts}`} />
                          {/if}
                          {#if game.claims}
                            <AdditionStat text="Claims" data={`${game.claims}`} />
                          {/if}
                          {#if game.bestScore}
                            <AdditionStat text="Best Score" data={`${game.bestScore}`} />
                          {/if}
                        </div>
                      </div>
                    </Chip>
                  {/each}
                </div>
              </div>
            {/each}
          </ScrollItems>
        {:else}
          <p class="text-text/60">No data available</p>
        {/if}
      </Collapsible.Content>
    </Collapsible.Root>
  {/if}
{:else}
  <p class="space-x-0.5 leading-6">This player doesn't have anything related to enchanting.</p>
{/if}
