<script lang="ts">
  import { getPacksContext, getWikiOrder, type WikiOrderData } from "$ctx";
  import ContainedItem from "$lib/components/ContainedItem.svelte";
  import type { ModelsStrippedItem } from "$lib/shared/api/orval-generated";
  import { getRarityClass, removeFormatting, renderLore } from "$lib/shared/helper";
  import { animateObfuscatedText } from "$lib/shared/mc-text/obfuscated";
  import { cn } from "$lib/shared/utils";
  import Image from "@lucide/svelte/icons/image";
  import Info from "@lucide/svelte/icons/info";
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  import { Avatar, Button } from "bits-ui";

  type Props = {
    piece: ModelsStrippedItem;
    isDrawer?: boolean;
  };

  let { piece, isDrawer }: Props = $props();

  const wikiOrderContext = getWikiOrder();

  const skyblockItem = $derived(piece);
  const itemName = $derived(piece?.display_name);
  const itemNameHtml = $derived(itemName ? renderLore(itemName) : "");
  const isMulticolor = $derived((itemNameHtml?.match(/<\/span>/g) || [])?.length > 1);
  const bgColor = $derived(getRarityClass(piece?.rarity ?? ("common".toLowerCase() as string), "bg"));
  const enchanted = $derived(skyblockItem?.texture_path?.includes("/api/leather/") ? false : skyblockItem && "shiny" in skyblockItem ? skyblockItem.shiny : false);
  const hasColor = $derived(skyblockItem?.lore?.some((lore) => lore.includes("Color:")) ?? false);
  const packs = $derived(getPacksContext().packs);
  const packData = $derived(packs?.find((pack) => pack.id === skyblockItem?.texture_pack));

  // Get the wiki link for the item
  const wikiInfo = $derived.by<Omit<WikiOrderData, "id"> | undefined>(() => {
    const wiki = skyblockItem?.wiki;
    if (!wiki) return undefined;

    // Try to get the preferred wiki link first, then fall back to any available link
    const preference = wikiOrderContext.current[0].name.toLowerCase();

    // Type-safe approach: check if the preference is a valid key
    if (preference === "fandom" && wiki.fandom) {
      return { link: wiki.fandom, name: "Fandom" };
    } else if (preference === "official" && wiki.official) {
      return { link: wiki.official, name: "Official" };
    }

    // If no preferred links are available, return any available link or null
    if (wiki.fandom) {
      return { link: wiki.fandom, name: "Fandom" };
    } else if (wiki.official) {
      return { link: wiki.official, name: "Official" };
    }

    return undefined;
  });
</script>

