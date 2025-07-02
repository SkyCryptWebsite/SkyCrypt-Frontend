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

{#if misc && misc.uncategorized != null && Object.values(misc.uncategorized).filter((value) => value).length > 0}
  <SectionSubtitle class="uppercase!">Uncategorized</SectionSubtitle>
  <Items>
    {#snippet text()}
      <div>
        <AdditionStat text="Soulflow" data={format(misc.uncategorized.soulflow as number, "0.00a")} />
        <AdditionStat text="Bank Cooldown" data={misc.uncategorized.personal_bank as number} maxed={misc.uncategorized.personal_bank === "None"} />
        <AdditionStat text="Teleporter Pill Consumed" data={misc.uncategorized.teleporter_pill_consumed ? "Yes" : "No"} maxed={misc.uncategorized.teleporter_pill_consumed !== undefined} />
        <AdditionStat text="Metaphysical Serum" data={misc.uncategorized.metaphysical_serum as number} maxed={misc.uncategorized.metaphysical_serum === 3} />
        <AdditionStat text="Reaper Peppers Eaten" data={misc.uncategorized.reaper_peppers_eaten as number} maxed={misc.uncategorized.reaper_peppers_eaten === 5} />
        <AdditionStat text="McGrubber Burger" data={misc.uncategorized.mcgrubber_burger as number} maxed={misc.uncategorized.mcgrubber_burger === 5} />
        <AdditionStat text="Wriggling Larva" data={misc.uncategorized.wriggling_larva as number} maxed={misc.uncategorized.wriggling_larva === 5} />
        <AdditionStat text="Refined Bottle of Jyrre" data={misc.uncategorized.refined_bottle_of_jyrre as number} maxed={misc.uncategorized.refined_bottle_of_jyrre === 5} />
      </div>
    {/snippet}
  </Items>
{/if}
