<script lang="ts">
  import Item from "$lib/components/Item.svelte";
  import type { ProcessedSkyBlockItem } from "$types/stats";

  let { wardrobeItems }: { wardrobeItems: ProcessedSkyBlockItem[] } = $props();

  const pieces = ["helmet", "chestplate", "leggings", "boots"];
</script>

<div class="mt-2 flex flex-col gap-2">
  {#each wardrobeItems as piece, index (index)}
    {#if piece && piece.display_name}
      <Item {piece} />
    {:else}
      <div class="bg-background/30 rounded-lg p-2">
        <div class="bg-text/80 size-14 [mask-image:var(--image)] [-webkit-mask-image:var(--image)] [-webkit-mask-position:center_center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:3.5rem] [image-rendering:pixelated]" style="--image: url('/img/textures/item/empty_armor_slot_{pieces[index]}.png')"></div>
      </div>
    {/if}
  {/each}
</div>
