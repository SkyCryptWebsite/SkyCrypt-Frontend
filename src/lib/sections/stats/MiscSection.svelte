<script lang="ts">
  import { getProfileContext, MiscContext, setMiscContext } from "$ctx";
  import { Section } from "$lib/components/sections";
  import { getMiscSection } from "$lib/shared/api/skycrypt-api.remote";
  import Auctions from "./misc/auctions.svelte";
  import Claimed from "./misc/claimed.svelte";
  import Damage from "./misc/damage.svelte";
  import Dragons from "./misc/dragons.svelte";
  import Endstone from "./misc/endstone.svelte";
  import Essence from "./misc/essence.svelte";
  import Garden from "./misc/garden.svelte";
  import Gifts from "./misc/gifts.svelte";
  import Jerry from "./misc/jerry.svelte";
  import Kills from "./misc/kills.svelte";
  import Mythological from "./misc/mythological.svelte";
  import Pet from "./misc/pet.svelte";
  import Uncategorized from "./misc/uncategorized.svelte";
  import Upgrades from "./misc/upgrades.svelte";

  let { order }: { order: number } = $props();
  const profile = $derived(getProfileContext().current);
  const profileUUID = $derived(profile?.uuid);
  const profileId = $derived(profile?.profile_id);

  const miscClass = new MiscContext();
  setMiscContext(miscClass);

  const misc = $derived(await getMiscSection({ uuid: profileUUID!, profileId: profileId! }));

  $effect(() => {
    miscClass.misc = misc;
  });
</script>

<Section id="Misc" {order}>
  {#if misc}
    <Essence />
    <Garden />
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
