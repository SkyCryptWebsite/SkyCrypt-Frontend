<script lang="ts">
  import { replaceState } from "$app/navigation";
  import { page } from "$app/state";
  import { getProfileCtx } from "$ctx/profile.svelte";
  import type { SectionName } from "$lib/sections/types";
  import { tabValue } from "$lib/stores/internal";
  import { sectionOrderPreferences } from "$lib/stores/preferences";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import { Button, ScrollArea } from "bits-ui";
  import { onDestroy, onMount, tick, type Snippet } from "svelte";
  const { children }: { children?: Snippet } = $props();

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);

  const apiSettings = $derived(Object.entries(profile.apiSettings).filter(([_, value]) => !value));
  const disabledApiSettings: string[] = $derived(apiSettings.map(([key]) => key));

  const filteredSectionOrderPreferences = $derived(
    $sectionOrderPreferences.filter((section) => {
      if (section.name === "Inventory" && disabledApiSettings.includes("inventory")) {
        return false;
      }
      return true;
    })
  );

  const previousSection = $derived(
    filteredSectionOrderPreferences.find((_, index) => {
      return index === filteredSectionOrderPreferences.findIndex((s) => s.name === $tabValue) - 1;
    })
  );

  const nextSection = $derived(
    filteredSectionOrderPreferences.find((_, index) => {
      return index === filteredSectionOrderPreferences.findIndex((s) => s.name === $tabValue) + 1;
    })
  );

  let pinned = $state(false);
  let navbarElement = $state<HTMLDivElement | null>(null);
  let observer: IntersectionObserver;

  let allLinks = $derived(
    filteredSectionOrderPreferences.reduce(
      (acc: Record<string, HTMLAnchorElement | null>, section) => {
        acc[section.name] = null;
        return acc;
      },
      {} as Record<string, HTMLAnchorElement | null>
    )
  );

  function handleSectionClick(sectionName: SectionName) {
    tabValue.set(sectionName);
    scrollToTab({ element: allLinks[sectionName], smooth: true });
  }

  function scrollToTab({
    element,
    smooth = true,
    options
  }: {
    element?: HTMLElement | null;
    smooth?: boolean;
    options?: ScrollIntoViewOptions;
  } = {}) {
    const scrollOptions = options ?? {
      behavior: smooth ? "smooth" : "auto",
      block: "center",
      inline: "center"
    };

    const link = element ?? document.querySelector<HTMLAnchorElement>(`button[data-id="${$tabValue}"]`);

    if (link == null) {
      console.warn(`could not scroll to ${location.hash} tab because it does not exist`, link);
      return;
    }

    link.scrollIntoView(scrollOptions);
  }

  function observerInit() {
    if (!navbarElement) {
      console.warn("Navbar element is not defined");
      return;
    }

    const topValue = parseInt(window.getComputedStyle(navbarElement).getPropertyValue("top"));

    observer = new IntersectionObserver(
      ([e]) => {
        // Check if the element has reached its sticky position by comparing
        // its actual top position to the CSS top value
        const hasReachedStickyPosition = e.boundingClientRect.top <= topValue;
        pinned = hasReachedStickyPosition && e.intersectionRatio < 1;
      },
      {
        threshold: [1],
        rootMargin: `-${topValue + 1}px 0px` // shrink the viewport to element top value +1px to trigger observer when element has reach it's sticky position
      }
    );

    observer.observe(navbarElement);
  }

  function observerCleanup() {
    if (observer) observer.disconnect();
  }

  onMount(() => {
    observerInit();
    return () => {
      observerCleanup();
    };
  });

  onDestroy(() => {
    observerCleanup();
  });

  // Effect to handle tab value changes and update URL
  $effect(() => {
    if (navbarElement && $tabValue) {
      tick().then(() => {
        scrollToTab({ element: allLinks[$tabValue], smooth: true });
        // eslint-disable-next-line svelte/no-navigation-without-resolve
        replaceState("#" + $tabValue, page.state);
      });
    }
  });
</script>

<ScrollArea.Root type="always" class="navbar group !sticky top-[calc(3rem+env(safe-area-inset-top,0))] z-20 overflow-clip" data-pinned={pinned} bind:ref={navbarElement}>
  <ScrollArea.Viewport>
    <div class="text-text/80 flex! flex-nowrap items-center gap-2 pb-2 font-semibold whitespace-nowrap">
      <div class="bg-icon absolute bottom-[0.4375rem] z-1 h-[2px] w-[calc(100%+0.5rem)]"></div>
      <div class="absolute inset-0 bottom-2 group-data-[pinned=true]:group-data-[mode=dark]/html:bg-[oklch(19.13%_0_0)]/90 group-data-[pinned=true]:group-data-[mode=light]/html:bg-[oklch(95.51%_0_0)]/92"></div>
      {#each filteredSectionOrderPreferences as section, index (index)}
        <Button.Root class="after:bg-icon data-[active=true]:text-text relative px-2 py-3 after:absolute after:top-full after:left-0 after:h-0 after:w-full after:origin-top after:rounded-full after:transition-all after:duration-100 after:ease-out hover:after:top-[calc(100%-4px)] hover:after:h-2 data-[active=true]:after:top-[calc(100%-4px)] data-[active=true]:after:h-2" data-id={section.name} data-active={$tabValue === section.name} bind:ref={allLinks[section.name]} onclick={() => handleSectionClick(section.name)}>
          {section.name?.replaceAll("_", " ")}
        </Button.Root>
      {/each}
    </div>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="horizontal" class="z-10 flex h-0.5 w-full origin-center -translate-y-[0.44rem] touch-none transition-all duration-300 ease-out select-none group-hover:h-2 group-hover:-translate-y-1">
    <ScrollArea.Thumb class="bg-icon rounded-full" />
  </ScrollArea.Scrollbar>
</ScrollArea.Root>

<div class="flex flex-col flex-nowrap gap-y-5 px-4 pb-4 @[75rem]/parent:px-8 @[75rem]/parent:pb-8">
  {@render children?.()}

  <div class="flex items-center justify-between">
    {#if previousSection}
      <Button.Root class="bg-icon flex items-center justify-between rounded-lg px-4 py-2 text-lg" onclick={() => handleSectionClick(previousSection.name ?? filteredSectionOrderPreferences[0].name)}>
        <ChevronLeft />
        {previousSection.name.replaceAll("_", " ")}
      </Button.Root>
    {:else}
      <div></div>
    {/if}
    {#if nextSection}
      <Button.Root class="bg-icon flex items-center justify-between rounded-lg px-4 py-2 text-lg" onclick={() => handleSectionClick(nextSection.name ?? filteredSectionOrderPreferences[filteredSectionOrderPreferences.length - 1].name)}>
        {nextSection.name.replaceAll("_", " ")}
        <ChevronRight />
      </Button.Root>
    {/if}
  </div>
</div>
