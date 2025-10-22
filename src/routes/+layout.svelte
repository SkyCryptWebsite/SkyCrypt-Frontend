<script lang="ts">
  import { browser, dev } from "$app/environment";
  import { beforeNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { PacksContext, setHoverContext, setMobileContext, setPacksContext } from "$ctx";
  import Header from "$lib/components/header/Header.svelte";
  import { SettingsTab } from "$lib/components/header/types";
  import PerformanceMode from "$lib/components/PerformanceMode.svelte";
  import { IsHover } from "$lib/hooks/is-hover.svelte";
  import { IsMobile } from "$lib/hooks/is-mobile.svelte";
  import { getPacks, searchUser } from "$lib/shared/api/skycrypt-api.remote";
  import themes from "$lib/shared/constants/themes";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { favorites } from "$lib/stores/favorites";
  import { content, openCommand, settingsOpen, settingsTab } from "$lib/stores/internal";
  import { keybind, performanceMode, showGlint } from "$lib/stores/preferences";
  import { recentSearches } from "$lib/stores/searches";
  import { theme as themeStore } from "$lib/stores/themes";
  import BookOpenText from "@lucide/svelte/icons/book-open-text";
  import CircleAlert from "@lucide/svelte/icons/circle-alert";
  import Fan from "@lucide/svelte/icons/fan";
  import Keyboard from "@lucide/svelte/icons/keyboard";
  import ListOrdered from "@lucide/svelte/icons/list-ordered";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import PackageOpen from "@lucide/svelte/icons/package-open";
  import PaintBucket from "@lucide/svelte/icons/paint-bucket";
  import Search from "@lucide/svelte/icons/search";
  import Sparkle from "@lucide/svelte/icons/sparkle";
  import Wifi from "@lucide/svelte/icons/wifi";
  import WifiOff from "@lucide/svelte/icons/wifi-off";
  import { isHttpError, type RemoteQuery } from "@sveltejs/kit";
  import { Avatar, Button, Command, computeCommandScore, Dialog, Tooltip } from "bits-ui";
  import { onMount, type Snippet } from "svelte";
  import SvelteSeo from "svelte-seo";
  import { toast, Toaster, type ToasterProps } from "svelte-sonner";
  import { cubicOut } from "svelte/easing";
  import { writable } from "svelte/store";
  import { fade } from "svelte/transition";
  import { Drawer } from "vaul-svelte";
  import "../app.css";
  import { schema } from "./schema";

  let { children }: { children: Snippet } = $props();
  let isMobile = $state(new IsMobile());
  let isHover = $state(new IsHover());
  let toastId: string | number = $state(0);
  let commandInput = $state<HTMLElement>(null!);
  let loading = $state(false);
  let commandValue = $state(null!);

  let searchQuery = $state<string>("");
  const searchQueryValidated = $derived(schema.safeParse({ query: searchQuery }));

  let searchUserRemoteFn = $state<RemoteQuery<never>>();

  const { ign } = page.params;

  const position = writable<ToasterProps["position"]>("bottom-right");
  const theme = writable<ToasterProps["theme"]>("dark");
  const noEmbedUrls = ["/og/", "/stats/"];
  const packs = new PacksContext();

  function updateOnlineStatus() {
    toast.dismiss(toastId);
    toastId = toast.loading("Checking connection status...");
    setTimeout(() => {
      if (navigator.onLine) {
        toast.dismiss(toastId);
        toastId = toast.success("You are now online!", {
          icon: Wifi,
          description: "Connection has been restored!",
          duration: 5000
        });
      } else {
        toast.dismiss(toastId);
        toastId = toast.error("You are now offline!", {
          icon: WifiOff,
          description: "Please check your connection and try again.",
          duration: 5000
        });
      }
    }, 1000);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === $keybind) {
      e.preventDefault();
      openCommand.set(true);
    }
  }

  function customFilter(commandValue: string, search: string, commandKeywords?: string[]): number {
    const score = computeCommandScore(commandValue, search, commandKeywords);
    // Always show the actions and search commands
    if (commandValue === "search" || commandValue === "actions") {
      return 0.98; // High score to ensure these commands are always shown
    }
    return score;
  }

  function closeCommand() {
    openCommand.set(false);
    commandValue = null!;
    searchQuery = "";
  }

  function handleSettingTab(tab: SettingsTab) {
    settingsTab.set(tab);
    closeCommand();
    settingsOpen.set(true);
  }

  setMobileContext(isMobile);
  setHoverContext(isHover);
  setPacksContext(packs);

  themeStore.subscribe((newTheme) => theme.set(themes.find((theme) => theme.id === newTheme)?.light ? "light" : "dark"));

  onMount(() => {
    if (window.innerWidth <= 600) {
      position.set("bottom-center");
    }
  });

  beforeNavigate(({ type }) => {
    if (type === "leave" || type === "link") return;
    loading = true;
    if (!searchQueryValidated.success) return;
    if (searchQuery.trim() !== "") {
      recentSearches.update((searches) => [...new Set([{ ign: searchQuery.trim() }, ...searches])].slice(0, 5));
    }
    setTimeout(() => {
      loading = false;
      openCommand.set(false);
    }, 1000);
  });

  beforeNavigate(({ willUnload, to }) => {
    if (!willUnload && to?.url) {
      location.href = to.url.href;
    }
  });

  $effect(() => {
    const packsDataRemoteFunction = getPacks();
    const packsData = packsDataRemoteFunction.current;
    if (packsData) packs.packs = packsData;
  });
