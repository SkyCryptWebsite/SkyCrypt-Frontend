<script lang="ts">
  import { getDynamicCtx } from "$ctx/dynamic.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import { SectionName } from "$lib/shared/api";
  import type { MiscV2 } from "$types/statsv2";
  import { format } from "numerable";
  import VirtualList from "svelte-tiny-virtual-list";

  const ctx = getDynamicCtx<() => MiscV2 | undefined>(SectionName.MISC);
  const misc = $derived(ctx?.data?.());
</script>

{#if misc && misc.kills != null}
  <div class="space-y-4">
    <SectionSubtitle class="uppercase!">Kills</SectionSubtitle>
    <div>
      <AdditionStat text="Total Kills" data={format(misc.kills.total_kills)} />
      <AdditionStat text="Total Deaths" data={format(misc.kills.total_deaths)} />
    </div>
    {#if misc.kills.kills.length > 0}
      <ScrollItems>
        <div class="bg-background/30 flex min-w-[22rem] flex-col gap-1 rounded-lg @md:min-w-96">
          <div class="border-icon flex w-full items-center justify-center gap-1.5 border-b-2 py-2 text-center font-semibold uppercase">Kills</div>
          <VirtualList height={320} width="100%" itemCount={misc.kills.kills.length} itemSize={misc.kills.kills.length > 0 ? 20 : 0} scrollDirection="vertical">
            <div slot="item" let:index let:style {style} class="px-4 font-semibold whitespace-nowrap">
              <div class="text-text/60 inline-block capitalize">#{index + 1}</div>
              <div class="text-text inline-block">{misc.kills.kills[index].name}</div>
              <div class="text-text/60 inline-block">: {format(misc.kills.kills[index].amount)}</div>
            </div>
          </VirtualList>
        </div>
        <div class="bg-background/30 flex min-w-[22rem] flex-col gap-1 rounded-lg @md:min-w-96">
          <div class="border-icon flex w-full items-center justify-center gap-1.5 border-b-2 py-2 text-center font-semibold uppercase">Deaths</div>
          <VirtualList height={320} width="100%" itemCount={misc.kills.deaths.length} itemSize={misc.kills.deaths.length > 0 ? 20 : 0} scrollDirection="vertical">
            <div slot="item" let:index let:style {style} class="px-4 font-semibold whitespace-nowrap">
              <div class="text-text/60 inline-block capitalize">#{index + 1}</div>
              <div class="text-text inline-block">{misc.kills.deaths[index].name}</div>
              <div class="text-text/60 inline-block">: {format(misc.kills.deaths[index].amount)}</div>
            </div>
          </VirtualList>
        </div>
      </ScrollItems>
    {/if}
  </div>
{/if}
