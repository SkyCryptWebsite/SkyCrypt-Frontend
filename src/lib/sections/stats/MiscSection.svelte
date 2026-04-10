<script lang="ts">
  import { getCombinedContext, MiscContext, setMiscContext } from "$ctx";
  import { Section } from "$lib/components/sections";
  import Auctions from "./misc/auctions.svelte";
  import Chips from "./misc/chips.svelte";
  import Claimed from "./misc/claimed.svelte";
  import Damage from "./misc/damage.svelte";
  import Dragons from "./misc/dragons.svelte";
  import Endstone from "./misc/endstone.svelte";
  import Gifts from "./misc/gifts.svelte";
  import Jerry from "./misc/jerry.svelte";
  import Kills from "./misc/kills.svelte";
  import Mythological from "./misc/mythological.svelte";
  import Pet from "./misc/pet.svelte";
  import Uncategorized from "./misc/uncategorized.svelte";
  import Upgrades from "./misc/upgrades.svelte";

  let { order }: { order: number } = $props();

  const miscClass = new MiscContext();
  setMiscContext(miscClass);

  const misc = $derived(getCombinedContext().current?.misc);

  $effect(() => {
    miscClass.misc = misc ?? null;
  });
</script>

<Section id="Misc" {order}>
  {#if misc}
    <Chips />
    <!-- TODO: Essence Shop -->
    <Kills />
    <!-- <Races /> -->
    <Gifts />
    <Jerry />
    <Dragons />
    <Endstone />
    <Damage />
    <Pet />
    <Mythological />
    <!-- <Potions /> -->
    <Upgrades />
    <Auctions />
    <Claimed />
    <Uncategorized />
  {/if}
</Section>
