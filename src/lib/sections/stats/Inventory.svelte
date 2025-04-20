<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";
  import Item from "$lib/components/Item.svelte";
  import type { ProcessedSkyBlockItem } from "$lib/types/stats";
  import Image from "@lucide/svelte/icons/image";
  import { Avatar, ScrollArea, Tabs } from "bits-ui";
  import { Debounced } from "runed";
  import { cubicInOut } from "svelte/easing";
  import { crossfade, fade } from "svelte/transition";

  type Tabs = {
    id: string;
    icon: string;
    items: ProcessedSkyBlockItem[];
    gap: number;
  };

  let { order }: { order: number } = $props();
  let openTab = $state<string>("inv");
  let searchValue = $state<string>();

  const debouncedSearchValue = new Debounced(() => searchValue, 300);

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);

  const inventory = $derived(profile.items.inventory.slice(9).concat(profile.items.inventory.slice(0, 9)));
  const rift_inventory = $derived(profile.items.rift_inventory.slice(9).concat(profile.items.rift_inventory.slice(0, 9)));
  const rift_enderchest = $derived(profile.items.rift_enderchest);
  const backpack = $derived(profile.items.backpack);
  const enderchest = $derived(profile.items.enderchest);
  const vault = $derived(profile.items.personal_vault);
  const accs = $derived(profile.items.talisman_bag);
  const pots = $derived(profile.items.potion_bag);
  const fish = $derived(profile.items.fishing_bag);
  const quiver = $derived(profile.items.quiver);
  const museum = $derived(profile.items.museum);

  const tabs = $derived<Tabs[]>(
    [
      {
        id: "inv",
        icon: `https://crafatar.com/renders/head/${profile.uuid}?overlay`,
        items: inventory,
        gap: 27
      },
      {
        id: "storage",
        icon: "/api/item/chest",
        items: backpack,
        gap: 45
      },
      {
        id: "ender",
        icon: "/api/item/ender_chest",
        items: enderchest,
        gap: 45
      },
      {
        id: "vault",
        icon: "/api/head/f7aadff9ddc546fdcec6ed5919cc39dfa8d0c07ff4bc613a19f2e6d7f2593",
        items: vault,
        gap: 45
      },
      {
        id: "accs",
        icon: "/api/head/961a918c0c49ba8d053e522cb91abc74689367b4d8aa06bfc1ba9154730985ff",
        items: accs,
        gap: 45
      },
      {
        id: "pots",
        icon: "/api/head/9f8b82427b260d0a61e6483fc3b2c35a585851e08a9a9df372548b4168cc817c",
        items: pots,
        gap: 45
      },
      {
        id: "fish",
        icon: "/api/head/eb8e297df6b8dffcf135dba84ec792d420ad8ecb458d144288572a84603b1631",
        items: fish,
        gap: 45
      },
      {
        id: "quiver",
        icon: "/api/head/4cb3acdc11ca747bf710e59f4c8e9b3d949fdd364c6869831ca878f0763d1787",
        items: quiver,
        gap: 45
      },
      {
        id: "museum",
        icon: "/api/head/438cf3f8e54afc3b3f91d20a49f324dca1486007fe545399055524c17941f4dc",
        items: museum,
        gap: 54
      },
      {
        id: "rift inv",
        icon: "/api/head/445240fcf1a9796327dda5593985343af9121a7156bc76e3d6b341b02e6a6e52",
        items: rift_inventory,
        gap: 45
      },
      {
        id: "rift ender",
        icon: "/api/head/a6cc486c2be1cb9dfcb2e53dd9a3e9a883bfadb27cb956f1896d602b4067",
        items: rift_enderchest,
        gap: 45
      },
      {
        id: "search",
        icon: "/api/item/EYE_OF_ENDER",
        items: [],
        gap: 45
      }
    ].filter((tab) => tab.id === "search" || tab.items.length > 0)
  );

  const allItemNames = $derived(
    [...inventory, ...rift_inventory, ...rift_enderchest, ...backpack, ...enderchest, ...vault, ...accs, ...pots, ...fish, ...quiver, ...museum, ...backpack.map((item) => (item.containsItems ? item.containsItems : []))]
      .flat()
      .filter((item) => item && item.display_name)
      .map((item) => item.display_name)
  );

  type SearchedItem = { item: ProcessedSkyBlockItem; sourceTab: { name: string; icon: string } };
  const searchedItems = $derived.by<SearchedItem[] | []>(() => {
    const search = debouncedSearchValue.current?.trim();
    if (!search) return [];
    const searchedItemName = allItemNames.filter((name) => name.toLowerCase().includes(search.toLowerCase())).slice(0, 45);
    if (searchedItemName.length === 0) return [];

    const items: SearchedItem[] = [];

    for (const tab of tabs) {
      for (const item of tab.items.concat(tab.items.map((item) => (item.containsItems ? item.containsItems : [])).flat())) {
        if (searchedItemName.includes(item.display_name)) {
          items.push({ item, sourceTab: { name: tab.id, icon: tab.icon } });
        }
      }
    }

    return items;
  });

  const tab = $derived<Tabs>(tabs.find((t) => t.id === openTab) as Tabs);
  const hasEmptyInventory = $derived(tabs.filter((tab) => tab.items.length > 0).length === 0);

  const [send, receive] = crossfade({
    duration: 300,
    easing: cubicInOut
  });
