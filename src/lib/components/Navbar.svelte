<script lang="ts">
  import { replaceState } from "$app/navigation";
  import { page } from "$app/state";
  import type { SectionName } from "$lib/sections/types";
  import { tabValue } from "$lib/stores/internal";
  import { sectionOrderPreferences } from "$lib/stores/preferences";
  import { Button, ScrollArea } from "bits-ui";
  import { onDestroy, onMount, tick } from "svelte";

  let pinned = $state(false);
  let navbarElement = $state<HTMLDivElement | null>(null);
  let observer: IntersectionObserver;

  let allLinks = $state<Record<string, HTMLAnchorElement | null>>(
    $sectionOrderPreferences.reduce(
      (acc: Record<string, HTMLAnchorElement | null>, section) => {
        acc[section.name] = null;
        return acc;
      },
      {} as Record<string, HTMLAnchorElement | null>
    )
  );

  function handleSectionClick(sectionName: SectionName) {
    tabValue.set(sectionName);
  }

  function scrollToTab(smooth = true, element?: HTMLElement | null) {
    const link = element ?? document.querySelector<HTMLAnchorElement>(`[href="${location.hash}"]`);
    const scrollableParent = link?.parentElement?.parentElement as HTMLElement;

    if (link == null) {
      console.warn(`could not scroll to ${location.hash} tab because it does not exist`, link);
      return;
    }

    const behavior = smooth ? "smooth" : "auto";
    const left = link.offsetLeft + link.getBoundingClientRect().width / 2 - scrollableParent.getBoundingClientRect().width / 2;
    scrollableParent.scrollTo({ left, behavior });
  }

  function observerInit() {
    if (!navbarElement) {
      console.warn("Navbar element is not defined");
      return;
    }
    observer = new IntersectionObserver(([e]) => (pinned = e.intersectionRatio < 1), {
      threshold: [1],
      rootMargin: `-${parseInt(window.getComputedStyle(navbarElement).getPropertyValue("top")) + 1}px 0px` // shrink the viewport to element top value +1px to trigger observer when element has reach it's sticky position
    });

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
        scrollToTab(true, allLinks[$tabValue]);
        replaceState("#" + $tabValue, page.state);
      });
    }
  });
</script>

<ScrollArea.Root type="scroll" class="navbar group !sticky top-[calc(3rem+env(safe-area-inset-top,0))] z-20 overflow-clip" data-pinned={pinned} bind:ref={navbarElement}>
  <ScrollArea.Viewport>
    <div class="text-text/80 flex! flex-nowrap items-center gap-2 pb-2 font-semibold whitespace-nowrap">
      <div class="bg-icon absolute bottom-[0.4375rem] z-1 h-[2px] w-[calc(100%+0.5rem)]"></div>
      <div class="absolute inset-0 bottom-2 group-data-[pinned=true]:group-data-[mode=dark]/html:bg-[oklch(19.13%_0_0)]/90 group-data-[pinned=true]:group-data-[mode=light]/html:bg-[oklch(95.51%_0_0)]/92"></div>
      {#each $sectionOrderPreferences as section, index (index)}
        <Button.Root class="after:bg-icon data-[active=true]:text-text relative px-2 py-3 after:absolute after:top-full after:left-0 after:h-0 after:w-full after:origin-top after:rounded-full after:transition-all after:duration-100 hover:after:top-[calc(100%-4px)] hover:after:h-2 data-[active=true]:after:top-[calc(100%-4px)] data-[active=true]:after:h-2" data-active={$tabValue === section.name} bind:ref={allLinks[section.name]} onclick={() => handleSectionClick(section.name)}>
          {section.name?.replaceAll("_", " ")}
        </Button.Root>
      {/each}
    </div>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="horizontal">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
</ScrollArea.Root>
