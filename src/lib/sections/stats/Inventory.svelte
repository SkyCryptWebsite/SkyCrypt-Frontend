<script lang="ts">
  import { getProfileContext } from "$ctx";
  import { env } from "$env/dynamic/public";
  import Item from "$lib/components/Item.svelte";
  import Notice from "$lib/components/Notice.svelte";
  import Section from "$lib/components/Section.svelte";
  import { type ModelsStrippedItem } from "$lib/shared/api/orval-generated";
  import { getInventorySection, searchInventorySection } from "$lib/shared/api/skycrypt-api.remote";
  import { renderLore, shouldShine } from "$lib/shared/helper";
  import { animateObfuscatedText } from "$lib/shared/mc-text/obfuscated";
  import { itemContentSpecial } from "$lib/stores/internal";
  import { performanceMode } from "$lib/stores/preferences";
  import Image from "@lucide/svelte/icons/image";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { Avatar, ScrollArea, Tabs } from "bits-ui";
  import { Debounced } from "runed";
  import { cubicOut } from "svelte/easing";
  import { crossfade, fade } from "svelte/transition";

  const { PUBLIC_API_URL } = env;

  type Tabs = {
    id: string;
    icon: string;
    gap: number;
  };

  let { order }: { order: number } = $props();
  let openTab = $state<string>("inventory");
  let searchValue = $state<string>();

  const profile = $derived(getProfileContext());
  const profileId = $derived(profile.profile_id);
  const uuid = $derived(profile.uuid);

  const debouncedSearchValue = $state(new Debounced(() => searchValue, 300));

  const tabs = $derived<Tabs[]>([
    {
      id: "inventory",
      icon: `https://crafatar.com/renders/head/${profile.uuid}?overlay`,
      gap: 27
    },
    {
      id: "backpack",
      icon: PUBLIC_API_URL + "item/CHEST",
      gap: 45
    },
    {
      id: "enderchest",
      icon: PUBLIC_API_URL + "item/ENDER_CHEST",
      gap: 45
    },
    {
      id: "personal_vault",
      icon: PUBLIC_API_URL + "head/f7aadff9ddc546fdcec6ed5919cc39dfa8d0c07ff4bc613a19f2e6d7f2593",
      gap: 45
    },
    {
      id: "talisman_bag",
      icon: PUBLIC_API_URL + "head/961a918c0c49ba8d053e522cb91abc74689367b4d8aa06bfc1ba9154730985ff",
      gap: 45
    },
    {
      id: "potion_bag",
      icon: PUBLIC_API_URL + "head/9f8b82427b260d0a61e6483fc3b2c35a585851e08a9a9df372548b4168cc817c",
      gap: 45
    },
    {
      id: "fishing_bag",
      icon: PUBLIC_API_URL + "head/eb8e297df6b8dffcf135dba84ec792d420ad8ecb458d144288572a84603b1631",
      gap: 45
    },
    {
      id: "quiver",
      icon: PUBLIC_API_URL + "head/4cb3acdc11ca747bf710e59f4c8e9b3d949fdd364c6869831ca878f0763d1787",
      gap: 45
    },
    {
      id: "museum",
      icon: PUBLIC_API_URL + "head/438cf3f8e54afc3b3f91d20a49f324dca1486007fe545399055524c17941f4dc",
      gap: 54
    },
    {
      id: "rift_inventory",
      icon: PUBLIC_API_URL + "head/445240fcf1a9796327dda5593985343af9121a7156bc76e3d6b341b02e6a6e52",
      gap: 45
    },
    {
      id: "rift_enderchest",
      icon: PUBLIC_API_URL + "head/a6cc486c2be1cb9dfcb2e53dd9a3e9a883bfadb27cb956f1896d602b4067",
      gap: 45
    },
    {
      id: "search",
      icon: PUBLIC_API_URL + "item/EYE_OF_ENDER",
      gap: 45
    }
  ]);

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
</script>

