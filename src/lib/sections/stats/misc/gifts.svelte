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

{#if misc && misc.gifts != null}
  <SectionSubtitle class="uppercase!">Gifts</SectionSubtitle>
  <Items>
    {#snippet text()}
      <div>
        {#each Object.entries(misc.gifts) as [text, data], index (index)}
          <AdditionStat text={text.replaceAll("_", " ")} data={format(data)} />
        {/each}
      </div>
    {/snippet}
  </Items>
{/if}
