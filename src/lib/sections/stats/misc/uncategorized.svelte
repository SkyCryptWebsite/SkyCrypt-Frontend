<script lang="ts">
  import { getMiscContext } from "$ctx";
  import { SectionSubtitle } from "$lib/components/sections";
  import { AdditionStat } from "$lib/components/stats";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { format } from "numerable";

  const misc = $derived(getMiscContext().misc);
</script>

{#if misc && misc.uncategorized != null && Object.values(misc.uncategorized).filter((value) => value).length > 0}
  <SectionSubtitle class="uppercase!">Uncategorized</SectionSubtitle>
  <Items>
    {#snippet text()}
      {#if misc.uncategorized}
        <div>
          <AdditionStat text="Soulflow" data={format(misc.uncategorized.soulflow as number, "0.00a")} />
          <AdditionStat text="Bank Cooldown" data={misc.uncategorized.personal_bank as number} maxed={misc.uncategorized.personal_bank === "None"} />
        </div>
      {/if}
    {/snippet}
  </Items>
{/if}
