<script lang="ts">
  import { getDynamicCtx } from "$ctx/dynamic.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import { SectionName } from "$lib/shared/api";
  import type { MiscV2 } from "$types/statsv2";
  import { format } from "numerable";

  const ctx = getDynamicCtx<() => MiscV2 | undefined>(SectionName.MISC);
  const misc = $derived(ctx?.data?.());
</script>

{#if misc && misc.races != null}
  <div class="space-y-4">
    <SectionSubtitle class="uppercase!">Races</SectionSubtitle>
    <ScrollItems>
      {#each Object.entries(misc.races) as [_, race], index (index)}
        <div class="bg-background/30 flex min-w-64 flex-col gap-1 rounded-lg">
          <div class="border-icon flex w-full items-center justify-center gap-1.5 border-b-2 py-2 text-center font-semibold uppercase">{race.name}</div>
          <div class="my-2.5 space-y-2.5 px-5">
            {#if race.races.with_return}
              <p class="text-text/80 font-bold">With Return:</p>
              <div>
                <div class="flex h-full w-full flex-col flex-wrap gap-1">
                  {#each Object.entries(race.races.with_return) as [_, value], index (index)}
                    <AdditionStat class="text-base" text={value.name} data={format(value.time)} />
                  {/each}
                </div>
              </div>
            {/if}

            {#if race.races.no_return}
              <p class="text-text/80 font-bold">No Return:</p>
              <div>
                <div class="flex h-full w-full flex-col flex-wrap gap-1">
                  {#each Object.entries(race.races.no_return) as [_, value], index (index)}
                    <AdditionStat class="text-base" text={value.name} data={format(value.time)} />
                  {/each}
                </div>
              </div>
            {/if}

            {#if race.name === "Other"}
              <div class="flex h-full w-full flex-col flex-wrap gap-1">
                {#each Object.entries(race.races) as [_, value], index (index)}
                  {#if value && "name" in value}
                    <AdditionStat class="text-base" text={value.name} data={format(value.time)} />
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </ScrollItems>
  </div>
{/if}
