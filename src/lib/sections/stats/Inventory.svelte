<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import Error from "$lib/components/Error.svelte";
  import Item from "$lib/components/Item.svelte";
  import Section from "$lib/components/Section.svelte";
  import { api } from "$lib/shared/api";
  import type { ProcessedSkyBlockItem } from "$types/stats";
  import type { InventoryV2 } from "$types/statsv2";
  import Image from "@lucide/svelte/icons/image";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { createQuery } from "@tanstack/svelte-query";
  import { Avatar, ScrollArea, Tabs } from "bits-ui";
  import { Debounced } from "runed";
  import { cubicInOut } from "svelte/easing";
  import { crossfade, fade } from "svelte/transition";

  type Tabs = {
    id: string;
    icon: string;
    items: InventoryV2;
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
    queryKey: ["inventory", uuid, profileId, "backpack"],
    queryFn: () => api(fetch).getInventory(uuid, profileId, "backpack"),
    enabled: false
  });

  const inventoryQuery = createQuery({
    queryKey: ["inventory", uuid, profileId, "inventory"],
    queryFn: () => api(fetch).getInventory(uuid, profileId, "inventory"),
    enabled: false
  });

  const enderchestQuery = createQuery({
    queryKey: ["inventory", uuid, profileId, "enderchest"],
    queryFn: () => api(fetch).getInventory(uuid, profileId, "enderchest"),
    enabled: false
  });

  const armorQuery = createQuery({
    queryKey: ["inventory", uuid, profileId, "armor"],
    queryFn: () => api(fetch).getInventory(uuid, profileId, "armor"),
    enabled: false
  });

  const equipmentQuery = createQuery({
    queryKey: ["inventory", uuid, profileId, "equipment"],
    queryFn: () => api(fetch).getInventory(uuid, profileId, "equipment"),
    enabled: false
  });

  const personalVaultQuery = createQuery({
    queryKey: ["inventory", uuid, profileId, "personal_vault"],
    queryFn: () => api(fetch).getInventory(uuid, profileId, "personal_vault"),
    enabled: false
  });

  const wardrobeQuery = createQuery({
    queryKey: ["inventory", uuid, profileId, "wardrobe"],
    queryFn: () => api(fetch).getInventory(uuid, profileId, "wardrobe"),
    enabled: false
  });

  const riftInventoryQuery = createQuery({
    queryKey: ["inventory", uuid, profileId, "rift_inventory"],
    queryFn: () => api(fetch).getInventory(uuid, profileId, "rift_inventory"),
    enabled: false
  });

  const riftEnderchestQuery = createQuery({
    queryKey: ["inventory", uuid, profileId, "rift_enderchest"],
    queryFn: () => api(fetch).getInventory(uuid, profileId, "rift_enderchest"),
    enabled: false
  });

  const riftArmorQuery = createQuery({
    queryKey: ["inventory", uuid, profileId, "rift_armor"],
    queryFn: () => api(fetch).getInventory(uuid, profileId, "rift_armor"),
    enabled: false
  });

  const riftEquipmentQuery = createQuery({
    queryKey: ["inventory", uuid, profileId, "rift_equipment"],
    queryFn: () => api(fetch).getInventory(uuid, profileId, "rift_equipment"),
    enabled: false
  });

  const potionBagQuery = createQuery({
    queryKey: ["inventory", uuid, profileId, "potion_bag"],
    queryFn: () => api(fetch).getInventory(uuid, profileId, "potion_bag"),
    enabled: false
  });

  const talismanBagQuery = createQuery({
    queryKey: ["inventory", uuid, profileId, "talisman_bag"],
    queryFn: () => api(fetch).getInventory(uuid, profileId, "talisman_bag"),
    enabled: false
  });

  const fishingBagQuery = createQuery({
    queryKey: ["inventory", uuid, profileId, "fishing_bag"],
    queryFn: () => api(fetch).getInventory(uuid, profileId, "fishing_bag"),
    enabled: false
  });

  const quiverQuery = createQuery({
    queryKey: ["inventory", uuid, profileId, "quiver"],
    queryFn: () => api(fetch).getInventory(uuid, profileId, "quiver"),
    enabled: false
  });

  const museumQuery = createQuery({
    queryKey: ["inventory", uuid, profileId, "museum"],
    queryFn: () => api(fetch).getInventory(uuid, profileId, "museum"),
    enabled: false
  });

  const searchQuery = createQuery({
    queryKey: ["inventory", uuid, profileId, "search"],
    queryFn: () => api(fetch).getInventory(uuid, profileId, "search"),
    enabled: false
  });

  const debouncedSearchValue = new Debounced(() => searchValue, 300);

  // Refactor this or remove it if not needed
  // const inventory = $derived(inventoryData?.inventory.slice(9).concat(inventoryData?.inventory.slice(0, 9)));

  const tabs = $derived<Tabs[]>([
    {
      id: "inventory",
      icon: `https://crafatar.com/renders/head/${profile.uuid}?overlay`,
      items: $inventoryQuery.data ?? [],
      gap: 27
    },
    {
      id: "backpack",
      icon: "/api/item/chest",
      items: $backpackQuery.data ?? [],
      gap: 45
    },
    {
      id: "enderchest",
      icon: "/api/item/ender_chest",
      items: $enderchestQuery.data ?? [],
      gap: 45
    },
    {
      id: "personal_vault",
      icon: "/api/head/f7aadff9ddc546fdcec6ed5919cc39dfa8d0c07ff4bc613a19f2e6d7f2593",
      items: $personalVaultQuery.data ?? [],
      gap: 45
    },
    {
      id: "talisman_bag",
      icon: "/api/head/961a918c0c49ba8d053e522cb91abc74689367b4d8aa06bfc1ba9154730985ff",
      items: $talismanBagQuery.data ?? [],
      gap: 45
    },
    {
      id: "potion_bag",
      icon: "/api/head/9f8b82427b260d0a61e6483fc3b2c35a585851e08a9a9df372548b4168cc817c",
      items: $potionBagQuery.data ?? [],
      gap: 45
    },
    {
      id: "fishing_bag",
      icon: "/api/head/eb8e297df6b8dffcf135dba84ec792d420ad8ecb458d144288572a84603b1631",
      items: $fishingBagQuery.data ?? [],
      gap: 45
    },
    {
      id: "quiver",
      icon: "/api/head/4cb3acdc11ca747bf710e59f4c8e9b3d949fdd364c6869831ca878f0763d1787",
      items: $quiverQuery.data ?? [],
      gap: 45
    },
    {
      id: "museum",
      icon: "/api/head/438cf3f8e54afc3b3f91d20a49f324dca1486007fe545399055524c17941f4dc",
      items: $museumQuery.data ?? [],
      gap: 54
    },
    {
      id: "rift_inventory",
      icon: "/api/head/445240fcf1a9796327dda5593985343af9121a7156bc76e3d6b341b02e6a6e52",
      items: $riftInventoryQuery.data ?? [],
      gap: 45
    },
    {
      id: "rift_enderchest",
      icon: "/api/head/a6cc486c2be1cb9dfcb2e53dd9a3e9a883bfadb27cb956f1896d602b4067",
      items: $riftEnderchestQuery.data ?? [],
      gap: 45
    },
    {
      id: "search",
      icon: "/api/item/EYE_OF_ENDER",
      items: $searchQuery.data ?? [],
      gap: 45
    }
  ]);

  const searchedItems = $derived.by<ProcessedSkyBlockItem[] | []>(() => {
    if (!$searchQuery.data) return [];
    const search = debouncedSearchValue.current?.trim();
    if (!search) return [];
    const searchedItemName = $searchQuery.data.filter((item) => item?.display_name?.toLowerCase().includes(search?.toLowerCase())).slice(0, 45);
    if (searchedItemName.length === 0) return [];

    return searchedItemName;
  });

  const tab = $derived<Tabs>(tabs?.find((t) => t.id === openTab) as Tabs);
  // const hasEmptyInventory = $derived(tabs?.filter((tab) => tab.items.length > 0).length === 0);

  const [send, receive] = crossfade({
    duration: 300,
    easing: cubicInOut
  });

  const isLoading = $derived($backpackQuery.isLoading || $inventoryQuery.isLoading || $enderchestQuery.isLoading || $armorQuery.isLoading || $equipmentQuery.isLoading || $personalVaultQuery.isLoading || $wardrobeQuery.isLoading || $riftInventoryQuery.isLoading || $riftEnderchestQuery.isLoading || $riftArmorQuery.isLoading || $riftEquipmentQuery.isLoading || $potionBagQuery.isLoading || $talismanBagQuery.isLoading || $fishingBagQuery.isLoading || $quiverQuery.isLoading || $museumQuery.isLoading || $searchQuery.isLoading);

  const hasErrored = $derived.by(() => ({
    backpack: $backpackQuery.isError,
    inventory: $inventoryQuery.isError,
    enderchest: $enderchestQuery.isError,
    armor: $armorQuery.isError,
    equipment: $equipmentQuery.isError,
    personal_vault: $personalVaultQuery.isError,
    wardrobe: $wardrobeQuery.isError,
    rift_inventory: $riftInventoryQuery.isError,
    rift_enderchest: $riftEnderchestQuery.isError,
    rift_armor: $riftArmorQuery.isError,
    rift_equipment: $riftEquipmentQuery.isError,
    potion_bag: $potionBagQuery.isError,
    talisman_bag: $talismanBagQuery.isError,
    fishing_bag: $fishingBagQuery.isError,
    quiver: $quiverQuery.isError,
    museum: $museumQuery.isError,
    search: $searchQuery.isError
  }));

  $effect(() => {
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
        if ($searchQuery.isSuccess) return;
        $searchQuery.refetch();
        break;
      default:
        console.warn(`Unknown tab: ${openTab}`);
        break;
    }
  });
