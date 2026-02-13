<script lang="ts">
  import { getPreferences } from "$ctx";
  import Notice from "$lib/components/notices/Notice.svelte";
  import { type ModelsStrippedItem } from "$lib/shared/api/orval-generated";
  import { getInventorySection } from "$lib/shared/api/skycrypt-api.remote";
  import { shouldShine } from "$lib/shared/helper";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import type { Snippet } from "svelte";

  const preferences = getPreferences();

  let { uuid, profileId, inventoryId, gap, itemSnippet }: { uuid: string; profileId: string; inventoryId: string; gap: number; itemSnippet: Snippet<[ModelsStrippedItem]> } = $props();
</script>

<svelte:boundary>
  {@const items = await getInventorySection({ uuid, profileId, inventoryId })}
  {#snippet pending()}
    <LoaderCircle class="mx-auto mt-4 animate-spin text-icon" />
  {/snippet}
  {#snippet failed(err, retry)}
    <Notice title="An unexpected error has occurred" type="error" error={err} {retry} />
  {/snippet}

  {#if items?.length ?? 0 > 0}
    <div class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
      {#each items as item, index (index)}
        {#if index > 0}
          {#if index % gap === 0}
            <hr class="col-span-full h-4 border-0" />
          {/if}
        {/if}
        {#if item.texture_path}
          <div class="relative flex aspect-square items-center justify-center rounded-sm bg-text/4 data-[shine=true]:shine" data-shine={!preferences.performanceMode && shouldShine(item)}>
            {@render itemSnippet(inventoryId === "inventory" ? ({ ...item, rarity: item.rarity ?? "uncommon" } as ModelsStrippedItem) : item)}
          </div>
        {:else}
          <div class="aspect-square rounded-sm bg-text/4"></div>
        {/if}
      {/each}
    </div>
  {:else}
    <p class="mt-2 space-x-0.5 text-center leading-6">
      No items found in the {inventoryId.replaceAll("_", " ")}.
    </p>
  {/if}
</svelte:boundary>
