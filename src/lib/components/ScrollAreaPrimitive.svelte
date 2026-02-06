<script lang="ts">
  import { cn } from "$lib/shared/utils";
  import { ScrollArea, ScrollArea as ScrollAreaPrimitive, type Orientation, type WithoutChild } from "bits-ui";

  let {
    ref = $bindable(null),
    viewRef = $bindable(null),
    class: className,
    viewClass,
    orientation = "vertical",
    children,
    viewportChildren,
    ...restProps
  }: WithoutChild<ScrollAreaPrimitive.RootProps> & {
    viewRef?: ScrollAreaPrimitive.ViewportProps["ref"];
    viewClass?: string | undefined;
    orientation?: Orientation;
    scrollbarClasses?: string | undefined;
    thumbClasses?: string | undefined;
    viewportChildren?: ScrollAreaPrimitive.ViewportProps["children"];
  } = $props();

  function handleWheel(e: WheelEvent) {
    if (!viewRef) return;

    const maxScroll = viewRef.scrollWidth - viewRef.clientWidth;
    const atRightEdge = viewRef.scrollLeft >= maxScroll - 1;
    const atLeftEdge = viewRef.scrollLeft <= 1;

    // Determine scroll direction from the dominant axis
    const scrollAmount = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

    // Allow vertical page scroll only when at the boundaries AND scrolling outward
    if (atRightEdge && scrollAmount > 0) {
      return;
    }

    if (atLeftEdge && scrollAmount < 0) {
      return;
    }

    // Always prevent default to stop vertical page scrolling
    e.preventDefault();

    // Apply scroll amount to horizontal position
    viewRef.scrollLeft += scrollAmount;
  }
</script>

<ScrollArea.Root bind:ref class={cn(className)} {...restProps}>
  <ScrollArea.Viewport bind:ref={viewRef} class={cn(viewClass)} onwheel={orientation === "horizontal" ? handleWheel : undefined}>
    {@render viewportChildren?.()}
  </ScrollArea.Viewport>
  {@render children?.()}
</ScrollArea.Root>
