<script lang="ts">
  import ItemContent from "$lib/components/item/item-content.svelte";
  import type { IsHover } from "$lib/hooks/is-hover.svelte";
  import { RARITIES, RARITY_COLORS } from "$lib/shared/constants/rarities";
  import { getRarityClass, shouldShine } from "$lib/shared/helper";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { itemContent, itemContentSpecial, showItem } from "$lib/stores/internal";
  import { performanceMode } from "$lib/stores/preferences";
  import type { ProcessedSkyBlockItem } from "$types/stats";
  import type { PetProcessedSkyBlockItem } from "$types/statsv2";
  import ImageOff from "@lucide/svelte/icons/image-off";
  import { Avatar, Tooltip, type AvatarImageLoadingStatus } from "bits-ui";
  import { IsInViewport } from "runed";
  import { getContext } from "svelte";

  type Props = {
    piece: ProcessedSkyBlockItem | PetProcessedSkyBlockItem;
    isInventory?: boolean;
    showCount?: boolean;
    showRecombobulated?: boolean;
  };

  let { piece, isInventory, showCount, showRecombobulated = true }: Props = $props();
  let targetNode = $state<HTMLButtonElement | null>(null);
  let hasBeenInViewport = $state(false);
  let tooltipOpen = $state(false);
  let loadingStatus = $state<AvatarImageLoadingStatus>(null!);

  const inViewport = new IsInViewport(() => targetNode, { rootMargin: "200px 0px", threshold: 0 });
  const skyblockItem = $derived(piece as ProcessedSkyBlockItem);
  const bgColor = $derived(getRarityClass(piece.rarity ?? ("common".toLowerCase() as string), "bg"));
  const recombobulated = $derived(showRecombobulated && (skyblockItem.recombobulated ?? false));
  const enchanted = $derived(skyblockItem?.texture_path?.includes("/api/leather/") ? false : skyblockItem.shiny);
  const shine = $derived(!$performanceMode && shouldShine(skyblockItem));
  const showNumbers = $derived(showCount && (skyblockItem.Count ?? 0) > 1);

  const isHover = getContext<IsHover>("isHover");

  $effect(() => {
    if (inViewport.current && !hasBeenInViewport) {
      hasBeenInViewport = true;
    }
  });
</script>

<Tooltip.Root bind:open={tooltipOpen} disableHoverableContent={true} ignoreNonKeyboardFocus={true} disabled={!inViewport.current} delayDuration={300}>
  <Tooltip.Trigger
    class={cn(`nice-colors-dark relative flex aspect-square items-center justify-center overflow-clip `, isInventory ? "size-6 p-0 sm:size-16" : `size-18 p-2 ${bgColor}`, { shine: shine && !isInventory }, { "rounded-lg": !isInventory }, $performanceMode ? "" : "transition-all duration-150 ease-out hover:scale-110 active:scale-110")}
    bind:ref={targetNode}
    onclick={() => {
      if (skyblockItem.containsItems) {
        itemContentSpecial.set(skyblockItem);
        return;
      }
      itemContent.set(piece);
      showItem.set(true);
    }}>
    {#snippet child({ props })}
      <div {...props}>
        {#if hasBeenInViewport}
          <Avatar.Root bind:loadingStatus>
            <Avatar.Image loading="lazy" src={piece.texture_path} alt={piece.display_name} class={cn("data-[enchanted=true]:enchanted pointer-events-none aspect-square select-none [image-rendering:pixelated]", isInventory ? "size-6 sm:size-14" : "size-14")} data-enchanted={enchanted} />
            {#if loadingStatus === "loading"}
              {@render loadingState()}
            {:else}
              <Avatar.Fallback class={cn("rounded-lg", isInventory ? "size-6 sm:size-14" : "size-14")}>
                <ImageOff class="size-full" />
              </Avatar.Fallback>
            {/if}
          </Avatar.Root>
        {:else}
          {@render loadingState()}
        {/if}

        {#if recombobulated && !isInventory}
          <div class="absolute -top-3 -right-3 z-10 size-6 rotate-45 bg-(--color)" style="--color: var(--§{RARITY_COLORS[RARITIES[RARITIES.indexOf(piece.rarity ?? 'common') - 1]]})"></div>
        {/if}

        {#if showNumbers}
          <div class="absolute right-0.5 bottom-0.5 text-sm font-semibold text-white text-shadow-[.1em_.1em_.1em_#000] sm:text-2xl">
            {skyblockItem.Count}
          </div>
        {/if}
      </div>
    {/snippet}
  </Tooltip.Trigger>
  {#if isHover.current && inViewport.current}
    <Tooltip.Portal>
      <Tooltip.Content forceMount={inViewport.current} class="bg-background-lore font-icomoon z-50 flex max-h-[calc(96vh-3rem)] flex-col overflow-clip rounded-lg select-text" sideOffset={8} side="right" align="center" collisionPadding={8}>
        {#snippet child({ wrapperProps, props, open })}
          {#if open}
            <div {...wrapperProps}>
              <div {...props} transition:flyAndScale>
                <ItemContent {piece} />
              </div>
            </div>
          {/if}
        {/snippet}
      </Tooltip.Content>
    </Tooltip.Portal>
  {/if}
</Tooltip.Root>

{#snippet loadingState()}
  <div class={cn("animate-pulse rounded-lg bg-white/30", isInventory ? "size-8 sm:size-14" : "size-14")}></div>
{/snippet}
