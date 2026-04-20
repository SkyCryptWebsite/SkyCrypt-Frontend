<script lang="ts">
  import { browser, dev } from "$app/environment";
  import { beforeNavigate, replaceState } from "$app/navigation";
  import { page, updated } from "$app/state";
  import { initDisabledPacks, initFavorites, initInternalState, initPreferences, initRecentSearches, initTheme, PacksContext, setHoverContext, setMobileContext, setPacksContext } from "$ctx";
  import Header from "$lib/components/header/Header.svelte";
  import { CommandPalette, PerformanceMode } from "$lib/components/misc";
  import ThemeEditor from "$lib/components/theme-editor/ThemeEditor.svelte";
  import { IsHover } from "$lib/hooks/is-hover.svelte";
  import { IsMobile } from "$lib/hooks/is-mobile.svelte";
  import { getPacks } from "$lib/shared/api/skycrypt-api.remote";
  import { parseThemeFromURL } from "$lib/shared/themes/sharing";
  import { cn } from "$lib/shared/utils";
  import Wifi from "@lucide/svelte/icons/wifi";
  import WifiOff from "@lucide/svelte/icons/wifi-off";
  import { Tooltip } from "bits-ui";
  import { onMount, type Snippet } from "svelte";
  import SvelteSeo from "svelte-seo";
  import { toast, Toaster, type ToasterProps } from "svelte-sonner";
  import { SvelteURLSearchParams } from "svelte/reactivity";
  import { writable } from "svelte/store";
  import { fly } from "svelte/transition";
  import { Drawer } from "vaul-svelte";
  import "../app.css";

  let { children }: { children: Snippet } = $props();
  let isMobile = $state(new IsMobile());
  let isHover = $state(new IsHover());
  let toastId: string | number = $state(0);
  let commandLoading = $state(false);
  const { ign } = $derived(page.params);
  const preferences = initPreferences();
  const themeContext = initTheme();
  const internalState = initInternalState();
  const position = writable<ToasterProps["position"]>("bottom-right");
  const theme = writable<ToasterProps["theme"]>("dark");
  const noEmbedUrls = ["/stats/"];
  const packs = new PacksContext();
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://sky.shiiyu.moe/#website",
    name: "SkyCrypt",
    url: "https://sky.shiiyu.moe",
    description: "A beautiful site for sharing your SkyBlock profile 🍣",
    publisher: {
      "@type": "Organization",
      "@id": "https://sky.shiiyu.moe/#organization",
      name: "SkyCrypt",
      url: "https://sky.shiiyu.moe",
      logo: "https://sky.shiiyu.moe/img/app-icons/svg.svg"
    }
  } as const;

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
    if (e.key === preferences.keybind) {
      e.preventDefault();
      internalState.openCommand = true;
    }
  }

  initDisabledPacks();
  initFavorites();
  initRecentSearches();
  setMobileContext(isMobile);
  setHoverContext(isHover);
  setPacksContext(packs);

  onMount(() => {
    if (window.innerWidth <= 600) {
      position.set("bottom-center");
    }
  });

  beforeNavigate(({ type }) => {
    if (type === "leave" || type === "link") return;

    commandLoading = true;

    setTimeout(() => {
      commandLoading = false;
      internalState.openCommand = false;
    }, 1000);
  });

  beforeNavigate(({ willUnload, to }) => {
    if (updated.current && !willUnload && to?.url) {
      location.href = to.url.href;
    }
  });

  $effect.pre(() => {
    const urlParams = new SvelteURLSearchParams(window.location.search);
    const themeParam = urlParams.get("theme");
    if (themeParam) {
      toast.promise(
        parseThemeFromURL(window.location.href)
          .then((decoded) => {
            if (decoded) {
              themeContext.saveTheme(decoded);
              internalState.themeEditorId = decoded.metadata.id;
              internalState.themeEditorOpen = true;
            }
          })
          .catch((err) => {
            console.error("Failed to decode theme from URL:", err);
          })
          .finally(() => {
            // Clean up URL to prevent re-parsing on reload
            urlParams.delete("theme");
            const newUrl = `${page.url.pathname}${urlParams.toString() ? "?" + urlParams.toString() : ""}${page.url.hash}`;
            // eslint-disable-next-line svelte/no-navigation-without-resolve
            replaceState(newUrl, page.state);
          }),
        {
          loading: "Importing theme...",
          success: "Theme imported successfully!",
          error: "Failed to import theme."
        }
      );
    }
    return () => {
      // Clean up URL on unmount just in case
      const urlParams = new SvelteURLSearchParams(window.location.search);
      if (urlParams.has("theme")) {
        urlParams.delete("theme");
        const newUrl = `${page.url.pathname}${urlParams.toString() ? "?" + urlParams.toString() : ""}${page.url.hash}`;
        // eslint-disable-next-line svelte/no-navigation-without-resolve
        replaceState(newUrl, page.state);
      }
    };
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
    jsonLd={websiteJsonLd}
    openGraph={{
      title: "SkyBlock Stats",
      description: "A beautiful site for sharing your SkyBlock profile 🍣",
      site_name: "SkyCrypt",
      // @ts-expect-error It accepts any property
      image: "/img/app-icons/svg.svg"
    }}
    themeColor={themeContext.activeTheme?.light ? "#dbdbdb" : "#282828"}
    manifest="/manifest.webmanifest" />
{/if}

<Toaster
  theme={$theme}
  closeButton={isHover.current}
  position={$position}
  class="sm:mr-8"
  pauseWhenPageIsHidden={true}
  toastOptions={{
    class: cn("gap-2! font-semibold! group rounded-lg! text-text/80! border-none!", preferences.performanceMode ? "bg-background-grey!" : "backdrop-blur-lg! backdrop-brightness-50! bg-transparent!"),

    classes: {
      closeButton: "text-text/80! border-none! hover:opacity-60! bg-background-grey! hover:bg-background-grey!",
      description: "text-pretty! font-medium!",
      title: "text-pretty! font-semibold!"
    }
  }} />

{#if page.url.origin.includes("cupcake") || dev}
  {#await import("$lib/components/notices/BetaNotice.svelte") then { default: BetaNotice }}
    <BetaNotice />
  {/await}
{/if}

{#if browser && !preferences.performanceMode}
  <PerformanceMode />
{/if}

<div class="pointer-events-none fixed inset-0 z-[-1] h-dvh w-screen [background-image:var(--bg-url)] bg-cover bg-scroll bg-center bg-no-repeat"></div>

<Header />
<Tooltip.Provider delayDuration={0}>
  {@render children()}
</Tooltip.Provider>
<CommandPalette {ign} bind:loading={commandLoading} />

{#if internalState.themeEditorOpen && !isMobile.current}
  <div class={cn("fixed left-0 isolate z-40 h-[calc(100dvh-3rem)] w-[30vw]", preferences.performanceMode ? "bg-background-grey" : "backdrop-blur-lg group-data-[mode=dark]/html:backdrop-brightness-50 group-data-[mode=light]/html:backdrop-brightness-100")} transition:fly={{ x: -300, duration: 300 }}>
    <ThemeEditor />
  </div>
{/if}

{#if isMobile.current}
  <Drawer.Root bind:open={internalState.themeEditorOpen} shouldScaleBackground={true}>
    <Drawer.Portal>
      <Drawer.Overlay class="fixed inset-0 z-40 bg-black/80" />
      <Drawer.Content class="fixed right-0 bottom-0 left-0 z-50 flex h-[90dvh] flex-col rounded-t-[10px] bg-background-lore outline-none">
        <div class="mx-auto mt-4 mb-4 h-1.5 w-12 shrink-0 rounded-full bg-text/10"></div>
        <div class="flex-1 overflow-hidden">
          <ThemeEditor />
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
{/if}

{#if !isHover.current}
  <Drawer.Root
    bind:open={() => !!internalState.content, (v) => v}
    shouldScaleBackground={false}
    setBackgroundColorOnScale={false}
    onOpenChange={(open) => {
      if (!open) internalState.content = undefined;
    }}>
    <Drawer.Portal>
      <Drawer.Overlay class="fixed inset-0 z-40 bg-black/80" />

      <Drawer.Content class="fixed right-0 bottom-0 left-0 z-50 flex max-h-[96%] flex-col rounded-t-[10px] bg-background-lore">
        <div class="mx-auto w-full max-w-md overflow-auto p-6">
          {@render internalState.content?.()}
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
{/if}
