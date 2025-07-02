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

{#if misc && misc.auctions != null}
  <SectionSubtitle class="uppercase!">Auctions Sold</SectionSubtitle>
  <Items>
    {#snippet text()}
      <div>
        <AdditionStat text="Fees" data={format(misc.auctions.fees)} />
        <AdditionStat text="Coins Earned" data={format(misc.auctions.gold_earned)} />
        {#if misc.auctions.total_sold?.total !== 0}
          <AdditionStat text="Items Sold" data={format(misc.auctions.total_sold.total)} asterisk={true}>
            {#each Object.entries(misc.auctions.total_sold) as [rarity, amount], index (index)}
              {#if rarity !== "total"}
                <AdditionStat text={rarity} data={format(amount)} textRarityColor={rarity.toLowerCase()} />
              {/if}
            {/each}
          </AdditionStat>
        {/if}
      </div>
    {/snippet}
  </Items>

  <SectionSubtitle class="uppercase!">Auctions Bought</SectionSubtitle>
  <Items>
    {#snippet text()}
      <div>
        <AdditionStat text="Bids" data={format(misc.auctions.bids)} />
        <AdditionStat text="Highest Bid" data={format(misc.auctions.highest_bid)} />
        <AdditionStat text="Won" data={format(misc.auctions.won)} />
        <AdditionStat text="Coins Spent" data={format(misc.auctions.gold_spent)} />
        {#if misc.auctions.total_bought?.total !== 0}
          <AdditionStat text="Items Bought" data={format(misc.auctions.total_bought.total)} asterisk={true}>
            {#each Object.entries(misc.auctions.total_bought) as [rarity, amount], index (index)}
              {#if rarity !== "total"}
                <AdditionStat text={rarity} data={format(amount)} textRarityColor={rarity.toLowerCase()} />
              {/if}
            {/each}
          </AdditionStat>
        {/if}
      </div>
    {/snippet}
  </Items>
{/if}
