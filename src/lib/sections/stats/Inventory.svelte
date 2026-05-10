<script lang="ts">
  import { getInternalState, getPreferences, getProfileContext } from "$ctx";
  import { InventoryGrid, InventorySearch, Item } from "$lib/components/item";
  import ScrollAreaPrimitive from "$lib/components/ScrollAreaPrimitive.svelte";
  import { Section } from "$lib/components/sections";
  import { type ModelsInventory, type ModelsStrippedItem } from "$lib/shared/api/orval-generated";
  import { getInventories } from "$lib/shared/api/skycrypt-api.remote";
  import { renderLore, shouldShine } from "$lib/shared/helper";
  import { animateObfuscatedText } from "$lib/shared/mc-text/obfuscated";
  import Image from "@lucide/svelte/icons/image";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { Avatar, ScrollArea, Tabs } from "bits-ui";
  import { cubicOut } from "svelte/easing";
  import { crossfade, fade } from "svelte/transition";

  const preferences = getPreferences();
  const internalState = getInternalState();

  let { order }: { order: number } = $props();
  let openTab = $state<string>("");
  let searchValue = $state<string>();

  const profile = $derived(getProfileContext().current);
  const profileId = $derived(profile?.profile_id);
  const uuid = $derived(profile?.uuid);
  const inventoriesState = $derived.by(() => {
    if (!uuid || !profileId) {
      return { current: [], error: null } satisfies { current: ModelsInventory[]; error: unknown };
    }

    const query = getInventories({ uuid, profileId });

    return {
      current: query.current ?? [],
      error: query.error
    };
  });

  const inventories = $derived<ModelsInventory[]>(inventoriesState.current);
  const selectedInventory = $derived(openTab ? inventories.find((inventory) => inventory.name === openTab) : undefined);
  const selectedTabName = $derived(selectedInventory?.name ?? inventories[0]?.name ?? "");
  const currentInventory = $derived(selectedInventory ?? inventories[0]);
  const usesNestedInventoryView = $derived(selectedTabName === "Backpack" || selectedTabName === "Museum" || selectedTabName === "Sacks");

  function handleTabChange(value: string) {
    openTab = value;

    if (internalState.itemContentSpecial && (value === "Search" || value === "Backpack" || value === "Museum" || value === "Sacks")) {
      console.warn("Item content special should not be set for search, backpack, sacks, or museum tabs.");
      internalState.itemContentSpecial = undefined;
    }
  }

  const [send, receive] = crossfade({
    duration: 300,
    easing: cubicOut
  });
</script>

<Section id="Inventory" {order} class="min-h-150">
  {#if inventories.length && currentInventory}
    <Tabs.Root bind:value={() => selectedTabName, handleTabChange} class="@container relative mb-0 rounded-lg bg-background/30 p-5 pt-4">
      <Tabs.List>
        <ScrollAreaPrimitive viewClass="border-b border-icon" orientation="horizontal">
          {#snippet viewportChildren()}
            <div class="flex! h-full shrink-0 flex-nowrap items-center gap-3 px-4 whitespace-nowrap">
              {#each inventories as tabItem (tabItem.name)}
                <Tabs.Trigger value={tabItem.name || ""} class="group relative flex items-center justify-center gap-0.5 pb-2 text-xs uppercase">
                  <Avatar.Root class="size-8">
                    <Avatar.Image loading="lazy" src={tabItem.texture} class="size-8 object-contain" />
                    <Avatar.Fallback>
                      <Image class="size-8" />
                    </Avatar.Fallback>
                  </Avatar.Root>
                  {tabItem.name}
                  {#if selectedTabName === tabItem.name}
                    <div class="absolute -bottom-1 h-2 w-full rounded-full bg-icon" in:send={{ key: "active-tab" }} out:receive={{ key: "active-tab" }}></div>
                  {:else}
                    <div class="absolute -bottom-1 h-2 w-full rounded-full bg-icon opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" out:fade={{ duration: 300, easing: cubicOut }}></div>
                  {/if}
                </Tabs.Trigger>
              {/each}
            </div>
          {/snippet}
          <ScrollArea.Scrollbar orientation="horizontal">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollAreaPrimitive>
      </Tabs.List>

      <Tabs.Content value={selectedTabName}>
        {#if selectedTabName === "Search"}
          {#if uuid && profileId}
            <InventorySearch bind:search={searchValue} {uuid} {profileId} {itemSnippet} />
          {/if}
        {:else if usesNestedInventoryView}
          {@render multipleInventorySection(currentInventory?.items ?? [])}
        {:else}
          <InventoryGrid inventoryId={selectedTabName} gap={currentInventory.separatorAfter ?? 45} {itemSnippet} items={currentInventory.items ?? []} />
        {/if}
      </Tabs.Content>
    </Tabs.Root>
  {:else if inventoriesState.error}
    <p class="mt-2 space-x-0.5 text-center leading-6">Failed to load inventories.</p>
  {:else}
    <LoaderCircle class="mx-auto mt-4 animate-spin text-icon" />
  {/if}
</Section>

{#snippet itemSnippet(item: ModelsStrippedItem)}
  <Item piece={item} isInventory={true} showRecombobulated={false} showCount={true} />
{/snippet}

{#snippet emptyItem()}
  <div class="aspect-square rounded-sm bg-text/4"></div>
{/snippet}

{#snippet gap()}
  <hr class="col-span-full h-4 border-0" />
{/snippet}

{#snippet multipleInventorySection(items: ModelsStrippedItem[])}
  <Tabs.Root value={currentInventory?.name}>
    <Tabs.List class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
      {#if items?.length}
        {#each items as item, index (index)}
          <Tabs.Trigger value={item.texture_path ? index.toString() : "undefined"} class="group">
            {#snippet child({ props })}
              <div {...props}>
                {#if item.texture_path}
                  <div class="relative flex aspect-square items-center justify-center rounded-sm group-data-[state=active]:bg-text/10 group-data-[state=inactive]:bg-text/4 data-[shine=true]:shine" data-shine={!preferences.performanceMode && shouldShine(item)}>
                    {@render itemSnippet(item)}
                  </div>
                {:else}
                  {@render emptyItem()}
                {/if}
              </div>
            {/snippet}
          </Tabs.Trigger>
        {/each}
      {/if}
    </Tabs.List>
    {#if items?.length}
      {#each items as item, index (index)}
        <Tabs.Content value={index.toString()}>
          <div class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
            {#if item?.containsItems}
              {#each item.containsItems as containedItem, index2 (index2)}
                {#if index2 > 0}
                  {#if index2 % 54 === 0}
                    {@render gap()}
                  {/if}
                {/if}
                <Tabs.Content value={index.toString()}>
                  {#if containedItem.texture_path}
                    <div class="relative flex aspect-square items-center justify-center rounded-sm bg-text/4 data-[shine=true]:shine" data-shine={!preferences.performanceMode && shouldShine(item)}>
                      {@render itemSnippet(containedItem)}
                    </div>
                  {:else}
                    {@render emptyItem()}
                  {/if}
                </Tabs.Content>
              {/each}
            {/if}
          </div>
          <div class="grid place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2" {@attach animateObfuscatedText}>
            <div class="pt-5">
              {#if item?.lore}
                {#each item?.lore as lore, index (index)}
                  {@html renderLore(lore)}
                {/each}
              {/if}
            </div>
          </div>
        </Tabs.Content>
      {/each}
    {/if}
  </Tabs.Root>
{/snippet}