<Section id="Inventory" {order} class="min-h-[600px]">
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
      {#if openTab === "backpack" || openTab === "museum"}
        {@render multipleInventorySection()}
      {:else if openTab == "search"}
        {@render searchSection()}
      {:else}
        {@render inventorySection()}
        <!-- {:else if !tab.loading && !tab.error}
        <p class="mt-2 space-x-0.5 text-center leading-6">
          No items found in the {openTab.replaceAll("_", " ")}.
        </p> -->
      {/if}
    </Tabs.Content>
  </Tabs.Root>
</Section>

{#snippet itemSnippet(item: ModelsStrippedItem)}
  <Item piece={item} isInventory={true} showRecombobulated={false} showCount={true} />
{/snippet}

{#snippet emptyItem()}
  <div class="bg-text/4 aspect-square rounded-sm"></div>
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
  <svelte:boundary>
    {#snippet pending()}
      <LoaderCircle class="text-icon mx-auto mt-4 animate-spin" />
    {/snippet}
    {#snippet failed(err, retry)}
      <Notice title="An unexpected error has occurred" type="error" error={err} {retry} />
    {/snippet}
    {#if debouncedSearchValue.current === "" || !debouncedSearchValue.current}{:else}
      {@const items = await searchInventorySection({ uuid: uuid!, profileId: profileId!, inventoryId: "search", search: debouncedSearchValue.current })}

      {#if !items || items.length === 0}
        <p class="mx-auto w-fit leading-6">No items found.</p>
      {:else if debouncedSearchValue.current !== ""}
        <div class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
          {#each items as item, index (index)}
            {#if item}
              <div class="bg-text/4 data-[shine=true]:shine relative flex aspect-square items-center justify-center rounded-sm" data-shine={!$performanceMode && shouldShine(item)}>
                {@render itemSnippet(item)}
              </div>
            {:else}
              {@render emptyItem()}
            {/if}
          {/each}
        </div>
      {/if}
    {/if}
  </svelte:boundary>
{/snippet}

{#snippet multipleInventorySection()}
  <svelte:boundary>
    {@const items = await getInventorySection({ uuid: uuid!, profileId: profileId!, inventoryId: openTab })}

    {#snippet pending()}
      <LoaderCircle class="text-icon mx-auto mt-4 animate-spin" />
    {/snippet}
    {#snippet failed(err, retry)}
      <Notice title="An unexpected error has occurred" type="error" error={err} {retry} />
    {/snippet}

    <Tabs.Root value={tab.id}>
      <Tabs.List class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
        {#if items?.length}
          {#each items as item, index (index)}
            <Tabs.Trigger value={item.texture_path ? index.toString() : "undefined"} class="group">
              {#snippet child({ props })}
                <div {...props}>
                  {#if item.texture_path}
                    <div class="group-data-[state=active]:bg-text/10 group-data-[state=inactive]:bg-text/4 data-[shine=true]:shine relative flex aspect-square items-center justify-center rounded-sm" data-shine={!$performanceMode && shouldShine(item)}>
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
                      <div class="bg-text/4 data-[shine=true]:shine relative flex aspect-square items-center justify-center rounded-sm" data-shine={!$performanceMode && shouldShine(item)}>
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
  </svelte:boundary>
{/snippet}

{#snippet inventorySection()}
  <svelte:boundary>
    {@const items = await getInventorySection({ uuid: uuid!, profileId: profileId!, inventoryId: openTab })}
    {#snippet pending()}
      <LoaderCircle class="text-icon mx-auto mt-4 animate-spin" />
    {/snippet}
    {#snippet failed(err, retry)}
      <Notice title="An unexpected error has occurred" type="error" error={err} {retry} />
    {/snippet}

    {#if items?.length ?? 0 > 0}
      <div class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
        {#each items as item, index (index)}
          {#if index > 0}
            {#if index % tab.gap === 0}
              {@render gap()}
            {/if}
          {/if}
          {#if item.texture_path}
            <div class="bg-text/4 data-[shine=true]:shine relative flex aspect-square items-center justify-center rounded-sm" data-shine={!$performanceMode && shouldShine(item)}>
              {#if tab.id === "inventory"}
                {@render itemSnippet({ ...item, rarity: item.rarity ?? "uncommon" } as ModelsStrippedItem)}
              {:else}
                {@render itemSnippet(item)}
              {/if}
            </div>
          {:else}
            {@render emptyItem()}
          {/if}
        {/each}
      </div>
    {:else}
      <p class="mt-2 space-x-0.5 text-center leading-6">
        No items found in the {openTab.replaceAll("_", " ")}.
      </p>
    {/if}
  </svelte:boundary>
{/snippet}
