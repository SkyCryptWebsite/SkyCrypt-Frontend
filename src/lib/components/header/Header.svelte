<script lang="ts">
  import { dev } from "$app/environment";
  import { page } from "$app/state";
  import { getInternalState, getPreferences, getTheme } from "$ctx";
  import HeaderInfo from "$lib/components/header/Info.svelte";
  import Settings from "$lib/components/header/settings";
  import { getThemeIcons } from "$lib/shared/api/themes.remote";
  import Search from "@lucide/svelte/icons/search";
  import { Avatar, Button } from "bits-ui";

  const preferences = getPreferences();
  const internalState = getInternalState();
  const theme = getTheme();
  const themeIcon = $derived(getThemeIcons({ color: theme.activeTheme?.colors?.logo, invert: theme.activeTheme?.light }).current);

  const packageVersion = __NPM_PACKAGE_VERSION__;
</script>

<div class="invisible h-12 w-full"></div>
<header class="@container fixed top-0 left-0 z-30 h-12 w-full overflow-clip bg-header px-2.5 pt-[env(safe-area-inset-top,0)] pr-[max(0.625rem,env(safe-area-inset-right))] pb-[env(safe-area-inset-bottom,0)] pl-[max(0.625rem,env(safe-area-inset-left))] leading-12">
  <div class="flex h-full w-full justify-center @md:justify-between">
    <div class="flex gap-2">
      <Button.Root href="/" class="flex items-center justify-center gap-2 font-bold" data-sveltekit-preload-data="hover">
        <Avatar.Root class="size-6 shrink-0 rounded-lg select-none">
          {#if themeIcon}
            <Avatar.Image loading="lazy" src="data:image/svg+xml;base64,{btoa(themeIcon)}" alt="SkyCrypt" class="pointer-events-none h-6 select-none" />
          {:else}
            <Avatar.Image loading="lazy" src="/img/app-icons/svg.svg" alt="SkyCrypt" class="pointer-events-none h-6 select-none" />
          {/if}

          <Avatar.Fallback class="flex h-full items-center justify-center text-lg font-semibold text-text/60 uppercase">SC</Avatar.Fallback>
        </Avatar.Root>
      </Button.Root>
      <div class="flex flex-col items-center-safe justify-center-safe gap-1">
        <Button.Root href="/" class="leading-none font-bold" data-sveltekit-preload-data="hover">
          SkyCrypt
          {#if page.url.origin.includes("cupcake") || dev}
            Beta
          {/if}
        </Button.Root>

        {#if packageVersion}
          <Button.Root class="text-xs leading-none font-normal text-text/60 transition-colors hover:text-link/60 data-[cupcake=true]:text-yellow-500/60 data-[cupcake=true]:hover:text-yellow-500" rel="noreferrer" href="https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/releases/tag/v{packageVersion}" target="_blank" data-cupcake={page.url.origin.includes("cupcake") || dev}>v{packageVersion}</Button.Root>
        {/if}
      </div>
      <HeaderInfo />
    </div>

    {#if page.url.pathname.startsWith("/stats")}
      <div class="mx-auto my-1.5 w-full max-w-lg px-4 @[38rem]:block">
        <Button.Root class="relative mx-auto flex h-full items-center justify-start overflow-clip rounded-[1.125rem] bg-background/20 @[26rem]:w-4/5 @[38rem]:w-full" onpointerdown={() => (internalState.openCommand = true)}>
          <div class="peer hidden h-full w-full shrink items-center rounded-r-3xl bg-transparent pr-0 pl-2 text-xs font-semibold whitespace-nowrap text-text/80 outline-hidden transition-[colors_border-radius_opacity] duration-300 ease-out hover:rounded-r-none hover:bg-background/20 focus-visible:rounded-r-none focus-visible:bg-background/20 focus-visible:ring-transparent focus-visible:outline-hidden @[26rem]:flex @[38rem]:grow @[38rem]:pl-4 @[38rem]:text-base">Press <kbd class="mx-1 rounded-sm bg-background/20 px-1">{preferences.keybind}</kbd> to search</div>

          <div class="flex aspect-square h-full items-center justify-center rounded-full bg-background/15 transition-all duration-300 ease-out peer-hover:rounded-l-none peer-hover:bg-background/20 peer-focus-visible:rounded-l-none peer-focus-visible:bg-background/20 @[38rem]:aspect-video @[38rem]:px-4">
            <Search class="size-4 text-text @[38rem]:size-6" />
          </div>
        </Button.Root>
      </div>
    {/if}

    <Settings />
  </div>
</header>