<div class="!minecraft-tooltip" {@attach animateObfuscatedText}>
  <div class={cn(`flex flex-nowrap items-center justify-center gap-4 p-5 nice-colors-dark`, { "rounded-t-[10px]": isDrawer }, bgColor)}>
    <Avatar.Root class="shrink-0 px-2">
      <Avatar.Image loading="lazy" src={piece?.texture_path} alt={piece?.display_name} class="h-auto w-8 flex-none shrink-0 overflow-hidden [image-rendering:pixelated] data-[enchanted=true]:enchanted" data-enchanted={enchanted} />
      <Avatar.Fallback>
        <Image class="size-8" />
      </Avatar.Fallback>
    </Avatar.Root>

    <p class="relative min-w-0 text-center text-base font-semibold wrap-break-word uppercase data-[multicolor=false]:text-text data-[multicolor=true]:rounded-full data-[multicolor=true]:bg-background-lore data-[multicolor=true]:px-2 data-[multicolor=true]:py-1 sm:text-lg" data-multicolor={isMulticolor}>
      {@html isMulticolor ? itemNameHtml : removeFormatting(itemNameHtml)}
    </p>
  </div>

  <div class="w-full overflow-auto">
    <div class="w-full p-6 leading-snug font-semibold">
      {#if skyblockItem?.lore}
        {#each skyblockItem?.lore as lore, index (index)}
          {@html renderLore(lore, true, index)}
        {/each}
      {/if}

      {#if skyblockItem && "containsItems" in skyblockItem && Array.isArray(skyblockItem?.containsItems) && !skyblockItem?.containsItems.every((item) => Object.keys(item).length === 0)}
        <div class="mt-4 border-t border-text/10 pt-4">
          <div class="grid grid-cols-9 gap-1">
            {#each skyblockItem?.containsItems.slice(0, Math.min(skyblockItem?.containsItems.length, 54)) as containedItem, index (index)}
              {#if containedItem.texture_path}
                <div class="flex aspect-square items-center justify-center rounded-sm bg-text/4">
                  <ContainedItem piece={containedItem} isInventory={true} />
                </div>
              {:else}
                <div class="aspect-square rounded-sm bg-text/4"></div>
              {/if}
            {/each}
          </div>
        </div>
      {/if}

      {#if piece && piece.sourceTab}
        <div class="mt-4">
          <div class="flex items-center justify-between gap-4 rounded-[0.625rem] bg-text/5 p-2 transition-colors ease-out hover:bg-text/8">
            <div class="flex items-center gap-2">
              <Avatar.Root class="shrink-0 select-none">
                <Avatar.Image loading="lazy" src={piece.sourceTab.icon} alt={piece.sourceTab.name} class="pointer-events-none aspect-square size-10 h-full rounded-lg select-none [image-rendering:pixelated]" />
                <Avatar.Fallback class="flex size-10 items-center justify-center rounded-lg bg-icon/90 text-center font-semibold uppercase">
                  {piece.sourceTab.name?.slice(0, 2)}
                </Avatar.Fallback>
              </Avatar.Root>
              <div class="font-semibold text-link">
                You can find this item in the <span class="capitalize">{piece.sourceTab.name}</span> tab
              </div>
            </div>
          </div>
        </div>
      {/if}
      {#if hasColor}
        <div class="mt-4 flex max-w-72 items-center justify-start gap-4 rounded-[0.625rem] bg-text/5 p-2 transition-colors ease-out">
          <div class="flex items-center gap-2 text-text/60">
            <TriangleAlert class="size-10" />
            <div class="text-sm font-semibold">Due to abuse, all leather armor uses default color values</div>
          </div>
        </div>
      {/if}
      <div class="mt-4 flex w-full flex-nowrap gap-4">
        {#if packData}
          <Button.Root href={packData.url} target="_blank">
            <div class="flex items-center justify-between gap-4 rounded-[0.625rem] bg-text/5 p-2 transition-colors ease-out hover:bg-text/8">
              <div class="flex items-center gap-2">
                <Avatar.Root class="shrink-0 select-none">
                  <Avatar.Image loading="lazy" src={packData.icon} alt={packData.name} class="pointer-events-none aspect-square size-10 h-full rounded-lg select-none [image-rendering:pixelated]" />
                  <Avatar.Fallback class="flex size-10 items-center justify-center rounded-lg bg-icon/90 text-center font-semibold uppercase">
                    {packData.name?.slice(0, 2)}
                  </Avatar.Fallback>
                </Avatar.Root>
                <div class="flex flex-col">
                  <div class="font-semibold text-link">
                    <span class="underline">
                      {packData.name}
                    </span>
                    <span class="text-sm text-text/60">{packData.version}</span>
                  </div>
                  <div class="text-sm text-text/60">
                    by <span class="text-text/80">{packData.author}</span>
                  </div>
                </div>
              </div>
            </div>
          </Button.Root>
        {/if}

        {#if wikiInfo}
          <Button.Root href={wikiInfo.link} target="_blank" class="flex shrink items-center justify-center rounded-[0.625rem] bg-text/5 p-2 whitespace-nowrap transition-colors ease-out hover:bg-text/8">
            <Info class="mr-2 ml-2 size-6 p-0" />
          </Button.Root>
        {/if}
      </div>
    </div>
  </div>
</div>