</script>

<Section id="Inventory" {order} class="min-h-[600px]">
  <!-- {#if !hasEmptyInventory} -->
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
                {tab.id.replaceAll("_", " ")}
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
      {#if openTab === "backpack" || openTab === "museum"}
        {@render multipleInventorySection()}
      {:else if openTab == "search"}
        {@render searchSection()}
      {:else}
        {@render inventorySection()}
      {/if}
    </Tabs.Content>
  </Tabs.Root>
  <!-- {:else}
    <p class="space-x-0.5 leading-6">{profile.username} doesn't have any items.</p>
  {/if} -->
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
  <input type="search" placeholder="Search inventory" class="bg-text/10 text-text placeholder:text-text/80 mx-auto mt-4 block w-1/5 rounded-lg px-2 py-2 font-normal focus-visible:outline-none" bind:value={searchValue} />
  {#if searchValue && searchValue !== "" && searchedItems.length === 0}
    <p class="mx-auto w-fit leading-6">No items found.</p>
  {:else if searchValue !== ""}
    <div class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
      {#each searchedItems as item, index (index)}
        {#if item}
          <div class="bg-text/[0.04] flex aspect-square items-center justify-center rounded-sm">
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
  {#if isLoading}
    <LoaderCircle class="text-icon animate-spin" />
  {/if}
  {#if hasErrored[tab?.id as keyof typeof hasErrored]}
    <Error />
  {/if}

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
