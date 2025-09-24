<script lang="ts">
  import { SettingsTab } from "$lib/components/header/types";
  import type { IsHover } from "$lib/hooks/is-hover.svelte";
  import { sections } from "$lib/sections/constants";
  import { packConfigs } from "$lib/shared/constants/packs";
  import type { Theme } from "$lib/shared/constants/themes";
  import themes from "$lib/shared/constants/themes";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { settingsOpen, settingsTab } from "$lib/stores/internal";
  import { disabledPacks } from "$lib/stores/packs";
  import { keybind, performanceMode, rainbowEnchantments, sectionOrderPreferences, showGlint } from "$lib/stores/preferences";
  import { theme as themeStore } from "$lib/stores/themes";
  import { wikiOrderPreferences } from "$lib/stores/wiki";
  import BookOpenText from "@lucide/svelte/icons/book-open-text";
  import Check from "@lucide/svelte/icons/check";
  import Cog from "@lucide/svelte/icons/cog";
  import Fan from "@lucide/svelte/icons/fan";
  import GripVertical from "@lucide/svelte/icons/grip-vertical";
  import Keyboard from "@lucide/svelte/icons/keyboard";
  import ListOrdered from "@lucide/svelte/icons/list-ordered";
  import PackageOpen from "@lucide/svelte/icons/package-open";
  import PaintBucket from "@lucide/svelte/icons/paint-bucket";
  import Rainbow from "@lucide/svelte/icons/rainbow";
  import Settings from "@lucide/svelte/icons/settings";
  import Settings2 from "@lucide/svelte/icons/settings-2";
  import Sparkle from "@lucide/svelte/icons/sparkle";
  import { Avatar, Button, Label, Popover, RadioGroup, Separator, Switch, Tabs } from "bits-ui";
  import { getContext, onMount } from "svelte";
  import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import { cubicOut } from "svelte/easing";
  import { derived, get } from "svelte/store";
  import { fade } from "svelte/transition";
  import { Drawer } from "vaul-svelte";

  let isListening = $state(false);

  const isHover = getContext<IsHover>("isHover");

  const initialPackConfig = get(disabledPacks);
  const hasPackConfigChanged = derived(disabledPacks, ($disabledPacks) => {
    return JSON.stringify($disabledPacks.sort()) !== JSON.stringify(initialPackConfig.sort());
  });

  const defaultSectionOrder = sections;
  const initialSectionOrderPreferences = get(sectionOrderPreferences);
  const differsFromDefault = derived(sectionOrderPreferences, ($sectionOrderPreferences) => {
    return JSON.stringify($sectionOrderPreferences) !== JSON.stringify(defaultSectionOrder);
  });

  let sectionOrder = $state(initialSectionOrderPreferences);

  const initialWikiOrderPreferences = get(wikiOrderPreferences);

  let wikiOrder = $state(initialWikiOrderPreferences);

  function changeTheme(themeId: Theme["id"]) {
    const theme = themes.find((theme) => theme.id === themeId);
    if (!theme) {
      themeStore.set("default");
      document.documentElement.dataset.theme = "default";
      return;
    }
    if (theme.light) {
      document.documentElement.dataset.mode = "light";
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.dataset.mode = "dark";
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }

    document.documentElement.dataset.theme = theme.id;
  }

  function handleKeybindKeydown(e: KeyboardEvent) {
    if (isListening) {
      e.preventDefault();
      e.stopPropagation();
      const key = e.key;
      if (key.length === 1 && key.match(/[a-zA-Z0-9/\\.,;'"`~!@#$%^&*()_+\-=[\]{}|:<>?]/)) {
        keybind.set(key);
        isListening = false;
      } else if (key === "Escape") {
        isListening = false;
        keybind.set($keybind || "/");
      }
    }
  }

  function handleKeybindClick() {
    isListening = true;
    setTimeout(() => {
      if (isListening) {
        isListening = false;
      }
    }, 5000);
  }

  function toggleRainbow() {
    const show = get(rainbowEnchantments);
    if (show) {
      document.documentElement.dataset.rainbow = "true";
    } else {
      document.documentElement.dataset.rainbow = "false";
    }
  }

  onMount(() => {
    changeTheme($themeStore);
    toggleRainbow();
  });
</script>

{#snippet settings()}
  <Tabs.Root bind:value={$settingsTab}>
    <Tabs.List class={cn("text-text mb-4 flex justify-between rounded-lg p-2 font-semibold", $performanceMode ? "bg-text/30" : "backdrop-blur-lg backdrop-brightness-10")}>
      <Tabs.Trigger value={SettingsTab.Packs} class="data-[state=active]:bg-icon/80 flex shrink items-center justify-center gap-1 rounded-lg px-2.5 py-1 text-sm font-semibold">
        <PackageOpen class="size-5" />
        Packs
      </Tabs.Trigger>
      <Tabs.Trigger value={SettingsTab.Themes} class="data-[state=active]:bg-icon/80 flex shrink items-center justify-center gap-1 rounded-lg px-2.5 py-1 text-sm font-semibold">
        <PaintBucket class="size-5" />
        Themes
      </Tabs.Trigger>
      <Tabs.Trigger value={SettingsTab.Order} class="data-[state=active]:bg-icon/80 flex shrink items-center justify-center gap-1 rounded-lg px-2.5 py-1 text-sm font-semibold">
        <ListOrdered class="size-5" />
        Order
      </Tabs.Trigger>
      <Tabs.Trigger value={SettingsTab.Misc} class="data-[state=active]:bg-icon/80 flex shrink items-center justify-center gap-1 rounded-lg px-2.5 py-1 text-sm font-semibold">
        <Settings class="size-5" />
        Misc
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value={SettingsTab.Packs}>
      <div class="flex max-h-96 flex-col gap-4 overflow-x-clip overflow-y-auto">
        {#each packConfigs as pack (pack.id)}
          <Label.Root for={pack.id} class="bg-text/[0.05] flex items-center justify-between gap-4 rounded-lg p-2">
            <div class="flex items-center gap-2">
              <Avatar.Root class="shrink-0 select-none">
                <Avatar.Image loading="lazy" src="/resourcepacks/{pack.folder}/pack.png" alt={pack.name} class="pointer-events-none aspect-square size-10 h-full rounded-lg select-none [image-rendering:pixelated]" />
                <Avatar.Fallback class="flex items-center rounded-lg text-center font-semibold uppercase">{pack.name.slice(0, 2)}</Avatar.Fallback>
              </Avatar.Root>
              <div class="flex flex-col">
                <h4 class="text-text/90 font-semibold">{pack.name} <small>{pack.version}</small></h4>
                <p class="text-text/60 overflow-hidden font-normal text-ellipsis whitespace-nowrap">
                  by
                  <span class="text-text/80">{pack.author}</span>
                </p>
              </div>
            </div>
            <Switch.Root id={pack.id} checked={!$disabledPacks.includes(pack.id)} class="data-[state=checked]:bg-icon data-[state=unchecked]:bg-text/30 peer inline-flex h-6 min-h-6 w-10 shrink-0 cursor-pointer items-center rounded-full px-0 transition-colors ease-out" onCheckedChange={() => disabledPacks.update((value) => (!value.includes(pack.id) ? [...new Set([...value, pack.id])] : value.filter((id) => id !== pack.id)))}>
              <Switch.Thumb class="bg-text pointer-events-none block size-4 shrink-0 rounded-full transition-transform ease-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-1" />
            </Switch.Root>
          </Label.Root>
        {/each}
      </div>
      {#if $hasPackConfigChanged}
        <Button.Root
          class="bg-text/65 text-background/80 hover:bg-text/80 mt-4 w-full rounded-lg p-1.5 text-sm font-semibold uppercase transition-colors ease-out"
          onclick={() => {
            document.cookie = `disabledPacks=${JSON.stringify($disabledPacks)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
            window.location.reload();
          }}>
          Reload to apply changes
        </Button.Root>
      {/if}
    </Tabs.Content>
    <Tabs.Content value={SettingsTab.Themes}>
      <RadioGroup.Root class="flex max-h-96 flex-col gap-4 overflow-x-clip overflow-y-auto" bind:value={$themeStore} onValueChange={changeTheme}>
        {#each themes as theme (theme.id)}
          <Label.Root for={theme.id} class="bg-text/[0.05] flex items-center justify-between gap-4 rounded-lg p-2">
            <div class="flex items-center gap-2">
              <Avatar.Root class="shrink-0 select-none">
                <Avatar.Image loading="lazy" src={`/api/themes/${btoa(theme["colors"]!.logo)}${theme.light ? "/true" : ""}/logo.svg`} alt={theme.name} class="pointer-events-none aspect-square size-10 h-full rounded-lg select-none"></Avatar.Image>
                <Avatar.Fallback class="flex items-center rounded-lg text-center font-semibold uppercase">{theme.name.slice(0, 2)}</Avatar.Fallback>
              </Avatar.Root>
              <div class="flex flex-col">
                <h4 class="text-text/90 font-semibold">{theme.name}</h4>
                <p class="text-text/60 overflow-hidden font-normal text-ellipsis whitespace-nowrap">
                  by
                  <span class="text-text/80">{theme.author}</span>
                </p>
              </div>
            </div>
            <RadioGroup.Item id={theme.id} value={theme.id} class="group inline-flex h-6 min-h-6 w-10 shrink-0 cursor-pointer items-center rounded-full px-0 transition-colors ease-out">
              <Check class="text-icon size-6 group-data-[state=unchecked]:invisible" />
            </RadioGroup.Item>
          </Label.Root>
        {/each}
      </RadioGroup.Root>
    </Tabs.Content>
    <Tabs.Content value={SettingsTab.Order}>
      <div
        class="flex max-h-96 flex-col gap-4 overflow-x-clip overflow-y-auto"
        use:dndzone={{ items: sectionOrder, flipDurationMs: 300, dropTargetStyle: {} }}
        onconsider={(e) => (sectionOrder = e.detail.items)}
        onfinalize={(e) => {
          sectionOrderPreferences.set(e.detail.items);
          sectionOrder = e.detail.items;
        }}>
        {#each sectionOrder as section (section.id)}
          {@const normalizedName = section.name.replaceAll("_", " ")}
          <div animate:flip={{ duration: 300, easing: cubicOut }} class="bg-text/[0.05] relative flex items-center gap-2 rounded-lg p-2 font-semibold">
            <GripVertical class="text-text/60 size-5" />
            {normalizedName}
            {#if SHADOW_ITEM_MARKER_PROPERTY_NAME in section && section[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
              <div in:fade={{ duration: 300, easing: cubicOut }} class="bg-text/[0.05] visible absolute inset-0 flex animate-pulse items-center gap-2 rounded-lg p-2 font-semibold opacity-30">
                <GripVertical class="text-text/60 size-5" />
                {normalizedName}
              </div>
            {/if}
          </div>
        {/each}
      </div>
      {#if $differsFromDefault}
        <Button.Root
          class="bg-text/65 text-background/80 hover:bg-text/80 mt-4 w-full rounded-lg p-1.5 text-sm font-semibold uppercase transition-colors ease-out"
          onclick={() => {
            sectionOrderPreferences.set(defaultSectionOrder);
          }}>
          Reset to default
        </Button.Root>
      {/if}
    </Tabs.Content>
    <Tabs.Content value={SettingsTab.Misc} class="space-y-6">
      <div class="flex max-h-96 flex-col gap-4 overflow-x-clip overflow-y-auto">
        <div class="bg-text/[0.05] space-y-4 rounded-lg p-4">
          <h4 class="flex items-center gap-2 rounded-lg p-2 font-semibold">
            <Settings2 class="size-5" />
            Misc Settings
          </h4>
          <Label.Root for="performance" class="bg-text/[0.05] flex items-center justify-between gap-4 rounded-lg p-2">
            <div class="flex items-center gap-2">
              <Fan class="data-[performance=false]:animate-spin-slow size-6 will-change-transform data-[performance=true]:animate-spin" data-performance={$performanceMode} />
              <div class="flex flex-col">
                <h4 class="text-text/90 font-semibold">Performance Mode</h4>
              </div>
            </div>
            <Switch.Root id="performance" checked={$performanceMode} class="data-[state=checked]:bg-icon data-[state=unchecked]:bg-text/30 peer inline-flex h-6 min-h-6 w-10 shrink-0 cursor-pointer items-center rounded-full px-0 transition-colors ease-out" onCheckedChange={() => performanceMode.update((value) => !value)}>
              <Switch.Thumb class="bg-text pointer-events-none block size-4 shrink-0 rounded-full transition-transform ease-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-1" />
            </Switch.Root>
          </Label.Root>

          <Label.Root for="glint" class="bg-text/[0.05] flex items-center justify-between gap-4 rounded-lg p-2">
            <div class="flex items-center gap-2">
              <Sparkle class="size-6" />
              <div class="flex flex-col">
                <h4 class="text-text/90 font-semibold">Show Glint</h4>
              </div>
            </div>
            <Switch.Root id="glint" checked={$showGlint} class="data-[state=checked]:bg-icon data-[state=unchecked]:bg-text/30 peer inline-flex h-6 min-h-6 w-10 shrink-0 cursor-pointer items-center rounded-full px-0 transition-colors ease-out" onCheckedChange={() => showGlint.update((value) => !value)}>
              <Switch.Thumb class="bg-text pointer-events-none block size-4 shrink-0 rounded-full transition-transform ease-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-1" />
            </Switch.Root>
          </Label.Root>

          <Label.Root for="rainbow" class="bg-text/[0.05] flex items-center justify-between gap-4 rounded-lg p-2">
            <div class="flex items-center gap-2">
              <Rainbow class="size-6" />
              <div class="flex flex-col">
                <h4 class="text-text/90 font-semibold">Rainbow Colors</h4>
              </div>
            </div>
            <Switch.Root
              id="rainbow"
              checked={$rainbowEnchantments}
              class="data-[state=checked]:bg-icon data-[state=unchecked]:bg-text/30 peer inline-flex h-6 min-h-6 w-10 shrink-0 cursor-pointer items-center rounded-full px-0 transition-colors ease-out"
              onCheckedChange={() => {
                rainbowEnchantments.update((value) => !value);
                toggleRainbow();
              }}>
              <Switch.Thumb class="bg-text pointer-events-none block size-4 shrink-0 rounded-full transition-transform ease-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-1" />
            </Switch.Root>
          </Label.Root>

          <div class="bg-text/[0.05] flex items-center justify-between gap-4 rounded-lg p-2">
            <div class="flex items-center gap-2">
              <Keyboard class="size-6 " />
              <div class="flex flex-col">
                <h4 class="text-text/90 font-semibold">Keybind</h4>
              </div>
            </div>
            <Button.Root class="bg-text/10 hover:bg-text/20 border-text/20 text-text/90 focus:ring-icon/50 flex h-8 min-w-8 items-center justify-center rounded-md border px-2 py-1 font-mono text-sm font-semibold transition-colors ease-out focus:ring-2 focus:outline-none" onclick={handleKeybindClick} onkeydown={handleKeybindKeydown} tabindex={0}>
              {#if isListening}
                <span class="text-icon animate-pulse">Press a key</span>
              {:else}
                <span class="min-w-2 text-center">{$keybind}</span>
              {/if}
            </Button.Root>
          </div>
        </div>
        <Separator.Root class="bg-icon/30 shrink-0 data-[orientation=horizontal]:h-0.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-0.5" />
        <div class="bg-text/[0.05] space-y-4 rounded-lg p-4">
          <h4 class="flex items-center gap-2 rounded-lg p-2 font-semibold">
            <BookOpenText class="size-5" />
            Wiki Order
          </h4>
          <div
            class="flex max-h-96 flex-col gap-4 overflow-x-clip overflow-y-auto"
            use:dndzone={{ items: wikiOrder, flipDurationMs: 300, dropTargetStyle: {} }}
            onconsider={(e) => (wikiOrder = e.detail.items)}
            onfinalize={(e) => {
              wikiOrderPreferences.set(e.detail.items);
              wikiOrder = e.detail.items;
            }}>
            {#each wikiOrder as wiki (wiki.id)}
              {@const normalizedName = wiki.name.replaceAll("_", " ")}
              <div animate:flip={{ duration: 300, easing: cubicOut }} class="bg-text/[0.05] relative flex items-center gap-2 rounded-lg p-2 font-semibold">
                <GripVertical class="text-text/60 size-5" />
                {normalizedName}
                {#if SHADOW_ITEM_MARKER_PROPERTY_NAME in wiki && wiki[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
                  <div in:fade={{ duration: 300, easing: cubicOut }} class="bg-text/[0.05] visible absolute inset-0 flex animate-pulse items-center gap-2 rounded-lg p-2 font-semibold opacity-30">
                    <GripVertical class="text-text/60 size-5" />
                    {normalizedName}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
          {#if $differsFromDefault}
            <Button.Root
              class="bg-text/65 text-background/80 hover:bg-text/80 mt-4 w-full rounded-lg p-1.5 text-sm font-semibold uppercase transition-colors ease-out"
              onclick={() => {
                sectionOrderPreferences.set(defaultSectionOrder);
              }}>
              Reset to default
            </Button.Root>
          {/if}
        </div>
      </div>
    </Tabs.Content>
  </Tabs.Root>
{/snippet}

{#snippet settingsButton(props: Record<string, unknown>)}
  <button {...props} class="bg-background/20 text-text group absolute top-1/2 right-4 flex aspect-square shrink -translate-y-1/2 items-center justify-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-semibold transition-all duration-100 ease-out @md:relative @md:top-0 @md:right-0 @md:my-1.5 @md:aspect-auto @md:translate-y-0">
    <Cog class="size-5 transition-all duration-300 ease-out data-[is-open=true]:rotate-45" data-is-open={$settingsOpen} />
    <p class="hidden @md:block">Settings</p>
  </button>
{/snippet}

{#if isHover.current}
  <Popover.Root bind:open={$settingsOpen}>
    <Popover.Trigger>
      {#snippet child({ props })}
        {@render settingsButton(props)}
      {/snippet}
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content forceMount side="bottom" sideOffset={8} align="center" collisionPadding={8} class={cn("z-30 min-w-[32rem] rounded-lg px-8 py-4", $performanceMode ? "bg-background-grey/95" : "bg-background-grey/30 backdrop-blur-lg backdrop-brightness-50")}>
        {#snippet child({ wrapperProps, props, open })}
          {#if open}
            <div {...wrapperProps}>
              <div {...props} transition:flyAndScale>
                {@render settings()}
              </div>
            </div>
          {/if}
        {/snippet}
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
{:else}
  <Drawer.Root shouldScaleBackground={true} setBackgroundColorOnScale={false} bind:open={$settingsOpen}>
    <Drawer.Trigger>
      {#snippet child({ props })}
        {@render settingsButton(props)}
      {/snippet}
    </Drawer.Trigger>
    <Drawer.Portal>
      <Drawer.Overlay class="fixed inset-0 z-40 bg-black/80" />
      <Drawer.Content class="bg-background-lore fixed right-0 bottom-0 left-0 z-50 flex max-h-[96%] flex-col rounded-t-[10px]">
        <div class="mx-auto w-full max-w-md overflow-auto p-6">
          {@render settings()}
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
{/if}
