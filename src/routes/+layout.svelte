<script lang="ts">
  import { browser, dev } from "$app/environment";
  import { beforeNavigate } from "$app/navigation";
  import { page, updated } from "$app/state";
  import { initDisabledPacks, initPreferences, initTheme, initWikiOrder, PacksContext, setHoverContext, setMobileContext, setPacksContext } from "$ctx";
  import { initInternalState } from "$ctx/internal.svelte";
  import CommandPalette from "$lib/components/misc/CommandPalette.svelte";
  import Header from "$lib/components/header/Header.svelte";
  import PerformanceMode from "$lib/components/misc/PerformanceMode.svelte";
  import { IsHover } from "$lib/hooks/is-hover.svelte";
  import { IsMobile } from "$lib/hooks/is-mobile.svelte";
  import { getPacks } from "$lib/shared/api/skycrypt-api.remote";
  import themes from "$lib/shared/constants/themes";
  import { cn } from "$lib/shared/utils";
  import Wifi from "@lucide/svelte/icons/wifi";
  import WifiOff from "@lucide/svelte/icons/wifi-off";
  import { Tooltip } from "bits-ui";
  import { onMount, type Snippet } from "svelte";
  import SvelteSeo from "svelte-seo";
  import { toast, Toaster, type ToasterProps } from "svelte-sonner";
  import { writable } from "svelte/store";
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
  initWikiOrder();

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
    themeColor={themes.find((theme) => theme.id === themeContext.current)?.light ? "#dbdbdb" : "#282828"}
    manifest="/manifest.webmanifest" />
{/if}

<Toaster
  theme={$theme}
  closeButton={isHover.current}
  position={$position}
  class="sm:mr-8"
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
