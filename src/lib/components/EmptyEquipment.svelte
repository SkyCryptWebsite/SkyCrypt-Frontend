<script lang="ts">
  import Image from "@lucide/svelte/icons/image";

  const pieces = ["helmet", "chestplate", "leggings", "boots"] as const;
  type PieceType = (typeof pieces)[number];

  const { piece, index }: { piece?: PieceType; index?: number } = $props();

  const selectedPiece = $derived.by(() => {
    if (piece) {
      return piece;
    }
    if (index !== undefined && index >= 0 && index < pieces.length) {
      return pieces[index];
    }
  });
</script>

{#if selectedPiece}
  <div class="bg-background/30 rounded-lg p-2">
    <div class="bg-text/80 size-14 [mask-image:var(--image)] [-webkit-mask-image:var(--image)] [-webkit-mask-position:center_center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:3.5rem] [image-rendering:pixelated]" style="--image: url('/img/textures/item/empty_armor_slot_{selectedPiece}.png')"></div>
  </div>
{:else}
  <div class="bg-background/30 rounded-lg p-2">
    <Image class="text-text/80 size-14" />
  </div>
{/if}
