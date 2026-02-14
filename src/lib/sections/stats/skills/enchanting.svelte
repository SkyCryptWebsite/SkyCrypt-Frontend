<script lang="ts">
  import { getSkillsContext } from "$ctx";
  import { AdditionStat } from "$lib/components/stats";
  import { Chip } from "$lib/components/misc";
  import { ScrollItems } from "$lib/components/misc";
  import { SectionSubtitle } from "$lib/components/sections";
  import { tz } from "@date-fns/tz";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import { Collapsible } from "bits-ui";
  import { formatDistanceToNowStrict } from "date-fns";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  const data = $derived(getSkillsContext().skills);
  const enchanting = $derived(data?.enchanting);
</script>

<SectionSubtitle>Enchanting</SectionSubtitle>
{#if enchanting}
  {#if enchanting.unlocked === false}
    <p class="space-x-0.5 leading-6">This player hasn't unlocked Enchanting yet.</p>
  {:else}
    <Collapsible.Root open>
      <Collapsible.Trigger class="group flex items-center gap-0.5">
        <ChevronDown class="size-5 transition-all duration-300 ease-out group-data-[state=open]:-rotate-180" />
        <SectionSubtitle class="my-0">Experiments</SectionSubtitle>
      </Collapsible.Trigger>
      <Collapsible.Content class="mt-4 flex flex-wrap gap-5">
        {#if enchanting && enchanting.data}
          {@const enchantingStats = Object.entries(enchanting.data)}
          <ScrollItems>
            {#each enchantingStats as [_key, enchating], index (index)}
              <div class="flex min-w-80 flex-col items-center gap-1 space-y-5 rounded-lg bg-background/30" in:fade|global={{ duration: 300, delay: 25 * (index + 1), easing: cubicOut }} out:fade={{ duration: 300, delay: 5 * (enchantingStats.length - index), easing: cubicOut }}>
                <div class="flex w-full items-center justify-center border-b-2 border-icon py-2 text-center font-semibold uppercase">
                  {enchating.name}
                </div>
                {#if enchating.stats}
                  <div class="w-full px-5">
                    {#if enchating.stats.bonusClicks}
                      <AdditionStat text="Bonus Clicks" data={`${enchating.stats.bonusClicks}`} />
                    {/if}
                    {#if enchating.stats.lastAttempt}
                      <AdditionStat text="Last Attempt" data={formatDistanceToNowStrict(enchating.stats.lastAttempt, { addSuffix: true, in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone) })} />
                    {/if}
                    {#if enchating.stats.lastClaimed}
                      <AdditionStat text="Last Claimed" data={formatDistanceToNowStrict(enchating.stats.lastClaimed, { addSuffix: true, in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone) })} />
                    {/if}
                  </div>
                {/if}
                {#if enchating.stats}
                  <div class="w-full space-y-5 px-5 pb-5">
                    {#each enchating.stats.games as game, index (index)}
                      <Chip image={{ src: game.texture ?? "" }} class="w-full max-w-none">
                        <div class="flex flex-col">
                          <div class="flex flex-col gap-0.5">
                            <h4 class="font-bold text-text/60">{`${game.name}`}</h4>
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
                {/if}
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
