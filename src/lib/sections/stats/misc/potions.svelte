<!-- <script lang="ts">
  import { getMiscContext } from "$ctx";
  import { AdditionStat } from "$lib/components/stats";
  import { SectionSubtitle } from "$lib/components/sections";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { format } from "numerable";

  const misc = $derived(getMiscContext());
</script> -->

<!-- TODO: Fix types after ModelsMiscOutput gets updated -->
<!-- {#if misc && misc.effects != null && Object.values(misc.effects).reduce((acc, val) => acc + val.length, 0) > 0}
  <SectionSubtitle class="uppercase!">Potions</SectionSubtitle>
  <Items>
    {#snippet text()}
      <div>
        <AdditionStat text="Disabled Potion Effects" data={format(misc.effects.disabled.length)} asterisk={true}>
          <p class="text-text/85 font-bold">Disabled Potion Effects:</p>
          {#each misc.effects.disabled as effect, index (index)}
            <p class="text-text font-semibold capitalize">{effect.replaceAll("_", " ")}</p>
          {/each}
        </AdditionStat>
      </div>
    {/snippet}
  </Items>
{/if} -->
