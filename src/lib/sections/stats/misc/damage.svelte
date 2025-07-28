<script lang="ts">
  import { getDynamicCtx } from "$ctx/dynamic.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { SectionName } from "$lib/shared/api";
  import type { MiscV2 } from "$types/statsv2";
  import { format } from "numerable";

  const ctx = getDynamicCtx<() => MiscV2 | undefined>(SectionName.MISC);
  const misc = $derived(ctx?.data?.());
</script>

{#if misc && misc.damage != null}
  <SectionSubtitle class="uppercase!">Damage</SectionSubtitle>
  <Items>
    {#snippet text()}
      <div>
        {#each Object.entries(misc.damage) as [text, data], index (index)}
          <AdditionStat text={text.replaceAll("_", " ")} data={format(data.toFixed(3))} />
        {/each}
      </div>
    {/snippet}
  </Items>
{/if}
