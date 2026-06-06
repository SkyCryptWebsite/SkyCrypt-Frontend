<script lang="ts">
  import { getHoverContext, getInternalState } from "$ctx";
  import Misc from "$lib/components/header/settings/Misc.svelte";
  import Order from "$lib/components/header/settings/Order.svelte";
  import Packs from "$lib/components/header/settings/Packs.svelte";
  import Themes from "$lib/components/header/settings/Themes.svelte";
  import { SettingsTab } from "$lib/components/header/types";
  import { flyAndScale } from "$lib/shared/utils";
  import Cog from "@lucide/svelte/icons/cog";
  import ListOrdered from "@lucide/svelte/icons/list-ordered";
  import PackageOpen from "@lucide/svelte/icons/package-open";
  import PaintBucket from "@lucide/svelte/icons/paint-bucket";
  import Settings from "@lucide/svelte/icons/settings";
  import { Dialog, Tabs } from "bits-ui";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import { Drawer } from "vaul-svelte";

  type SettingsProps = Record<string, unknown>;
  const isHover = getHoverContext();
  const internalState = getInternalState();
</script>

{#snippet settings()}
  <Tabs.Root bind:value={internalState.settingsTab}>
    <Tabs.List class="mb-4 flex justify-between rounded-lg p-2 font-semibold text-text glass glass-bg-text/30 glass-brightness-10">
      <Tabs.Trigger value={SettingsTab.Packs} class="flex shrink items-center justify-center gap-1 rounded-lg px-2.5 py-1 text-sm font-semibold data-[state=active]:bg-icon/80">
        <PackageOpen class="size-5" />
        Packs
      </Tabs.Trigger>
      <Tabs.Trigger value={SettingsTab.Themes} class="flex shrink items-center justify-center gap-1 rounded-lg px-2.5 py-1 text-sm font-semibold data-[state=active]:bg-icon/80">
        <PaintBucket class="size-5" />
        Themes
      </Tabs.Trigger>
      <Tabs.Trigger value={SettingsTab.Order} class="flex shrink items-center justify-center gap-1 rounded-lg px-2.5 py-1 text-sm font-semibold data-[state=active]:bg-icon/80">
        <ListOrdered class="size-5" />
        Order
      </Tabs.Trigger>
      <Tabs.Trigger value={SettingsTab.Misc} class="flex shrink items-center justify-center gap-1 rounded-lg px-2.5 py-1 text-sm font-semibold data-[state=active]:bg-icon/80">
        <Settings class="size-5" />
        Misc
      </Tabs.Trigger>
    </Tabs.List>
    <Packs />
    <Themes />
    <Order />
    <Misc />
  </Tabs.Root>
{/snippet}

{#snippet settingsButton(props: SettingsProps)}
  <button {...props} class="group absolute top-1/2 right-4 flex aspect-square shrink -translate-y-1/2 items-center justify-center gap-1 rounded-full bg-background/20 px-2.5 py-1.5 text-sm font-semibold text-text transition-all duration-100 ease-out @md:relative @md:top-0 @md:right-0 @md:my-1.5 @md:aspect-auto @md:translate-y-0">
    <Cog class="size-5 transition-all duration-300 ease-out data-[is-open=true]:rotate-45" data-is-open={internalState.settingsOpen} />
    <p class="hidden @md:block">Settings</p>
  </button>
{/snippet}

{#if isHover.current}
  <Dialog.Root bind:open={internalState.settingsOpen}>
    <Dialog.Trigger>
      {#snippet child({ props })}
        {@render settingsButton(props)}
      {/snippet}
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay forceMount class="fixed inset-0 z-40 glass glass-bg-background-lore">
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:fade={{ duration: 150, easing: cubicOut }}></div>
          {/if}
        {/snippet}
      </Dialog.Overlay>

      <Dialog.Content forceMount class="fixed top-[50%] left-[50%] z-50 flex max-h-[calc(96%-3rem)] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg px-8 py-4 font-icomoon select-text glass glass-standard-bg-background-grey/30 glass-bg-background-grey/95">
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:flyAndScale>
              {@render settings()}
            </div>
          {/if}
        {/snippet}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
{:else}
  <Drawer.Root shouldScaleBackground={true} setBackgroundColorOnScale={false} bind:open={internalState.settingsOpen}>
    <Drawer.Trigger>
      {#snippet child({ props })}
        {@render settingsButton(props)}
      {/snippet}
    </Drawer.Trigger>
    <Drawer.Portal>
      <Drawer.Overlay class="fixed inset-0 z-40 bg-black/80" />
      <Drawer.Content class="fixed right-0 bottom-0 left-0 z-50 flex max-h-[96%] flex-col rounded-t-[10px] bg-background-lore">
        <div class="mx-auto w-full max-w-md overflow-auto p-6">
          {@render settings()}
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
{/if}
