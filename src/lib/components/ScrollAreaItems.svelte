<script lang="ts">
  import { ScrollArea } from "$ui/scroll-area";
  import { cn } from "$utils";
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
    class?: string;
    orientation?: "vertical" | "horizontal";
    viewportClasses?: string;
    border?: boolean;
  };

  const { children, class: className, orientation = "vertical", viewportClasses, border = false }: Props = $props();
  let viewRef = $state<HTMLElement | null | undefined>(null);

  const handleWheel = (e: WheelEvent) => {
    if (!viewRef) return;

    const maxScroll = viewRef.scrollWidth - viewRef.clientWidth;
    const atRightEdge = viewRef.scrollLeft >= maxScroll - 1;
    const atLeftEdge = viewRef.scrollLeft <= 1;

    const scrollAmount = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

    if (atRightEdge && scrollAmount > 0) return;
    if (atLeftEdge && scrollAmount < 0) return;

    e.preventDefault();
    viewRef.scrollLeft += scrollAmount;
  };

  $effect(() => {
    if (viewRef && orientation === "horizontal") {
      viewRef.addEventListener("wheel", handleWheel, { passive: false });

      // Svelte 5 automatically runs the returned function when the effect destroys/re-runs
      return () => {
        viewRef?.removeEventListener("wheel", handleWheel);
      };
    }
  });
</script>

<ScrollArea bind:viewportRef={viewRef} class={cn("h-fit data-[orientation=vertical]/scroll:w-fit data-[orientation=horizontal]/scroll:max-w-full group/scroll", { "rounded-xl border": border }, className)} type="auto" {orientation} scrollbarYClasses="py-2" scrollbarXClasses="px-2" viewportClasses={cn("group-data-[orientation=horizontal]/scroll:w-full group-data-[orientation=horizontal]/scroll:scroll-fade-track-x group-data-[orientation=vertical]/scroll:scroll-fade-track-y rounded-xl group-data-[orientation=vertical]/scroll:h-full group-data-[orientation=vertical]/scroll:max-h-144", viewportClasses)} data-orientation={orientation}>
  <div class="relative flex group-data-[orientation=vertical]/scroll:flex-wrap group-data-[orientation=horizontal]/scroll:w-max group-data-[orientation=horizontal]/scroll:flex-nowrap gap-4 p-4">
    {@render children?.()}
    <div class="pointer-events-none sticky group-data-[orientation=vertical]/scroll:hidden -right-1 z-10 -ml-40 w-36 self-stretch bg-linear-to-l from-background/80 to-transparent blur-xs scroll-fade-x"></div>
  </div>
  <div class="pointer-events-none sticky -bottom-1 z-10 group-data-[orientation=horizontal]/scroll:hidden -mt-36 h-36 w-full bg-linear-to-t from-background/80 to-transparent blur-xs scroll-fade-y"></div>
</ScrollArea>