</script>

<svelte:document onkeydown={handleKeydown} />
<svelte:window
  onresize={() => {
    if (window.innerWidth <= 600) {
      position.set("bottom-center");
    } else {
      position.set("bottom-right");
    }
  }}
  ononline={updateOnlineStatus}
  onoffline={updateOnlineStatus} />

<svelte:head>
  {#if !noEmbedUrls.some((url) => page.url.pathname.startsWith(url))}
    <link rel="icon" href="/favicon.png" sizes="32x32" type="image/png" />
  {/if}
</svelte:head>

{#if !noEmbedUrls.some((url) => page.url.pathname.startsWith(url))}
  <SvelteSeo
    title="SkyCrypt"
    description="A beautiful site for sharing your SkyBlock profile 🍣"
    canonical="https://sky.shiiyu.moe/"
    openGraph={{
      title: "SkyBlock Stats",
      description: "A beautiful site for sharing your SkyBlock profile 🍣",
      site_name: "SkyCrypt",
      // @ts-expect-error It accepts any property
      image: "/img/app-icons/svg.svg"
    }}
    themeColor={themes.find((theme) => theme.id === $themeStore)?.light ? "#dbdbdb" : "#282828"}
    manifest="/manifest.webmanifest" />
{/if}

<Toaster
  theme={$theme}
  closeButton={isHover.current}
  position={$position}
  class="sm:mr-8"
  toastOptions={{
    class: cn("gap-2! font-semibold! group rounded-lg! text-text/80! border-none!", $performanceMode ? "bg-background-grey!" : "backdrop-blur-lg! backdrop-brightness-50! bg-transparent!"),
    classes: {
      closeButton: "text-text/80! border-none! hover:opacity-60! bg-background-grey! hover:bg-background-grey!",
      description: "text-pretty! font-medium!",
      title: "text-pretty! font-semibold!"
    }
  }} />

{#if page.url.origin.includes("cupcake") || dev}
  {#await import("$lib/components/BetaNotice.svelte") then { default: BetaNotice }}
    <BetaNotice />
  {/await}
{/if}

{#if browser && !$performanceMode}
  <PerformanceMode />
{/if}

<div class="pointer-events-none fixed inset-0 z-[-1] h-dvh w-screen [background-image:var(--bg-url)] bg-cover bg-scroll bg-center bg-no-repeat"></div>

<Header />

<Tooltip.Provider delayDuration={0}>
  {@render children()}
</Tooltip.Provider>

<Dialog.Root bind:open={$openCommand}>
  <Dialog.Portal>
    <Dialog.Overlay forceMount class={cn("fixed inset-0 z-40", $performanceMode ? "bg-background-lore" : "backdrop-blur-lg backdrop-brightness-50")}>
      {#snippet child({ props, open })}
        {#if open}
          <div {...props} transition:fade={{ duration: 150, easing: cubicOut }}></div>
        {/if}
      {/snippet}
    </Dialog.Overlay>
    <Dialog.Content
      forceMount
      class={cn("fixed top-[50%] left-[50%] z-50 flex max-h-[calc(96%-3rem)] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg font-icomoon select-text", $performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-50")}
      onOpenAutoFocus={(e) => {
        e.preventDefault();
        commandInput?.focus();
      }}>
      {#snippet child({ props, open })}
        {#if open}
          <div {...props} transition:flyAndScale>
            {@render command()}
          </div>
        {/if}
      {/snippet}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

{#if !isHover.current}
  <Drawer.Root
    bind:open={() => !!$content, (v) => v}
    shouldScaleBackground={false}
    setBackgroundColorOnScale={false}
    onOpenChange={(open) => {
      if (!open) content.set(undefined);
    }}>
    <Drawer.Portal>
      <Drawer.Overlay class="fixed inset-0 z-40 bg-black/80" />
      <Drawer.Content class="fixed right-0 bottom-0 left-0 z-50 flex max-h-[96%] flex-col rounded-t-[10px] bg-background-lore">
        <div class="mx-auto w-full max-w-md overflow-auto p-6">
          {@render $content?.()}
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
{/if}

{#snippet command()}
  <div class="relative flex h-full w-4/5 items-center justify-start overflow-clip rounded-[1.125rem] bg-background/20 @[38rem]:w-full">
    <input type="search" required class="hidden" bind:value={searchQuery} />
  </div>
  <Command.Root bind:value={commandValue} class="flex h-full w-full flex-col divide-y divide-icon/30 self-start overflow-hidden rounded-lg" filter={customFilter}>
    <div class="flex h-12 items-center">
      <Button.Root
        type="button"
        class="flex aspect-square h-full  items-center justify-center text-text"
        onclick={() => {
          searchUserRemoteFn = searchUser({ username: searchQuery });
        }}>
        {#if !searchQueryValidated.success && searchQuery.length > 0}
          <CircleAlert class="size-4" />
        {:else if searchUserRemoteFn?.loading || loading}
          <LoaderCircle class="size-4 animate-spin" />
        {:else}
          <Search class="size-4" />
        {/if}
      </Button.Root>
      <Command.Input
        class="inline-flex h-12 w-full truncate rounded-tl-lg rounded-tr-lg pr-4 text-base text-text transition-colors ease-out placeholder:text-text/50 focus:ring-0 focus:outline-hidden"
        placeholder="Search for something..."
        type="search"
        required
        bind:value={searchQuery}
        bind:ref={commandInput}
        onkeydown={(e) => {
          if (commandValue && commandValue !== "search") return;
          const k = e.key.toLowerCase();
          if (k === "enter" || k === "search") {
            e.preventDefault();
            searchUserRemoteFn = searchUser({ username: searchQuery });
          }
        }} />
    </div>

    <Command.List class="max-h-120 overflow-x-hidden overflow-y-auto px-2 pb-2">
      <Command.Viewport>
        <Command.Empty class="text-muted-foreground flex w-full items-center justify-center pt-8 pb-6 text-sm">
          {#if searchUserRemoteFn?.error}
            {isHttpError(searchUserRemoteFn.error) ? searchUserRemoteFn.error.body.message : "Something went wrong"}
          {:else}
            Press Enter to search
          {/if}
        </Command.Empty>

        {#if $recentSearches.length !== 0}
          <Command.Group>
            <Command.GroupHeading class="text-muted-foreground px-3 pt-4 pb-2 text-xs">Recent Searches</Command.GroupHeading>
            <Command.GroupItems>
              {#each $recentSearches.slice(0, 5) as recentSearch, index (index)}
                {#if !ign || recentSearch.ign !== ign}
                  <Command.LinkItem value={recentSearch.ign} href="/stats/{recentSearch.ign}" class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", $performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")} keywords={[recentSearch.ign, "profile", "player", "favorite", "favorites"]}>
                    <Avatar.Root class="size-4 shrink-0 bg-text/10">
                      <Avatar.Image loading="lazy" src={recentSearch.uuid ? `https://crafatar.com/avatars/${recentSearch.uuid}?size=64&overlay` : "https://mc-heads.net/avatar/bc8ea1f51f253ff5142ca11ae45193a4ad8c3ab5e9c6eec8ba7a4fcb7bac40/64"} alt={recentSearch.ign} class="aspect-square size-4 [image-rendering:pixelated]" />
                      <Avatar.Fallback class="flex h-full items-center justify-center text-lg font-semibold text-text/60 uppercase">
                        {recentSearch.ign.slice(0, 2)}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    {recentSearch.ign}
                  </Command.LinkItem>
                {/if}
              {/each}
            </Command.GroupItems>
          </Command.Group>
        {/if}
        <Command.Separator class="bg-foreground/5 h-px w-full" />
        {#if $favorites.length !== 0 && (!ign || !$favorites.some((f) => f.ign === ign))}
          <Command.Group>
            <Command.GroupHeading class="text-muted-foreground px-3 pt-4 pb-2 text-xs">Favorites</Command.GroupHeading>
            <Command.GroupItems>
              {#each $favorites.slice(0, 5) as favorite, index (index)}
                {#if !ign || favorite.ign !== ign}
                  <Command.LinkItem value={favorite.ign} href="/stats/{favorite.ign}" class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", $performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")} keywords={[favorite.ign, favorite.uuid, "profile", "player", "favorite", "favorites"]}>
                    <Avatar.Root class="size-4 shrink-0 bg-text/10">
                      <Avatar.Image loading="lazy" src={`https://crafatar.com/avatars/${favorite.uuid}?size=64&overlay`} alt={favorite.ign} class="aspect-square size-4 [image-rendering:pixelated]" />
                      <Avatar.Fallback class="flex h-full items-center justify-center text-lg font-semibold text-text/60 uppercase">
                        {favorite.ign.slice(0, 2)}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    {favorite.ign}
                  </Command.LinkItem>
                {/if}
              {/each}
            </Command.GroupItems>
          </Command.Group>
        {/if}
        <Command.Separator class="bg-foreground/5 h-px w-full" />

        {#if searchQuery.length}
          <Command.Group>
            <Command.GroupHeading class="text-muted-foreground px-3 pt-4 pb-2 text-xs">Actions</Command.GroupHeading>
            <Command.GroupItems>
              <Command.Item
                value="search"
                class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", $performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")}
                keywords={[searchQuery, "search", "find", "profile"]}
                onSelect={() => {
                  searchUserRemoteFn = searchUser({ username: searchQuery });
                }}>
                {#if searchUserRemoteFn?.loading || loading}
                  <LoaderCircle class="size-4 animate-spin" />
                {:else}
                  <Search class="size-4 text-text" />
                {/if}

                {#if searchUserRemoteFn?.error}
                  {isHttpError(searchUserRemoteFn.error) ? searchUserRemoteFn.error.body.message : "Something went wrong"}
                {:else}
                  Search for {searchQuery}
                {/if}
              </Command.Item>
            </Command.GroupItems>
          </Command.Group>
        {/if}
        <Command.Separator class="bg-foreground/5 h-px w-full" />

        <Command.Group>
          <Command.GroupHeading class="text-muted-foreground px-3 pt-4 pb-2 text-xs">Settings</Command.GroupHeading>
          <Command.GroupItems>
            <Command.Item value="packs" class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", $performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")} keywords={["packs", "change", "settings"]} onSelect={() => handleSettingTab(SettingsTab.Packs)}>
              <div class="rounded-lg bg-icon/80 p-1">
                <PackageOpen class="size-4" />
              </div>
              Change Packs
            </Command.Item>
            <Command.Item value="themes" class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", $performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")} keywords={["themes", "change", "settings"]} onSelect={() => handleSettingTab(SettingsTab.Themes)}>
              <div class="rounded-lg bg-icon/80 p-1">
                <PaintBucket class="size-4" />
              </div>
              Change Theme
            </Command.Item>
            <Command.Item value="section-order" class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", $performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")} keywords={["order", "change", "section", "settings"]} onSelect={() => handleSettingTab(SettingsTab.Order)}>
              <div class="rounded-lg bg-icon/80 p-1">
                <ListOrdered class="size-4" />
              </div>
              Change Section Order
            </Command.Item>
            <Command.Item value="wiki-order" class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", $performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")} keywords={["order", "misc", "change", "wiki", "settings"]} onSelect={() => handleSettingTab(SettingsTab.Misc)}>
              <div class="rounded-lg bg-icon/80 p-1">
                <BookOpenText class="size-4" />
              </div>
              Change Wiki Order
            </Command.Item>
            <Command.Item value="keybind" class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", $performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")} keywords={["keybind", "misc", "change", "command", "settings"]} onSelect={() => handleSettingTab(SettingsTab.Misc)}>
              <div class="rounded-lg bg-icon/80 p-1">
                <Keyboard class="size-4" />
              </div>
              Change Command Keybind
            </Command.Item>
            <Command.Item
              value="performance-mode"
              class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", $performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")}
              keywords={["performance", "mode", "toggle", "settings"]}
              onSelect={() => {
                performanceMode.set(!$performanceMode);
                closeCommand();
              }}>
              <div class="rounded-lg bg-icon/80 p-1">
                <Fan class="size-4 will-change-transform data-[performance=false]:animate-spin-slow data-[performance=true]:animate-spin" data-performance={$performanceMode} />
              </div>
              Toggle Performance Mode
            </Command.Item>
            <Command.Item
              value="glint"
              class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", $performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")}
              keywords={["glint", "toggle", "settings"]}
              onSelect={() => {
                showGlint.set(!$showGlint);
                closeCommand();
              }}>
              <div class="rounded-lg bg-icon/80 p-1">
                <Sparkle class="size-4" />
              </div>
              Toggle Glint
            </Command.Item>
          </Command.GroupItems>
        </Command.Group>
      </Command.Viewport>
    </Command.List>
  </Command.Root>
{/snippet}
