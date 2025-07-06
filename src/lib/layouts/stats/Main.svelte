<script lang="ts">
  import { browser } from "$app/environment";
  import { getProfileCtx } from "$ctx/profile.svelte";
  import Item from "$lib/components/Item.svelte";
  import ItemContent from "$lib/components/item/item-content.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import { IsHover } from "$lib/hooks/is-hover.svelte";
  import AdditionalStats from "$lib/layouts/stats/AdditionalStats.svelte";
  import PlayerProfile from "$lib/layouts/stats/PlayerProfile.svelte";
  import Skills from "$lib/layouts/stats/Skills.svelte";
  import Stats from "$lib/layouts/stats/Stats.svelte";
  import Sections from "$lib/sections/Sections.svelte";
  import { api, SectionName } from "$lib/shared/api";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { itemContent, itemContentSpecial, showItem } from "$lib/stores/internal";
  import { performanceMode } from "$lib/stores/preferences";
  import type { EmbedV2 } from "$types/statsv2";
  import { createQuery } from "@tanstack/svelte-query";
  import { Dialog } from "bits-ui";
  import { getContext } from "svelte";
  import { fade } from "svelte/transition";
  import { Drawer } from "vaul-svelte";

  const isHover = getContext<IsHover>("isHover");

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
  const profileUUID = $derived(profile.uuid);
  const profileId = $derived(profile.profile_id);

  const query = createQuery<EmbedV2>({
    queryKey: [SectionName.EMBED, profileUUID, profileId],
    queryFn: () => api(fetch).getSection(SectionName.EMBED, profileUUID, profileId),
    enabled: false
  });

  setTimeout(() => {
    if (profileUUID && profileId) {
      $query.refetch();
    }
  }, 3000);

  const embedData = $derived.by(() => {
    if ($query.isPending || $query.error || !$query.data) return;
    return $query.data;
  });
</script>

{#if embedData}
  <SEO {embedData} />
{/if}

<div class="@container/parent relative">
  <div class="@container @[75rem]/parent:block fixed left-0 top-1/2 z-10 hidden h-dvh w-[30vw] -translate-y-1/2">
    {#if browser && window.innerWidth >= 1200}
      {#await import('$lib/components/Skin3D.svelte') then { default: Skin3D }}
        <Skin3D class="h-full" />
      {/await}
    {/if}
  </div>

  <div class={cn("@[75rem]/parent:w-[calc(100%-30vw)] fixed right-0 top-0 min-h-dvh w-full", $performanceMode ? "bg-background-grey" : "backdrop-blur-lg group-data-[mode=dark]/html:backdrop-brightness-50 group-data-[mode=light]/html:backdrop-brightness-100")}></div>

  <main data-vaul-drawer-wrapper class="@container @[75rem]/parent:ml-[30vw] relative mx-auto mt-12">
    <div class="@[75rem]/parent:p-8 space-y-5 p-4">
      <PlayerProfile />
      <Skills />
      <Stats />
      <AdditionalStats />
    </div>

    <Navbar>
      <Sections />
    </Navbar>
  </main>
</div>

{#if isHover.current}
  <Dialog.Root bind:open={$showItem}>
    <Dialog.Portal>
      <Dialog.Overlay forceMount class="fixed inset-0 z-40 bg-black/80">
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:fade={{ duration: 150 }}></div>
          {/if}
        {/snippet}
      </Dialog.Overlay>
      <Dialog.Content forceMount class="bg-background-lore font-icomoon fixed left-[50%] top-[50%] z-50 flex max-h-[calc(96%-3rem)] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 -translate-y-1/2 select-text flex-col overflow-hidden rounded-lg">
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:flyAndScale>
              <ItemContent piece={$itemContent!} />
            </div>
          {/if}
        {/snippet}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  <Dialog.Root
    bind:open={() => $itemContentSpecial !== undefined, (open) => open}
    onOpenChange={(open) => {
      if (!open) {
        itemContentSpecial.set(undefined);
      }
    }}>
    <Dialog.Portal>
      <Dialog.Overlay forceMount class="fixed inset-0 z-40 bg-black/80">
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:fade={{ duration: 150 }}></div>
          {/if}
        {/snippet}
      </Dialog.Overlay>
      <Dialog.Content forceMount class="bg-background-lore font-icomoon fixed left-[50%] top-[50%] z-50 flex max-h-[calc(96%-3rem)] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 -translate-y-1/2 select-text flex-col overflow-hidden rounded-lg">
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:flyAndScale>
              {@render containedItems()}
            </div>
          {/if}
        {/snippet}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
{:else}
  <Drawer.Root bind:open={$showItem} shouldScaleBackground={true} setBackgroundColorOnScale={false}>
    <Drawer.Portal>
      <Drawer.Overlay class="fixed inset-0 z-40 bg-black/80" />
      <Drawer.Content class="bg-background-lore fixed bottom-0 left-0 right-0 z-50 flex max-h-[96%] flex-col rounded-t-[10px]">
        <ItemContent piece={$itemContent!} isDrawer={true} />
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
  <Drawer.Root
    bind:open={() => $itemContentSpecial !== undefined, (open) => open}
    shouldScaleBackground={false}
    setBackgroundColorOnScale={false}
    onOpenChange={(open) => {
      if (!open) {
        itemContentSpecial.set(undefined);
      }
    }}>
    <Drawer.Portal>
      <Drawer.Overlay class="fixed inset-0 z-40 bg-black/80" />
      <Drawer.Content class="bg-background-lore fixed bottom-0 left-0 right-0 z-50 flex max-h-[96%] flex-col rounded-t-[10px]">
        {@render containedItems()}
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
{/if}

<svg xmlns="http://www.w3.org/2000/svg" height="0" width="0" class="fixed">
  <filter id="enchanted-glint">
    <feImage href="/img/enchanted-glint.png" />
    <feComposite in2="SourceGraphic" operator="in" />
    <feBlend in="SourceGraphic" mode="screen" />
  </filter>
</svg>

{#snippet containedItems()}
  {#if $itemContentSpecial}
    <div class="@md:gap-1.5 @xl:gap-2 grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1">
      {#if $itemContentSpecial.containsItems && $itemContentSpecial.containsItems.length !== 0}
        {#each $itemContentSpecial.containsItems as containedItem, index (index)}
          {#if index > 0}
            {#if index % 54 === 0}
              <hr class="col-span-full h-4 border-0" />
            {/if}
          {/if}
          {#if containedItem.texture_path}
            <div class="bg-text/[0.04] flex aspect-square items-center justify-center rounded-sm" onclick={() => itemContentSpecial.set(undefined)} role="none">
              <Item piece={containedItem} isInventory={true} showRecombobulated={false} showCount={true} />
            </div>
          {:else}
            <div class="bg-text/[0.04] aspect-square rounded-sm"></div>
          {/if}
        {/each}
      {/if}
    </div>
  {/if}
{/snippet}
