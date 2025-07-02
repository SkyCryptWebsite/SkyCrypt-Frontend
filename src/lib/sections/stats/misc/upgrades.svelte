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

{#if misc && misc.profile_upgrades != null}
  <SectionSubtitle class="uppercase!">Upgrades</SectionSubtitle>
  <Items>
    {#snippet text()}
      <div>
        <AdditionStat text="Island Size" data="{format(misc.profile_upgrades.island_size)} / 10" maxed={misc.profile_upgrades.island_size === 10} />
        <AdditionStat text="Minion Slots" data="{format(misc.profile_upgrades.minion_slots)} / 5" maxed={misc.profile_upgrades.minion_slots === 5} />
        <AdditionStat text="Guests Count" data="{format(misc.profile_upgrades.guests_count)} / 5" maxed={misc.profile_upgrades.guests_count === 5} />
        <AdditionStat text="Coop Slots" data="{format(misc.profile_upgrades.coop_slots)} / 3" maxed={misc.profile_upgrades.coop_slots === 3} />
        <AdditionStat text="Coins Allowance" data="{format(misc.profile_upgrades.coins_allowance)} / 5" maxed={misc.profile_upgrades.coins_allowance === 5} />
      </div>
    {/snippet}
  </Items>
{/if}
