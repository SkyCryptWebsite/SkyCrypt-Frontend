<script lang="ts">
  import { getMiscContext } from "$ctx";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { format } from "numerable";

  const misc = $derived(getMiscContext());
</script>

{#if misc && misc.endstone_protector != null}
  <SectionSubtitle class="uppercase!">Endstone Protector</SectionSubtitle>
  <Items>
    {#snippet text()}
      {#if misc.endstone_protector}
        <div>
          {#each Object.entries(misc.endstone_protector) as [text, data], index (index)}
            <AdditionStat text={text.replaceAll("_", " ")} data={format(data)} />
          {/each}
        </div>
      {/if}
    {/snippet}
  </Items>
{/if}
