<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import { getClientApiUrl } from "$lib/client/api-config";
  import Item from "$lib/components/Item.svelte";
  import Notice from "$lib/components/Notice.svelte";
  import Section from "$lib/components/Section.svelte";
  import { api, SectionName } from "$lib/shared/api";
  import { renderLore, shouldShine } from "$lib/shared/helper";
  import { animateObfuscatedText } from "$lib/shared/motd/obfuscated";
  import { itemContentSpecial } from "$lib/stores/internal";
  import { performanceMode } from "$lib/stores/preferences";
  import type { ProcessedSkyBlockItem } from "$types/stats";
  import type { InventoryV2 } from "$types/statsv2";
  import Image from "@lucide/svelte/icons/image";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { createQuery } from "@tanstack/svelte-query";
  import { Avatar, ScrollArea, Tabs } from "bits-ui";
  import { Debounced } from "runed";
  import { untrack } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { crossfade, fade } from "svelte/transition";

  const apiUrl = getClientApiUrl();

  type Tabs = {
    id: string;
    icon: string;
    items: InventoryV2["items"];
    loading: boolean;
    error: boolean;
    gap: number;
  };

  let { order }: { order: number } = $props();
  let openTab = $state<string>("inventory");
  let searchValue = $state<string>();

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
  const profileId = $derived(profile.profile_id);
  const uuid = $derived(profile.uuid);

  // Use this for the actual inventory queries
  const _inventories = ["backpack", "inventory", "enderchest", "armor", "equipment", "personal_vault", "wardrobe", "rift_inventory", "rift_enderchest", "rift_armor", "rift_equipment", "potion_bag", "talisman_bag", "fishing_bag", "quiver", "museum", "search"] as readonly string[]; // List of inventory types to be used in the tabs

  const backpackQuery = createQuery({
    queryKey: [SectionName.INVENTORY, uuid, profileId, "backpack"],
    queryFn: () => api().getInventory(uuid, profileId, "backpack"),
    enabled: false
  });

  const inventoryQuery = createQuery({
    queryKey: [SectionName.INVENTORY, uuid, profileId, "inventory"],
    queryFn: () => api().getInventory(uuid, profileId, "inventory"),
    enabled: true
  });

  const enderchestQuery = createQuery({
    queryKey: [SectionName.INVENTORY, uuid, profileId, "enderchest"],
    queryFn: () => api().getInventory(uuid, profileId, "enderchest"),
    enabled: false
  });

  const armorQuery = createQuery({
    queryKey: [SectionName.INVENTORY, uuid, profileId, "armor"],
    queryFn: () => api().getInventory(uuid, profileId, "armor"),
    enabled: false
  });

  const equipmentQuery = createQuery({
    queryKey: [SectionName.INVENTORY, uuid, profileId, "equipment"],
    queryFn: () => api().getInventory(uuid, profileId, "equipment"),
    enabled: false
  });

  const personalVaultQuery = createQuery({
    queryKey: [SectionName.INVENTORY, uuid, profileId, "personal_vault"],
    queryFn: () => api().getInventory(uuid, profileId, "personal_vault"),
    enabled: false
  });

  const wardrobeQuery = createQuery({
    queryKey: [SectionName.INVENTORY, uuid, profileId, "wardrobe"],
    queryFn: () => api().getInventory(uuid, profileId, "wardrobe"),
    enabled: false
  });

  const riftInventoryQuery = createQuery({
    queryKey: [SectionName.INVENTORY, uuid, profileId, "rift_inventory"],
    queryFn: () => api().getInventory(uuid, profileId, "rift_inventory"),
    enabled: false
  });

  const riftEnderchestQuery = createQuery({
    queryKey: [SectionName.INVENTORY, uuid, profileId, "rift_enderchest"],
    queryFn: () => api().getInventory(uuid, profileId, "rift_enderchest"),
    enabled: false
  });

  const riftArmorQuery = createQuery({
    queryKey: [SectionName.INVENTORY, uuid, profileId, "rift_armor"],
    queryFn: () => api().getInventory(uuid, profileId, "rift_armor"),
    enabled: false
  });

  const riftEquipmentQuery = createQuery({
    queryKey: [SectionName.INVENTORY, uuid, profileId, "rift_equipment"],
    queryFn: () => api().getInventory(uuid, profileId, "rift_equipment"),
    enabled: false
  });

  const potionBagQuery = createQuery({
    queryKey: [SectionName.INVENTORY, uuid, profileId, "potion_bag"],
    queryFn: () => api().getInventory(uuid, profileId, "potion_bag"),
    enabled: false
  });

  const talismanBagQuery = createQuery({
    queryKey: [SectionName.INVENTORY, uuid, profileId, "talisman_bag"],
    queryFn: () => api().getInventory(uuid, profileId, "talisman_bag"),
    enabled: false
  });

  const fishingBagQuery = createQuery({
    queryKey: [SectionName.INVENTORY, uuid, profileId, "fishing_bag"],
    queryFn: () => api().getInventory(uuid, profileId, "fishing_bag"),
    enabled: false
  });

  const quiverQuery = createQuery({
    queryKey: [SectionName.INVENTORY, uuid, profileId, "quiver"],
    queryFn: () => api().getInventory(uuid, profileId, "quiver"),
    enabled: false
  });

  const museumQuery = createQuery({
    queryKey: [SectionName.INVENTORY, uuid, profileId, "museum"],
    queryFn: () => api().getInventory(uuid, profileId, "museum"),
    enabled: false
  });

  const searchQuery = createQuery({
    queryKey: [SectionName.INVENTORY, uuid, profileId, "search"],
    queryFn: () => api().getInventory(uuid, profileId, "search", debouncedSearchValue.current),
    enabled: false
  });

  const debouncedSearchValue = $state(new Debounced(() => searchValue, 300));

  const tabs = $derived<Tabs[]>([
    {
      id: "inventory",
      icon: `https://crafatar.com/renders/head/${profile.uuid}?overlay`,
      items: $inventoryQuery.data?.items ?? [],
      loading: $inventoryQuery.isLoading,
      error: $inventoryQuery.isError,
      gap: 27
    },
    {
      id: "backpack",
      icon: apiUrl + "item/CHEST",
      items: $backpackQuery.data?.items ?? [],
      loading: $backpackQuery.isLoading,
      error: $backpackQuery.isError,
      gap: 45
    },
    {
      id: "enderchest",
      icon: apiUrl + "item/ENDER_CHEST",
      items: $enderchestQuery.data?.items ?? [],
      loading: $enderchestQuery.isLoading,
      error: $enderchestQuery.isError,
      gap: 45
    },
    {
      id: "personal_vault",
      icon: apiUrl + "head/f7aadff9ddc546fdcec6ed5919cc39dfa8d0c07ff4bc613a19f2e6d7f2593",
      items: $personalVaultQuery.data?.items ?? [],
      loading: $personalVaultQuery.isLoading,
      error: $personalVaultQuery.isError,
      gap: 45
    },
    {
      id: "talisman_bag",
      icon: apiUrl + "head/961a918c0c49ba8d053e522cb91abc74689367b4d8aa06bfc1ba9154730985ff",
      items: $talismanBagQuery.data?.items ?? [],
      loading: $talismanBagQuery.isLoading,
      error: $talismanBagQuery.isError,
      gap: 45
    },
    {
      id: "potion_bag",
      icon: apiUrl + "head/9f8b82427b260d0a61e6483fc3b2c35a585851e08a9a9df372548b4168cc817c",
      items: $potionBagQuery.data?.items ?? [],
      loading: $potionBagQuery.isLoading,
      error: $potionBagQuery.isError,
      gap: 45
    },
    {
      id: "fishing_bag",
      icon: apiUrl + "head/eb8e297df6b8dffcf135dba84ec792d420ad8ecb458d144288572a84603b1631",
      items: $fishingBagQuery.data?.items ?? [],
      loading: $fishingBagQuery.isLoading,
      error: $fishingBagQuery.isError,
      gap: 45
    },
    {
      id: "quiver",
      icon: apiUrl + "head/4cb3acdc11ca747bf710e59f4c8e9b3d949fdd364c6869831ca878f0763d1787",
      items: $quiverQuery.data?.items ?? [],
      loading: $quiverQuery.isLoading,
      error: $quiverQuery.isError,
      gap: 45
    },
    {
      id: "museum",
      icon: apiUrl + "head/438cf3f8e54afc3b3f91d20a49f324dca1486007fe545399055524c17941f4dc",
      items: $museumQuery.data?.items ?? [],
      loading: $museumQuery.isLoading,
      error: $museumQuery.isError,
      gap: 54
    },
    {
      id: "rift_inventory",
      icon: apiUrl + "head/445240fcf1a9796327dda5593985343af9121a7156bc76e3d6b341b02e6a6e52",
      items: $riftInventoryQuery.data?.items ?? [],
      loading: $riftInventoryQuery.isLoading,
      error: $riftInventoryQuery.isError,
      gap: 45
    },
    {
      id: "rift_enderchest",
      icon: apiUrl + "head/a6cc486c2be1cb9dfcb2e53dd9a3e9a883bfadb27cb956f1896d602b4067",
      items: $riftEnderchestQuery.data?.items ?? [],
      loading: $riftEnderchestQuery.isLoading,
      error: $riftEnderchestQuery.isError,
      gap: 45
    },
    {
      id: "search",
      icon: apiUrl + "item/EYE_OF_ENDER",
      items: $searchQuery.data?.items ?? [],
      loading: $searchQuery.isLoading,
      error: $searchQuery.isError,
      gap: 45
    }
  ]);

  const searchedItems = $derived.by<ProcessedSkyBlockItem[] | []>(() => {
    if (!$searchQuery.data?.items) return [];
    const search = debouncedSearchValue.current?.trim();
    if (!search) return [];
    const searchedItemName = $searchQuery.data.items.filter((item) => item?.display_name?.toLowerCase().includes(search?.toLowerCase())).slice(0, 45);
    if (searchedItemName.length === 0) return [];
    return searchedItemName;
  });

  const itemsFound = $derived(!debouncedSearchValue.pending && !$searchQuery.isLoading && debouncedSearchValue.current && debouncedSearchValue.current !== "" && searchedItems.length === 0);

  const tab = $derived<Tabs>(tabs?.find((t) => t.id === openTab) as Tabs);

  const [send, receive] = crossfade({
    duration: 300,
    easing: cubicOut
  });

  itemContentSpecial.subscribe((item) => {
    if (item) {
      if (openTab === "search" || openTab === "backpack" || openTab === "museum") {
        console.warn("Item content special should not be set for search, backpack, or museum tabs.");
        itemContentSpecial.set(undefined);
      }
    }
  });

  $effect.pre(() => {
    switch (openTab) {
      case "backpack":
        if ($backpackQuery.isSuccess) return;
        $backpackQuery.refetch();
        break;
      case "inventory":
        if ($inventoryQuery.isSuccess) return;
        $inventoryQuery.refetch();
        break;
      case "enderchest":
        if ($enderchestQuery.isSuccess) return;
        $enderchestQuery.refetch();
        break;
      case "armor":
        if ($armorQuery.isSuccess) return;
        $armorQuery.refetch();
        break;
      case "equipment":
        if ($equipmentQuery.isSuccess) return;
        $equipmentQuery.refetch();
        break;
      case "personal_vault":
        if ($personalVaultQuery.isSuccess) return;
        $personalVaultQuery.refetch();
        break;
      case "wardrobe":
        if ($wardrobeQuery.isSuccess) return;
        $wardrobeQuery.refetch();
        break;
      case "rift_inventory":
        if ($riftInventoryQuery.isSuccess) return;
        $riftInventoryQuery.refetch();
        break;
      case "rift_enderchest":
        if ($riftEnderchestQuery.isSuccess) return;
        $riftEnderchestQuery.refetch();
        break;
      case "rift_armor":
        if ($riftArmorQuery.isSuccess) return;
        $riftArmorQuery.refetch();
        break;
      case "rift_equipment":
        if ($riftEquipmentQuery.isSuccess) return;
        $riftEquipmentQuery.refetch();
        break;
      case "potion_bag":
        if ($potionBagQuery.isSuccess) return;
        $potionBagQuery.refetch();
        break;
      case "talisman_bag":
        if ($talismanBagQuery.isSuccess) return;
        $talismanBagQuery.refetch();
        break;
      case "fishing_bag":
        if ($fishingBagQuery.isSuccess) return;
        $fishingBagQuery.refetch();
        break;
      case "quiver":
        if ($quiverQuery.isSuccess) return;
        $quiverQuery.refetch();
        break;
      case "museum":
        if ($museumQuery.isSuccess) return;
        $museumQuery.refetch();
        break;
      case "search":
        break; // Search is handled separately
      default:
        console.warn(`Unknown tab: ${openTab}`);
        break;
    }
  });

  $effect(() => {
    if (debouncedSearchValue.current && debouncedSearchValue.current !== "" && openTab === "search") {
      untrack(() => {
        if (!debouncedSearchValue.pending) {
          $searchQuery.refetch();
        }
      });
    }
  });
