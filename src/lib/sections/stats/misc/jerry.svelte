<script lang="ts">
  import { getMiscContext } from "$ctx";
  import { SectionSubtitle } from "$lib/components/sections";
  import { AdditionStat } from "$lib/components/stats";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { format } from "numerable";

  const misc = $derived(getMiscContext().misc);
</script>

{#if misc && misc.season_of_jerry != null}
  <SectionSubtitle class="uppercase!">Season of Jerry</SectionSubtitle>
  <Items>
    {#snippet text()}
      {#if misc.season_of_jerry}
        <div>
          {#each Object.entries(misc.season_of_jerry) as [text, data], index (index)}
            <AdditionStat text={text.replaceAll("_", " ")} data={format(data)} />
          {/each}
        </div>
      {/if}
    {/snippet}
  </Items>
{/if}
