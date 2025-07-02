<script lang="ts">
  import { browser, dev } from "$app/environment";
  import { page } from "$app/state";
  import Header from "$lib/components/header/Header.svelte";
  import PerformanceMode from "$lib/components/PerformanceMode.svelte";
  import { IsHover } from "$lib/hooks/is-hover.svelte";
  import { IsMobile } from "$lib/hooks/is-mobile.svelte";
  import themes from "$lib/shared/constants/themes";
  import { cn } from "$lib/shared/utils";
  import { content } from "$lib/stores/internal";
  import { performanceMode } from "$lib/stores/preferences";
  import { theme as themeStore } from "$lib/stores/themes";
  import Wifi from "@lucide/svelte/icons/wifi";
  import WifiOff from "@lucide/svelte/icons/wifi-off";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import { Tooltip } from "bits-ui";
  import { onMount, setContext, type Snippet } from "svelte";
  import SvelteSeo from "svelte-seo";
  import { Toaster, toast, type ToasterProps } from "svelte-sonner";
  import { writable } from "svelte/store";
  import { Drawer } from "vaul-svelte";
  import "../app.css";
  import type { PageData } from "./$types";

  const position = writable<ToasterProps["position"]>("bottom-right");
  const theme = writable<ToasterProps["theme"]>("dark");

  let { data, children }: { data: PageData; children: Snippet } = $props();
  let isMobile = $state(new IsMobile());
  let isHover = $state(new IsHover());
  let toastId: string | number = $state(0);

  setContext("isMobile", isMobile);
  setContext("isHover", isHover);

  themeStore.subscribe((newTheme) => theme.set(themes.find((theme) => theme.id === newTheme)?.light ? "light" : "dark"));

  onMount(() => {
    if (window.innerWidth <= 600) {
      position.set("bottom-center");
    }

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

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  });
</script>

<svelte:window
  onresize={() => {
    if (window.innerWidth <= 600) {
      position.set("bottom-center");
    } else {
      position.set("bottom-right");
    }
  }} />

<svelte:head>
  {#if !page.url.pathname.startsWith("/stats")}
    <link rel="icon" href="/favicon.png" />
  {/if}
</svelte:head>

{#if !page.url.pathname.startsWith("/stats")}
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

<Header />

{#if browser && !$performanceMode}
  <PerformanceMode />
{/if}

<div class="pointer-events-none fixed inset-0 z-[-1] h-dvh w-screen [background-image:var(--bg-url)] bg-cover bg-scroll bg-center bg-no-repeat"></div>

<QueryClientProvider client={data.queryClient}>
  <Tooltip.Provider delayDuration={0}>
    {@render children()}
  </Tooltip.Provider>
  {#if dev}
    <SvelteQueryDevtools />
  {/if}
</QueryClientProvider>

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
      <Drawer.Content class="bg-background-lore fixed right-0 bottom-0 left-0 z-50 flex max-h-[96%] flex-col rounded-t-[10px]">
        <div class="mx-auto w-full max-w-md overflow-auto p-6">
          {@render $content?.()}
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
{/if}
