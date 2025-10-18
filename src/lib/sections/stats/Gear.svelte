<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import Bonus from "$lib/components/Bonus.svelte";
  import EmptyEquipment from "$lib/components/EmptyEquipment.svelte";
  import Item from "$lib/components/Item.svelte";
  import Notice from "$lib/components/Notice.svelte";
  import Section from "$lib/components/Section.svelte";
  import Wardrobe from "$lib/components/Wardrobe.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { api, SectionName } from "$lib/shared/api";
  import { getRarityClass, renderLore } from "$lib/shared/helper";
  import { animateObfuscatedText } from "$lib/shared/mc-text/obfuscated";
  import { cn } from "$lib/shared/utils";
  import type { GearV2 } from "$types/statsv2";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { createQuery } from "@tanstack/svelte-query";
  import { ScrollArea } from "bits-ui";

  let { order }: { order: number } = $props();

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
  const profileUUID = $derived(profile.uuid);
  const profileId = $derived(profile.profile_id);

  const query = createQuery<GearV2>(() => ({
    queryKey: [SectionName.GEAR, profileUUID, profileId],
    queryFn: () => api().getSection(SectionName.GEAR, profileUUID, profileId)
  }));

  const gear = $derived.by(() => {
    if (query.isPending || query.error || !query.data) return;
    return query.data[SectionName.GEAR];
  });

  const { armor, equipment, wardrobe, weapons } = $derived(gear!);
  const firstWardrobeItems = $derived.by(() => {
    if (query.isPending || query.error || !query.data || !wardrobe) return [];
    if (wardrobe.length === 0) return [];
    return wardrobe.map((wardrobeItems) => wardrobeItems.find((piece) => piece));
  });
</script>

<Section id="Gear" {order}>
  {#if query.isPending}
    <LoaderCircle class="text-icon animate-spin" />
  {/if}
  {#if query.error}
    <Notice title="An unexpected error has occurred" type="error" error={query.error} />
  {/if}

  {#if query.isSuccess && gear}
    <Items subtitle="Armor">
      {#snippet text()}
        {#if armor.armor.length > 0 && !armor.armor.every((piece) => !piece.display_name)}
          {#if armor.set_name}
            <p class="text-text/60 space-x-0.5 leading-6 font-bold capitalize">
              <span>Set:</span>
              <span class={cn(getRarityClass(armor.set_rarity ?? "", "text"))}>{armor.set_name}</span>
            </p>
          {/if}
        {/if}
      {/snippet}

      {#if armor.armor.length > 0 && !armor.armor.every((piece) => !piece.display_name)}
        {#each armor.armor as piece, index (index)}
          {#if piece && piece.display_name}
            <Item {piece} />
          {:else}
            <EmptyEquipment {index} />
          {/if}
        {/each}
      {:else}
        <p class="space-x-0.5 leading-6">{profile.username} has no armor equipped</p>
      {/if}
      {#snippet info()}
        <Bonus stats={armor.stats} />
      {/snippet}
    </Items>

    <Items subtitle="Equipment">
      {#if equipment.equipment.length > 0}
        {#each equipment.equipment as piece, index (index)}
          <Item {piece} />
        {/each}
      {:else}
        <p class="space-x-0.5 leading-6">{profile.username} has no equipment equipped</p>
      {/if}
      {#snippet info()}
        <Bonus stats={equipment.stats} />
      {/snippet}
    </Items>

    {#if wardrobe.length > 0}
      <Items subtitle="Wardrobe">
        <div class="max-w-full">
          <!-- min height was calc by: each piece of armor was 72px with a 8px gap and scrollbar was 2.5px and some more for gap for scrollbar -->
          <ScrollArea.Root class="relative min-h-[335px]" type="auto">
            <ScrollArea.Viewport>
              <div class="flex flex-row gap-6 md:gap-3">
                {#each firstWardrobeItems as _, i (i)}
                  <div class="min-h-[4.5rem] min-w-[4.5rem]">
                    <Wardrobe wardrobeItems={wardrobe[i]} />
                  </div>
                {/each}
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="horizontal" class="mt-2 flex h-2.5 w-full touch-none rounded-full transition-all ease-out select-none">
              <ScrollArea.Thumb class="bg-icon flex rounded-full" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
          </ScrollArea.Root>
        </div>
      </Items>
    {/if}

    <Items subtitle="Weapons">
      {#snippet text()}
        {#if weapons.weapons.length}
          <div>
            {#if weapons.highest_priority_weapon?.display_name}
              <p class="font-bold" {@attach animateObfuscatedText}>
                <span class="text-text/60">Active Weapon: </span>
                {@html renderLore(weapons.highest_priority_weapon.display_name)}
              </p>
            {/if}
          </div>
        {:else}
          <p class="space-x-0.5 leading-6">{profile.username} has no weapons</p>
        {/if}
      {/snippet}

      {#if weapons.weapons.length}
        {#each weapons.weapons as weapon, index (index)}
          <Item piece={weapon} />
        {/each}
      {/if}
    </Items>
  {/if}
</Section>
