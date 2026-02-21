<script lang="ts">
  import { EmptyEquipment, Item } from "$lib/components/item";
  import type { ModelsStrippedItem } from "$lib/shared/api/orval-generated";

  const { wardrobeItems }: { wardrobeItems: ModelsStrippedItem[] } = $props();
</script>

<div class="mt-2 flex flex-col gap-2">
  {#each wardrobeItems as piece, index (index)}
    {#if piece && piece.display_name}
      <Item {piece} />
    {:else}
      <EmptyEquipment {index} />
    {/if}
  {/each}
</div>
