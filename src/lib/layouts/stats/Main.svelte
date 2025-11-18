<script lang="ts">
  import { browser } from "$app/environment";
  import { replaceState } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { getHoverContext, ProfileContext, setProfileContext } from "$ctx";
  import Item from "$lib/components/Item.svelte";
  import ItemContent from "$lib/components/item/item-content.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import AdditionalStats from "$lib/layouts/stats/AdditionalStats.svelte";
  import PlayerProfile from "$lib/layouts/stats/PlayerProfile.svelte";
  import Skills from "$lib/layouts/stats/Skills.svelte";
  import Stats from "$lib/layouts/stats/Stats.svelte";
  import Sections from "$lib/sections/Sections.svelte";
  import type { ModelsStatsOutput } from "$lib/shared/api/orval-generated";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { recentSearches } from "$lib/stores";
  import { itemContent, itemContentSpecial, showItem } from "$lib/stores/internal";
  import { performanceMode, showGlint } from "$lib/stores/preferences";
  import Image from "@lucide/svelte/icons/image";
  import { Avatar, Dialog } from "bits-ui";
  import { Pane } from "paneforge";
  import { onDestroy, tick } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import { Drawer } from "vaul-svelte";

  const { data: ctx }: { data: ModelsStatsOutput } = $props();

  const isHover = getHoverContext();

  const profile = $derived(ctx);

  let _rightSize = $state(0);
  let _leftSize = $state(0);
  let _skinCollapsed = $state(false);
  let _leftPane = $state<Pane>(null!);
  let innerWidth = $state(0);
  let _defaultLeftPanel = $derived(Math.ceil((300 / innerWidth) * 100));
  let _defaultRightPanel = $derived(Math.ceil((700 / innerWidth) * 100));

  const abortController = new AbortController();

  // Initialize the profile context
  const profileClass = new ProfileContext();
  setProfileContext(profileClass);

  function rewriteURL() {
    if (!(ctx as ModelsStatsOutput)) return;

    const { username, profile_cute_name } = ctx;
    if (!username) return;

    const current = page.url.pathname;
    const wanted = `/stats/${username}/${profile_cute_name || ""}`;

    // Update the URL to match the username and cute name
    if (current !== wanted) {
      // Only proceed if not aborted
      if (!abortController.signal.aborted) {
        tick()
          .then(() => {
            if (!abortController.signal.aborted) {
              replaceState(
                resolve("/stats/[ign]/[[profile]]", {
                  ign: username,
                  profile: profile_cute_name || ""
                }),
                page.state
              );
            }
          })
          .catch(() => {});
      }
    }
  }

  recentSearches.update((searches) => {
    if (!ctx) return searches;

    const { username, uuid } = ctx;
    if (!username || !uuid) return searches;

    // Find existing search by username/IGN and update with UUID
    const existingIndex = searches.findIndex((search) => search.ign.toLowerCase() === username.toLowerCase());

    if (existingIndex !== -1) {
      // Update existing search with UUID
      searches[existingIndex] = {
        ...searches[existingIndex],
        uuid: uuid
      };
    }

    return searches;
  });

  // Update the profile context when the data changes
  $effect(() => {
    profileClass.current = profile;
    rewriteURL();
  });

  onDestroy(() => {
    abortController.abort();
  });
</script>

<svelte:head>
  <link rel="canonical" href={`https://sky.shiiyu.moe/stats/${profile.uuid}/${profile.profile_id}`} />
  <link rel="icon" href="https://crafatar.com/avatars/{profile.uuid}?size=32&overlay" sizes="32x32" type="image/png" />
  <title>{profile.displayName} | SkyCrypt</title>
</svelte:head>

<svelte:window bind:innerWidth />