</script>

<CollapsibleSection id="Inventory" {order}>
  {#if !hasEmptyInventory}
    <Tabs.Root bind:value={openTab} class="bg-background/30 @container relative mb-0 rounded-lg p-5 pt-4">
      <Tabs.List>
        <ScrollArea.Root>
          <ScrollArea.Viewport class="border-icon border-b">
            <div class="flex! h-full shrink-0 flex-nowrap items-center gap-3 px-4 whitespace-nowrap">
              {#each tabs as tab (tab.id)}
                <Tabs.Trigger value={tab.id} class="group relative flex items-center justify-center gap-0.5 pb-2 text-xs uppercase">
                  <Avatar.Root class="size-8">
                    <Avatar.Image loading="lazy" src={tab.icon} class="size-8 object-contain" />
                    <Avatar.Fallback>
                      <Image class="size-8" />
                    </Avatar.Fallback>
                  </Avatar.Root>
                  {tab.id}
                  {#if openTab === tab.id}
                    <div class="bg-icon absolute -bottom-1 h-2 w-full rounded-full" in:send={{ key: "active-tab" }} out:receive={{ key: "active-tab" }}></div>
                  {:else}
                    <div class="bg-icon absolute -bottom-1 h-2 w-full rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" out:fade={{ duration: 300 }}></div>
                  {/if}
                </Tabs.Trigger>
              {/each}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="horizontal">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </Tabs.List>

      <Tabs.Content value={openTab}>
        {#if openTab === "storage" || openTab === "museum"}
          {@render multipleInventorySection()}
        {:else if openTab == "search"}
          {@render searchSection()}
        {:else}
          {@render inventorySection()}
        {/if}
      </Tabs.Content>
    </Tabs.Root>
  {:else}
    <p class="space-x-0.5 leading-6">{profile.username} doesn't have any items.</p>
  {/if}
</CollapsibleSection>

{#snippet itemSnippet(item: ProcessedSkyBlockItem, tab?: { name: string; icon: string })}
  <Item piece={item} isInventory={true} showRecombobulated={false} showCount={true} {tab} />
{/snippet}

{#snippet emptyItem()}
  <div class="bg-text/[0.04] aspect-square rounded-sm"></div>
{/snippet}

{#snippet gap()}
  <hr class="col-span-full h-4 border-0" />
{/snippet}

{#snippet searchSection()}
  <input type="search" placeholder="Search inventory" class="bg-text/10 text-text placeholder:text-text/80 mx-auto mt-4 block w-1/5 rounded-lg px-2 py-2 font-normal focus-visible:outline-none" bind:value={searchValue} />
  {#if searchValue && searchValue !== "" && searchedItems.length === 0}
    <p class="mx-auto w-fit leading-6">No items found.</p>
  {:else if searchValue !== ""}
    <div class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
      {#each searchedItems as item, index (index)}
        {#if item.item}
          <div class="bg-text/[0.04] flex aspect-square items-center justify-center rounded-sm">
            {@render itemSnippet(item.item, item.sourceTab)}
          </div>
        {:else}
          {@render emptyItem()}
        {/if}
      {/each}
    </div>
  {/if}
{/snippet}

{#snippet multipleInventorySection()}
  <Tabs.Root value={tab.id}>
    <Tabs.List class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
      {#if tab?.items?.length}
        {#each tab.items as item, index (index)}
          <Tabs.Trigger value={item.texture_path ? index.toString() : "undefined"} class="group">
            {#snippet child({ props })}
              <div {...props}>
                {#if item.texture_path}
                  <div class="group-data-[state=active]:bg-text/10 group-data-[state=inactive]:bg-text/[0.04] flex aspect-square items-center justify-center rounded-sm">
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
    {#if tab?.items?.length}
      {#each tab.items as item, index (index)}
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
                    <div class="bg-text/[0.04] flex aspect-square items-center justify-center rounded-sm">
                      {@render itemSnippet(containedItem)}
                    </div>
                  {:else}
                    {@render emptyItem()}
                  {/if}
                </Tabs.Content>
              {/each}
            {/if}
          </div>
        </Tabs.Content>
      {/each}
    {/if}
  </Tabs.Root>
{/snippet}

{#snippet inventorySection()}
  {#if tab?.items?.length}
    <div class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
      {#each tab.items as item, index (index)}
        {#if index > 0}
          {#if index % tab.gap === 0}
            {@render gap()}
          {/if}
        {/if}
        {#if item.texture_path}
          <div class="bg-text/[0.04] flex aspect-square items-center justify-center rounded-sm">
            {#if tab.id === "inv"}
              {@render itemSnippet({ ...item, rarity: item.rarity ?? "uncommon" } as ProcessedSkyBlockItem)}
            {:else}
              {@render itemSnippet(item)}
            {/if}
          </div>
        {:else}
          {@render emptyItem()}
        {/if}
      {/each}
    </div>
  {/if}
{/snippet}
