<script lang="ts">
  import { setDynamicCtx } from "$ctx/dynamic.svelte";
  import { getProfileCtx } from "$ctx/profile.svelte";
  import Notice from "$lib/components/Notice.svelte";
  import Section from "$lib/components/Section.svelte";
  import { api, SectionName } from "$lib/shared/api";
  import type { MiscV2 } from "$types/statsv2";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { createQuery } from "@tanstack/svelte-query";
  import Auctions from "./misc/auctions.svelte";
  import Claimed from "./misc/claimed.svelte";
  import Damage from "./misc/damage.svelte";
  import Dragons from "./misc/dragons.svelte";
  import Endstone from "./misc/endstone.svelte";
  import Essence from "./misc/essence.svelte";
  import Gifts from "./misc/gifts.svelte";
  import Jerry from "./misc/jerry.svelte";
  import Kills from "./misc/kills.svelte";
  import Mythological from "./misc/mythological.svelte";
  import Pet from "./misc/pet.svelte";
  import Potions from "./misc/potions.svelte";
  import Races from "./misc/races.svelte";
  import Uncategorized from "./misc/uncategorized.svelte";
  import Upgrades from "./misc/upgrades.svelte";

  let { order }: { order: number } = $props();
  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
  const profileUUID = $derived(profile.uuid);
  const profileId = $derived(profile.profile_id);

  const query = createQuery<MiscV2>(() => ({
    queryKey: [SectionName.MISC, profileUUID, profileId],
    queryFn: () => api().getSection(SectionName.MISC, profileUUID, profileId)
  }));

  const misc = $derived.by(() => {
    if (query.isPending || query.error || !query.data) return;
    return query.data[SectionName.MISC];
  });

  setDynamicCtx(SectionName.MISC, () => misc);
</script>

<Section id="Misc" {order}>
  {#if query.isPending}
    <LoaderCircle class="text-icon animate-spin" />
  {/if}
  {#if query.error}
    <Notice title="An unexpected error has occurred" type="error" error={query.error} />
  {/if}
  {#if query.isSuccess && query.data && misc}
    <Essence />
    <!-- TODO: Essence Shop -->
    <Kills />
    <Races />
    <Gifts />
    <Jerry />
    <Dragons />
    <Endstone />
    <Damage />
    <Pet />
    <Mythological />
    <Potions />
    <Upgrades />
    <Auctions />
    <Claimed />
    <Uncategorized />
  {/if}
</Section>
