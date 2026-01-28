<script lang="ts">
  import { page } from "$app/state";
  import { getPreferences } from "$ctx";
  import HeaderInfo from "$lib/components/header/Info.svelte";
  import Settings from "$lib/components/header/settings";
  import { openCommand } from "$lib/stores/internal";
  import Search from "@lucide/svelte/icons/search";
  import { Avatar, Button } from "bits-ui";

  const preferences = getPreferences();
</script>

<header class="@container fixed top-0 left-0 z-30 h-12 w-full overflow-clip bg-header px-2.5 pt-[env(safe-area-inset-top,0)] pr-[max(0.625rem,env(safe-area-inset-right))] pb-[env(safe-area-inset-bottom,0)] pl-[max(0.625rem,env(safe-area-inset-left))] leading-[3rem]">
  <div class="flex h-full w-full justify-center @md:justify-between">
    <div class="flex gap-2">
      <Button.Root href="/" class="flex items-center justify-center gap-2 font-bold" data-sveltekit-preload="hover">
        <Avatar.Root class="size-6 shrink-0 rounded-lg select-none">
          <Avatar.Image loading="lazy" src="/img/app-icons/svg.svg" alt="SkyCrypt" class="pointer-events-none h-6 select-none" />
          <Avatar.Fallback class="flex h-full items-center justify-center text-lg font-semibold text-text/60 uppercase">SC</Avatar.Fallback>
        </Avatar.Root>
        SkyCrypt
      </Button.Root>
      <HeaderInfo />
    </div>

    {#if page.url.pathname.startsWith("/stats")}
      <div class="mx-auto my-1.5 w-full max-w-lg px-4 @[38rem]:block">
        <Button.Root class="relative flex h-full w-4/5 items-center justify-start overflow-clip rounded-[1.125rem] bg-background/20 @[38rem]:w-full" onpointerdown={() => openCommand.set(true)}>
          <div class="peer flex h-full w-full shrink items-center rounded-r-3xl bg-transparent pr-0 pl-2 text-xs font-semibold text-text/80 outline-hidden transition-[colors_border-radius_opacity] duration-300 ease-out hover:rounded-r-none hover:bg-background/20 focus-visible:rounded-r-none focus-visible:bg-background/20 focus-visible:ring-transparent focus-visible:outline-hidden @[38rem]:grow @[38rem]:pl-4 @[38rem]:text-base">Press <kbd class="mx-1 rounded-sm bg-background/20 px-1">{preferences.keybind}</kbd> to search</div>

          <div class="flex aspect-square h-full items-center justify-center rounded-full bg-background/15 transition-all duration-300 ease-out peer-hover:rounded-l-none peer-hover:bg-background/20 peer-focus-visible:rounded-l-none peer-focus-visible:bg-background/20 @[38rem]:aspect-video @[38rem]:px-4">
            <Search class="size-4 text-text @[38rem]:size-6" />
          </div>
        </Button.Root>
      </div>
    {/if}

    <Settings />
  </div>
</header>
