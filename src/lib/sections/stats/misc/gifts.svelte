<script lang="ts">
  import { getMiscContext } from "$ctx";
  import { SectionSubtitle } from "$lib/components/sections";
  import { AdditionStat } from "$lib/components/stats";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { format } from "numerable";

  const misc = $derived(getMiscContext().misc);
</script>

{#if misc && misc.gifts != null}
  <SectionSubtitle class="uppercase!">Gifts</SectionSubtitle>
  <Items>
    {#snippet text()}
      {#if misc.gifts}
        <div>
          {#each Object.entries(misc.gifts) as [text, data], index (index)}
            <AdditionStat text={text.replaceAll("_", " ")} data={format(data)} />
          {/each}
        </div>
      {/if}
    {/snippet}
  </Items>
{/if}
