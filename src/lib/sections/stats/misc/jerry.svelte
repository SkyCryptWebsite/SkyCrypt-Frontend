<script lang="ts">
  import { getMiscContext } from "$ctx";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { format } from "numerable";

  const misc = $derived(getMiscContext());
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
