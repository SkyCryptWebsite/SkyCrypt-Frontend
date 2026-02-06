<script lang="ts">
  import { getMiscContext } from "$ctx";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import { format } from "numerable";
  import VirtualList from "svelte-tiny-virtual-list";

  const misc = $derived(getMiscContext().misc);

  const sortedKills = $derived(misc?.kills?.kills ? [...misc.kills.kills].sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0)) : []);
  const sortedDeaths = $derived(misc?.kills?.deaths ? [...misc.kills.deaths].sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0)) : []);
</script>

{#if misc && misc.kills != null}
  <div class="space-y-4">
    <SectionSubtitle class="uppercase!">Kills</SectionSubtitle>
    <div>
      <AdditionStat text="Total Kills" data={format(misc.kills.total_kills)} />
      <AdditionStat text="Total Deaths" data={format(misc.kills.total_deaths)} />
    </div>
    {#if (misc.kills.kills && misc.kills.kills.length > 0) || (misc.kills.deaths && misc.kills.deaths.length > 0)}
      <ScrollItems>
        {#if misc.kills.kills}
          <div class="flex min-w-88 flex-col gap-1 rounded-lg bg-background/30 @md:min-w-96">
            <div class="flex w-full items-center justify-center gap-1.5 border-b-2 border-icon py-2 text-center font-semibold uppercase">Kills</div>
            <VirtualList height={320} width="100%" itemCount={misc.kills.kills.length} itemSize={misc.kills.kills.length > 0 ? 20 : 0} scrollDirection="vertical">
              {#snippet item({ index, style })}
                <div {style} class="px-4 font-semibold whitespace-nowrap">
                  <div class="inline-block text-text/60 capitalize">#{index + 1}</div>
                  <div class="inline-block text-text">{sortedKills[index].name}</div>
                  <div class="inline-block text-text/60">: {format(sortedKills[index].amount)}</div>
                </div>
              {/snippet}
            </VirtualList>
          </div>
        {/if}
        {#if misc.kills.deaths}
          <div class="flex min-w-88 flex-col gap-1 rounded-lg bg-background/30 @md:min-w-96">
            <div class="flex w-full items-center justify-center gap-1.5 border-b-2 border-icon py-2 text-center font-semibold uppercase">Deaths</div>
            <VirtualList height={320} width="100%" itemCount={misc.kills.deaths.length} itemSize={misc.kills.deaths.length > 0 ? 20 : 0} scrollDirection="vertical">
              {#snippet item({ index, style })}
                <div {style} class="px-4 font-semibold whitespace-nowrap">
                  <div class="inline-block text-text/60 capitalize">#{index + 1}</div>
                  <div class="inline-block text-text">{sortedDeaths[index].name}</div>
                  <div class="inline-block text-text/60">: {format(sortedDeaths[index].amount)}</div>
                </div>
              {/snippet}
            </VirtualList>
          </div>
        {/if}
      </ScrollItems>
    {/if}
  </div>
{/if}
