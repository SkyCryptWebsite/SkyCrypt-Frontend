<script lang="ts">
  import { getInternalState, getPreferences, itemTooltipTether } from "$ctx";
  import type { ModelsStrippedItem } from "$lib/shared/api/orval-generated";
  import { RARITIES, RARITY_COLORS } from "$lib/shared/constants/rarities";
  import { formatNumber, getRarityClass, shouldShine } from "$lib/shared/helper";
  import { cn } from "$lib/shared/utils";
  import ImageOff from "@lucide/svelte/icons/image-off";
  import { Avatar, Tooltip, type AvatarImageLoadingStatus } from "bits-ui";
  import { IsInViewport } from "runed";

  type Props = {
    piece: ModelsStrippedItem;
    isInventory?: boolean;
    showCount?: boolean;
    showRecombobulated?: boolean;
  };

  let { piece, isInventory, showCount, showRecombobulated = true }: Props = $props();
  let targetNode = $state<HTMLButtonElement | null>(null);
  let hasBeenInViewport = $state(false);
  let loadingStatus = $state<AvatarImageLoadingStatus>(null!);

  const preferences = getPreferences();
  const internalState = getInternalState();

  const inViewport = new IsInViewport(() => targetNode, { rootMargin: "200px 0px", threshold: 0 });
  const skyblockItem = $derived(piece);
  const bgColor = $derived(getRarityClass(piece.rarity ?? ("common".toLowerCase() as string), "bg"));
  const recombobulated = $derived(showRecombobulated && (skyblockItem.recombobulated ?? false));
  const enchanted = $derived(skyblockItem?.texture_path?.includes("/api/leather/") ? false : skyblockItem.shiny);
  const shine = $derived(!preferences.performanceMode && shouldShine(skyblockItem));
  const showNumbers = $derived(showCount && (skyblockItem.Count ?? 0) > 1);

  $effect(() => {
    if (inViewport.current && !hasBeenInViewport) {
      hasBeenInViewport = true;
    }
  });
</script>

<Tooltip.Trigger
  class={cn("relative flex aspect-square items-center justify-center overflow-clip nice-colors-dark", isInventory ? "size-6 p-0 sm:size-16" : `size-18 p-2 ${bgColor}`, { shine: shine && !isInventory }, { "rounded-lg": !isInventory }, preferences.performanceMode ? "" : "transition-all duration-150 ease-out hover:scale-110 active:scale-110")}
  bind:ref={targetNode}
  onclick={() => {
    if (skyblockItem.containsItems) {
      internalState.itemContentSpecial = skyblockItem;
      return;
    }
    internalState.itemContent = skyblockItem;
    internalState.showItem = true;
  }}
  tether={itemTooltipTether}
  payload={{ skyblockItem, inViewport }}>
  {#snippet child({ props })}
    <div {...props}>
      {#if hasBeenInViewport}
        <Avatar.Root bind:loadingStatus>
          <Avatar.Image loading="lazy" src={piece.texture_path} alt={piece.display_name} class={cn("pointer-events-none aspect-square select-none [image-rendering:pixelated] data-[enchanted=true]:enchanted", isInventory ? "size-6 sm:size-14" : "size-14")} data-enchanted={enchanted} />
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
        <div class="absolute right-0.5 bottom-0.5 text-sm font-semibold text-white text-shadow-[.1em_.1em_.1em_#000] sm:text-base">
          {formatNumber(skyblockItem.Count ?? 0)}
        </div>
      {/if}
    </div>
  {/snippet}
</Tooltip.Trigger>

{#snippet loadingState()}
  <div class={cn("animate-pulse rounded-lg bg-white/30", isInventory ? "size-8 sm:size-14" : "size-14")}></div>
{/snippet}
