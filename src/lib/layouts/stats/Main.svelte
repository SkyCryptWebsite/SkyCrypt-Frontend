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
  import GripVertical from "@lucide/svelte/icons/grip-vertical";
  import { createQuery } from "@tanstack/svelte-query";
  import { Dialog } from "bits-ui";
  import { Pane, PaneGroup, PaneResizer } from "paneforge";
  import { getContext } from "svelte";
  import { fade } from "svelte/transition";
  import { Drawer } from "vaul-svelte";

  const isHover = getContext<IsHover>("isHover");

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
  const profileUUID = $derived(profile.uuid);
  const profileId = $derived(profile.profile_id);

  let rightSize = $state(0);
  let leftSize = $state(0);
  let skinCollapsed = $state(false);
  let leftPane = $state<Pane>(null!);
  let innerWidth = $state(0);
  let defaultLeftPanel = $derived(Math.ceil((300 / innerWidth) * 100));
  let defaultRightPanel = $derived(Math.ceil((700 / innerWidth) * 100));

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

<svelte:window bind:innerWidth />

<div class="@container/parent relative">
  <PaneGroup direction="horizontal" class="relative w-full !overflow-x-clip !overflow-y-visible">
    {#if innerWidth >= 1024}
      <div class="group/pane contents">
        <Pane
          defaultSize={defaultLeftPanel}
          collapsedSize={0}
          collapsible={true}
          order={0}
          onResize={(size) => {
            leftSize = size;
            if (size < 10) {
              leftPane.collapse();
              skinCollapsed = true;
            } else {
              leftPane.expand();
              skinCollapsed = false;
            }
          }}
          bind:this={leftPane}>
          <div class="relative flex h-full items-center justify-center">
            <div class="fixed top-1/2 z-10 -translate-y-1/2">
              {#if !skinCollapsed}
                {#if browser && innerWidth >= 1024}
                  {#await import('$lib/components/Skin3D.svelte') then { default: Skin3D }}
                    <Skin3D class="h-full" />
                  {/await}
                {/if}
              {/if}
            </div>
          </div>
        </Pane>

        <PaneResizer class="fixed top-1/2 left-(--size) z-20 flex w-2 -translate-x-1 -translate-y-[calc(50%-1.5rem)] items-center justify-center rounded-xs opacity-30 transition-opacity duration-300 group-hover/pane:opacity-100" style="--size: {leftSize}%">
          <div
            class="bg-icon absolute h-[50dvh] w-2
          rounded-xs transition-[clip-path] duration-300 ease-in-out [clip-path:inset(50%_0_50%_0)] group-hover/pane:[clip-path:inset(0_0_0_0)]">
          </div>

          <div class="bg-background-grey group-hover/pane:bg-icon z-10 flex h-7 min-w-5 items-center justify-center rounded-sm transition-colors duration-300">
            <GripVertical class="text-text/80 size-4" />
          </div>
        </PaneResizer>
      </div>
    {/if}

    <Pane
      defaultSize={defaultRightPanel}
      class="relative z-10 !overflow-x-clip !overflow-y-visible"
      order={1}
      onResize={(size) => {
        rightSize = size;
      }}>
      <div class={cn("fixed top-0 right-0 h-dvh w-(--width)", $performanceMode ? "bg-background-grey" : "backdrop-blur-lg group-data-[mode=dark]/html:backdrop-brightness-50 group-data-[mode=light]/html:backdrop-brightness-100")} style="--width: {skinCollapsed ? 100 : rightSize}%"></div>
      <main data-vaul-drawer-wrapper class="@container relative mx-auto mt-12">
        <div class="space-y-5 p-4 @[75rem]/parent:p-8">
          <PlayerProfile />
          <Skills />
          <Stats />
          <AdditionalStats />
        </div>

        <Navbar>
          <Sections />
        </Navbar>
      </main>
    </Pane>
  </PaneGroup>
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
      <Dialog.Content forceMount class="bg-background-lore font-icomoon fixed top-[50%] left-[50%] z-50 flex max-h-[calc(96%-3rem)] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg select-text">
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
      <Dialog.Content forceMount class="bg-background-lore font-icomoon fixed top-[50%] left-[50%] z-50 flex max-h-[calc(96%-3rem)] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg select-text">
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
      <Drawer.Content class="bg-background-lore fixed right-0 bottom-0 left-0 z-50 flex max-h-[96%] flex-col rounded-t-[10px]">
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
      <Drawer.Content class="bg-background-lore fixed right-0 bottom-0 left-0 z-50 flex max-h-[96%] flex-col rounded-t-[10px]">
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
    <div class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 @md:gap-1.5 @xl:gap-2">
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
