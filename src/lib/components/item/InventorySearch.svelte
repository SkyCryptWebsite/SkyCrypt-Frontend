<script lang="ts">
  import { getPreferences } from "$ctx";
  import SectionBoundary from "$lib/components/sections/SectionBoundary.svelte";
  import { type ModelsStrippedItem } from "$lib/shared/api/orval-generated";
  import { searchInventorySection } from "$lib/shared/api/skycrypt-api.remote";
  import { shouldShine } from "$lib/shared/helper";
  import { Debounced } from "runed";
  import type { Snippet } from "svelte";

  const preferences = getPreferences();

  let { search = $bindable(), uuid, profileId, itemSnippet }: { search?: string; uuid: string; profileId: string; itemSnippet: Snippet<[ModelsStrippedItem]> } = $props();

  const debouncedSearch = $state(new Debounced(() => search, 300));
</script>

<input
  type="search"
  placeholder="Search all inventories"
  class="mx-auto mt-4 block w-full max-w-52 rounded-lg bg-text/10 px-2 py-2 font-normal text-text placeholder:text-text/80 focus-visible:outline-none"
  bind:value={search}
  onkeydown={(e) => {
    e.stopPropagation();
  }} />
{#if debouncedSearch.current === "" || !debouncedSearch.current}{:else}
  <SectionBoundary promise={searchInventorySection({ uuid, profileId, inventoryId: "search", query: debouncedSearch.current })}>
    {#snippet children(items)}
      {#if !items || items.length === 0}
        <p class="mx-auto w-fit leading-6">No items found.</p>
      {:else if debouncedSearch.current !== ""}
        <div class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
          {#each items as item, index (index)}
            {#if item}
              <div class="relative flex aspect-square items-center justify-center rounded-sm bg-text/4 data-[shine=true]:shine" data-shine={!preferences.performanceMode && shouldShine(item)}>
                {@render itemSnippet(item)}
              </div>
            {:else}
              <div class="aspect-square rounded-sm bg-text/4"></div>
            {/if}
          {/each}
        </div>
      {/if}
    {/snippet}
  </SectionBoundary>
{/if}
