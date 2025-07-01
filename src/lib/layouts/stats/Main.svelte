<script lang="ts">
  import { browser } from "$app/environment";
  import ItemContent from "$lib/components/item/item-content.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import { IsHover } from "$lib/hooks/is-hover.svelte";
  import AdditionalStats from "$lib/layouts/stats/AdditionalStats.svelte";
  import PlayerProfile from "$lib/layouts/stats/PlayerProfile.svelte";
  import Skills from "$lib/layouts/stats/Skills.svelte";
  import Stats from "$lib/layouts/stats/Stats.svelte";
  import Sections from "$lib/sections/Sections.svelte";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { itemContent, showItem, showItemTooltip, tooltipAnchor } from "$lib/stores/internal";
  import { performanceMode } from "$lib/stores/preferences";
  import { Dialog, Tooltip } from "bits-ui";
  import { getContext } from "svelte";
  import { fade } from "svelte/transition";
  import { Drawer } from "vaul-svelte";

  const isHover = getContext<IsHover>("isHover");
</script>

<SEO />

<div class="@container/parent relative">
  <div class="@container fixed top-1/2 left-0 z-10 hidden h-dvh w-[30vw] -translate-y-1/2 @[75rem]/parent:block">
    {#if browser && window.innerWidth >= 1200}
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

    <Navbar />

    <div class="flex flex-col flex-nowrap gap-y-5 px-4 pb-4 @[75rem]/parent:px-8 @[75rem]/parent:pb-8">
      <Sections />
    </div>
  </main>
</div>

<Tooltip.Root bind:open={$showItemTooltip} disableHoverableContent={true} ignoreNonKeyboardFocus={true} delayDuration={100}>
  <Tooltip.Portal>
    {#if isHover.current}
      <Tooltip.Content forceMount class="bg-background-lore font-icomoon z-50 flex max-h-[calc(96vh-3rem)] max-w-lg flex-col overflow-clip rounded-lg select-text" sideOffset={8} side="right" align="center" customAnchor={$tooltipAnchor}>
        {#snippet child({ wrapperProps, props, open })}
          {#if open}
            <div {...wrapperProps}>
              <div {...props} transition:flyAndScale={{ y: 8, duration: 150 }}>
                <ItemContent piece={$itemContent!} />
              </div>
            </div>
          {/if}
        {/snippet}
      </Tooltip.Content>
    {/if}
  </Tooltip.Portal>
</Tooltip.Root>

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
            <div {...props} transition:flyAndScale={{ y: 8, duration: 150 }}>
              <ItemContent piece={$itemContent!} />
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
{/if}

<svg xmlns="http://www.w3.org/2000/svg" height="0" width="0" class="fixed">
  <filter id="enchanted-glint">
    <feImage href="/img/enchanted-glint.png" />
    <feComposite in2="SourceGraphic" operator="in" />
    <feBlend in="SourceGraphic" mode="screen" />
  </filter>
</svg>