</script>

<Section id="Inventory" {order} class="min-h-[600px]">
  <Tabs.Root bind:value={openTab} class="bg-background/30 @container relative mb-0 rounded-lg p-5 pt-4">
    <Tabs.List>
      <ScrollArea.Root>
        <ScrollArea.Viewport class="border-icon border-b">
          <div class="flex! h-full shrink-0 flex-nowrap items-center gap-3 whitespace-nowrap px-4">
            {#each tabs as tab (tab.id)}
              <Tabs.Trigger value={tab.id} class="group relative flex items-center justify-center gap-0.5 pb-2 text-xs uppercase">
                <Avatar.Root class="size-8">
                  <Avatar.Image loading="lazy" src={tab.icon} class="size-8 object-contain" />
                  <Avatar.Fallback>
                    <Image class="size-8" />
                  </Avatar.Fallback>
                </Avatar.Root>
                {tab.id.replaceAll("_", " ")}
                {#if openTab === tab.id}
                  <div class="bg-icon absolute -bottom-1 h-2 w-full rounded-full" in:send={{ key: "active-tab" }} out:receive={{ key: "active-tab" }}></div>
                {:else}
                  <div class="bg-icon absolute -bottom-1 h-2 w-full rounded-full opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" out:fade={{ duration: 300, easing: cubicOut }}></div>
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
      {#if openTab !== "search"}
        {#if tab.loading}
          <LoaderCircle class="text-icon mx-auto mt-4 animate-spin" />
        {/if}
        {#if tab.error}
          <Notice title="An unexpected error has occurred" type="error" />
        {/if}
      {/if}

      {#if openTab === "backpack" || openTab === "museum"}
        {#if tabs.find((tab) => tab.id === openTab)?.items?.length ?? 0 > 0}
          {@render multipleInventorySection()}
        {:else}
          <p class="mt-2 space-x-0.5 text-center leading-6">
            No items found in the {openTab.replaceAll("_", " ")}.
          </p>
        {/if}
      {:else if openTab == "search"}
        {@render searchSection()}
      {:else if tabs.find((tab) => tab.id === openTab)?.items?.length ?? 0 > 0}
        {@render inventorySection()}
      {:else if !tab.loading && !tab.error}
        <p class="mt-2 space-x-0.5 text-center leading-6">
          No items found in the {openTab.replaceAll("_", " ")}.
        </p>
      {/if}
    </Tabs.Content>
  </Tabs.Root>
</Section>

{#snippet itemSnippet(item: ProcessedSkyBlockItem)}
  <Item piece={item} isInventory={true} showRecombobulated={false} showCount={true} />
{/snippet}

{#snippet emptyItem()}
  <div class="bg-text/[0.04] aspect-square rounded-sm"></div>
{/snippet}

{#snippet gap()}
  <hr class="col-span-full h-4 border-0" />
{/snippet}

{#snippet searchSection()}
  <input
    type="search"
    placeholder="Search all inventories"
    class="bg-text/10 text-text placeholder:text-text/80 mx-auto mt-4 block w-full max-w-52 rounded-lg px-2 py-2 font-normal focus-visible:outline-none"
    bind:value={searchValue}
    onkeydown={(e) => {
      e.stopPropagation();
    }} />
  {#if debouncedSearchValue.pending || $searchQuery.isLoading}
    <LoaderCircle class="text-icon mx-auto mt-4 animate-spin" />
  {/if}
  {#if $searchQuery.isError}
    <Notice title="An unexpected error has occurred" type="error" />
  {/if}

  {#if itemsFound}
    <p class="mx-auto w-fit leading-6">No items found.</p>
  {:else if debouncedSearchValue.current !== ""}
    <div class="@md:gap-1.5 @xl:gap-2 grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5">
      {#each searchedItems as item, index (index)}
        {#if item}
          <div class="bg-text/[0.04] data-[shine=true]:shine relative flex aspect-square items-center justify-center rounded-sm" data-shine={!$performanceMode && shouldShine(item)}>
            {@render itemSnippet(item)}
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
    <Tabs.List class="@md:gap-1.5 @xl:gap-2 grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5">
      {#if tab?.items?.length}
        {#each tab.items as item, index (index)}
          <Tabs.Trigger value={item.texture_path ? index.toString() : "undefined"} class="group">
            {#snippet child({ props })}
              <div {...props}>
                {#if item.texture_path}
                  <div class="group-data-[state=active]:bg-text/10 group-data-[state=inactive]:bg-text/[0.04] data-[shine=true]:shine relative flex aspect-square items-center justify-center rounded-sm" data-shine={!$performanceMode && shouldShine(item)}>
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
          <div class="@md:gap-1.5 @xl:gap-2 grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5">
            {#if item?.containsItems}
              {#each item.containsItems as containedItem, index2 (index2)}
                {#if index2 > 0}
                  {#if index2 % 54 === 0}
                    {@render gap()}
                  {/if}
                {/if}
                <Tabs.Content value={index.toString()}>
                  {#if containedItem.texture_path}
                    <div class="bg-text/[0.04] data-[shine=true]:shine relative flex aspect-square items-center justify-center rounded-sm" data-shine={!$performanceMode && shouldShine(item)}>
                      {@render itemSnippet(containedItem)}
                    </div>
                  {:else}
                    {@render emptyItem()}
                  {/if}
                </Tabs.Content>
              {/each}
            {/if}
          </div>
          <div class="@md:gap-1.5 @xl:gap-2 grid place-content-center gap-1 pt-5" {@attach animateObfuscatedText}>
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

{#snippet inventorySection()}
  {#if tab?.items?.length}
    <div class="@md:gap-1.5 @xl:gap-2 grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5">
      {#each tab.items as item, index (index)}
        {#if index > 0}
          {#if index % tab.gap === 0}
            {@render gap()}
          {/if}
        {/if}
        {#if item.texture_path}
          <div class="bg-text/[0.04] data-[shine=true]:shine relative flex aspect-square items-center justify-center rounded-sm" data-shine={!$performanceMode && shouldShine(item)}>
            {#if tab.id === "inventory"}
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