<div class="@container/parent relative">
  <!-- TODO: Re-enable paneforge once this is fixed: https://github.com/svecosystem/paneforge/issues/89 -->
  <!-- <PaneGroup id="panes" direction="horizontal" autoSaveId="paneConfig" class="relative w-full !overflow-x-clip !overflow-y-visible">
    {#if innerWidth >= 1024}
      <div class="group/pane contents">
        <Pane
          id="skinPane"
          defaultSize={defaultLeftPanel}
          collapsedSize={0}
          collapsible={true}
          order={0}
          onResize={(size) => {
            leftSize = size;
            if (size < 15) {
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
                {#if $performanceMode}
                  <Avatar.Root>
                    {#snippet child({ props })}
                      <div transition:fade={{ duration: 300, easing: cubicOut }} {...props}>
                        <Avatar.Image loading="lazy" src="https://vzge.me/full/832/{profile.uuid}.webp?no=shadow&y=-3" alt="{profile.username}'s avatar" class="max-h-[32rem] object-cover" />
                        <Avatar.Fallback>
                          <Image class="size-24 object-cover text-text" />
                        </Avatar.Fallback>
                      </div>
                    {/snippet}
                  </Avatar.Root>
                {:else if browser && innerWidth >= 1024}
                  {#await import('$lib/components/Skin3D.svelte') then { default: Skin3D }}
                    <Skin3D class="h-full" />
                  {/await}
                {/if}
              {/if}
            </div>
          </div>
        </Pane>

        <PaneResizer class="fixed top-1/2 left-(--size) z-20 flex w-2 -translate-x-1 -translate-y-[calc(50%-1.5rem)] items-center justify-center rounded-xs opacity-30 transition-opacity duration-300 ease-out group-hover/pane:opacity-100" style="--size: {leftSize}%">
          <div class="absolute h-[50dvh] w-2 rounded-xs bg-icon transition-[clip-path] duration-300 ease-out [clip-path:inset(50%_0_50%_0)] group-hover/pane:[clip-path:inset(0_0_0_0)]"></div>

          <div class="z-10 flex h-7 min-w-5 items-center justify-center rounded-sm bg-background-grey transition-colors duration-300 ease-out group-hover/pane:bg-icon">
            <GripVertical class="size-4 text-text/80" />
          </div>
        </PaneResizer>
      </div>
    {/if}

    <Pane
      id="statsPane"
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
  </PaneGroup> -->
  <!-- TODO: See the paneforge todo above  -->
  <div class="@container fixed top-1/2 left-0 z-10 hidden h-dvh w-[30vw] -translate-y-1/2 @[75rem]/parent:block">
    {#if $performanceMode}
      <Avatar.Root>
        {#snippet child({ props })}
          <div transition:fade={{ duration: 300, easing: cubicOut }} {...props}>
            <Avatar.Image loading="lazy" src="https://vzge.me/full/832/{profile.uuid}.webp?no=shadow&y=-3" alt="{profile.username}'s avatar" class="max-h-128 object-cover" />
            <Avatar.Fallback>
              <Image class="size-24 object-cover text-text" />
            </Avatar.Fallback>
          </div>
        {/snippet}
      </Avatar.Root>
    {:else if browser && innerWidth >= 1024}
      {#await import('$lib/components/Skin3D.svelte') then { default: Skin3D }}
        <Skin3D class="h-full" />
      {/await}
    {/if}
  </div>

  <div class={cn("fixed top-0 right-0 min-h-dvh w-full @[75rem]/parent:w-[calc(100%-30vw)]", $performanceMode ? "bg-background-grey" : "backdrop-blur-lg group-data-[mode=dark]/html:backdrop-brightness-50 group-data-[mode=light]/html:backdrop-brightness-100")}></div>
  <main data-vaul-drawer-wrapper class="@container relative mx-auto mt-12 @[75rem]/parent:ml-[30vw]">
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
</div>

{#if isHover.current}
  <Dialog.Root bind:open={$showItem}>
    <Dialog.Portal>
      <Dialog.Overlay forceMount class="fixed inset-0 z-40 bg-black/80">
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:fade={{ duration: 150, easing: cubicOut }}></div>
          {/if}
        {/snippet}
      </Dialog.Overlay>
      <Dialog.Content forceMount class="fixed top-[50%] left-[50%] z-50 flex max-h-[calc(96%-3rem)] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg bg-background-lore font-icomoon select-text">
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
            <div {...props} transition:fade={{ duration: 150, easing: cubicOut }}></div>
          {/if}
        {/snippet}
      </Dialog.Overlay>
      <Dialog.Content forceMount class="fixed top-[50%] left-[50%] z-50 flex max-h-[calc(96%-3rem)] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg bg-background-lore font-icomoon select-text">
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
      <Drawer.Content class="fixed right-0 bottom-0 left-0 z-50 flex max-h-[96%] flex-col rounded-t-[10px] bg-background-lore">
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
      <Drawer.Content class="fixed right-0 bottom-0 left-0 z-50 flex max-h-[96%] flex-col rounded-t-[10px] bg-background-lore">
        {@render containedItems()}
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
{/if}

{#if $showGlint}
  <svg xmlns="http://www.w3.org/2000/svg" height="0" width="0" class="fixed">
    <filter id="enchanted-glint">
      <feImage href="/img/enchanted-glint.avif"></feImage>
      <feComposite in2="SourceGraphic" operator="in"></feComposite>
      <feBlend in="SourceGraphic" mode="screen"></feBlend>
    </filter>
  </svg>
{/if}

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
            <div class="flex aspect-square items-center justify-center rounded-sm bg-text/4" onclick={() => itemContentSpecial.set(undefined)} role="none">
              <Item piece={containedItem} isInventory={true} showRecombobulated={false} showCount={true} />
            </div>
          {:else}
            <div class="aspect-square rounded-sm bg-text/4"></div>
          {/if}
        {/each}
      {/if}
    </div>
  {/if}
{/snippet}
