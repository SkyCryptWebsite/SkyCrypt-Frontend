<script lang="ts">
  import { getProfileContext } from "$ctx";
  import Bonus from "$lib/components/Bonus.svelte";
  import EmptyEquipment from "$lib/components/EmptyEquipment.svelte";
  import Item from "$lib/components/Item.svelte";
  import Section from "$lib/components/Section.svelte";
  import Wardrobe from "$lib/components/Wardrobe.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { getGearSection } from "$lib/shared/api/skycrypt-api.remote";
  import { getRarityClass, renderLore } from "$lib/shared/helper";
  import { animateObfuscatedText } from "$lib/shared/mc-text/obfuscated";
  import { cn } from "$lib/shared/utils";
  import { ScrollArea } from "bits-ui";

  let { order }: { order: number } = $props();

  const ctx = getProfileContext();
  const profile = $derived(ctx);
  const profileUUID = $derived(profile.uuid);
  const profileId = $derived(profile.profile_id);

  const { armor, equipment, wardrobe, weapons } = $derived(await getGearSection({ uuid: profileUUID!, profileId: profileId! }));
  const firstWardrobeItems = $derived.by(() => {
    if (wardrobe?.length === 0) return [];
    return wardrobe?.map((wardrobeItems) => wardrobeItems.find((piece) => piece));
  });

  $effect.pre(() => {
    if (!profileUUID || !profileId) {
      throw new Error("Profile UUID or Profile ID is missing");
    }
  });
</script>

<Section id="Gear" {order}>
  {#if armor && armor.armor}
    <Items subtitle="Armor">
      {#snippet text()}
        {#if armor && armor.armor}
          {#if armor.armor.length > 0 && !armor.armor.every((piece) => !piece.display_name)}
            {#if armor.set_name}
              <p class="text-text/60 space-x-0.5 leading-6 font-bold capitalize">
                <span>Set:</span>
                <span class={cn(getRarityClass(armor.set_rarity ?? "", "text"))}>{armor.set_name}</span>
              </p>
            {/if}
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
        {#if armor.stats}
          <Bonus stats={armor.stats} />
        {/if}
      {/snippet}
    </Items>
  {/if}

  {#if equipment}
    <Items subtitle="Equipment">
      {#if equipment.equipment && equipment.equipment.length > 0}
        {#each equipment.equipment as piece, index (index)}
          <Item {piece} />
        {/each}
      {:else}
        <p class="space-x-0.5 leading-6">{profile.username} has no equipment equipped</p>
      {/if}
      {#snippet info()}
        {#if equipment.stats}
          <Bonus stats={equipment.stats} />
        {/if}
      {/snippet}
    </Items>
  {/if}

  {#if wardrobe && wardrobe.length > 0}
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

  {#if weapons}
    <Items subtitle="Weapons">
      {#snippet text()}
        {#if weapons.weapons && weapons.weapons.length}
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

      {#if weapons.weapons && weapons.weapons.length}
        {#each weapons.weapons as weapon, index (index)}
          <Item piece={weapon} />
        {/each}
      {/if}
    </Items>
  {/if}
</Section>
