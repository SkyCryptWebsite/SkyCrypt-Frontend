<script lang="ts">
  import type { IsHover } from "$lib/hooks/is-hover.svelte";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { content } from "$lib/stores/internal";
  import Image from "@lucide/svelte/icons/image";
  import { Avatar, Tooltip } from "bits-ui";
  import { IsInViewport } from "runed";
  import { getContext, type Snippet } from "svelte";
  import { fade } from "svelte/transition";

  type AnimationOptions =
    | {
        animate: true;
        index: number;
        amountOfItems: number;
      }
    | {
        animate: false;
        index?: number;
        amountOfItems?: number;
      };

  type ImageProps = {
    src: string;
    class?: string;
  };

  type Props = {
    animationOptions?: AnimationOptions;
    image: ImageProps;
    class?: string;
    children?: Snippet;
    progress?: Snippet;
    tooltip?: Snippet;
  };

  let { animationOptions = { animate: false }, image, class: classNames, children, progress, tooltip }: Props = $props();

  let targetNode = $state<HTMLDivElement>()!;
  let hasBeenInViewport = $state(false);
  let open = $state(false);

  const inViewport = new IsInViewport(() => targetNode, { rootMargin: "200px 0px", threshold: 0 });
  const isHover = getContext<IsHover>("isHover");

  $effect(() => {
    if (inViewport.current && !hasBeenInViewport) {
      hasBeenInViewport = true;
    }
  });
</script>

<Tooltip.Root>
  <Tooltip.Trigger class={cn("bg-background/30 flex w-full max-w-fit items-center gap-2 rounded-lg py-2", classNames)} onpointerdown={() => (open = !open)} onclick={() => content.set(tooltip)}>
    {#snippet child({ props })}
      <div {...props} bind:this={targetNode} in:fade={{ duration: animationOptions.animate ? 300 : 0, delay: animationOptions.animate ? 25 * (animationOptions.index + 1) : 0 }} out:fade={{ duration: animationOptions.animate ? 300 : 0, delay: animationOptions.animate ? 25 * (animationOptions.amountOfItems - animationOptions.index) : 0 }}>
        <div class="flex items-center gap-2 px-2">
          {#if hasBeenInViewport}
            <Avatar.Root class="aspect-square size-12">
              <Avatar.Image loading="lazy" src={image.src} class={cn("size-full object-contain", image.class)} />
              <Avatar.Fallback>
                <Image class="size-full" />
              </Avatar.Fallback>
            </Avatar.Root>
          {:else}
            <div>
              <Image class="size-12" />
            </div>
          {/if}
          {@render children?.()}
        </div>
        {@render progress?.()}
      </div>
    {/snippet}
  </Tooltip.Trigger>
  <Tooltip.Portal>
    {#if tooltip && isHover.current}
      <Tooltip.Content forceMount class="bg-background-grey z-50 rounded-lg p-4" sideOffset={6} side="top" align="center">
        {#snippet child({ wrapperProps, props, open })}
          {#if open}
            <div {...wrapperProps}>
              <div {...props} transition:flyAndScale>
                {@render tooltip()}
                <Tooltip.Arrow />
              </div>
            </div>
          {/if}
        {/snippet}
      </Tooltip.Content>
    {/if}
  </Tooltip.Portal>
</Tooltip.Root>
