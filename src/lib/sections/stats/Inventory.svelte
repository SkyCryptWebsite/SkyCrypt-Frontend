<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";
  import Item from "$lib/components/Item.svelte";
  import type { ProcessedSkyBlockItem } from "$lib/types/stats";
  import { Avatar, ScrollArea, Tabs } from "bits-ui";
  import Image from "lucide-svelte/icons/image";
  import { cubicInOut } from "svelte/easing";
  import { writable } from "svelte/store";
  import { crossfade, fade } from "svelte/transition";

  let { order }: { order: number } = $props();
  let openStorageTab = writable<string>("0");

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

  const openTab = writable<string>("inv");

  const tabs = $derived(
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
      }
    ].filter((tab) => tab.items.length > 0)
  );

  const [send, receive] = crossfade({
    duration: 300,
    easing: cubicInOut
  });

  const renderedItems = writable<number>(54);
  async function loadItemsInChunks(totalItems: number) {
    const CHUNK_SIZE = $openTab === "museum" ? 54 : 45;
    const delay = 50;

    for (let i = CHUNK_SIZE; i < totalItems; i += CHUNK_SIZE) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      renderedItems.set(i + CHUNK_SIZE);
    }
  }

  $effect(() => {
    if ($openTab === "storage") {
      openStorageTab.set("0");
    } else if ($openTab === "museum") {
      openStorageTab.set("19");
    }

    if ($openTab) {
      const currentTab = tabs.find((tab) => tab.id === $openTab);
      if (currentTab) {
        renderedItems.set($openTab === "museum" ? 54 : 45);
        const totalItems = currentTab.items.length;
        loadItemsInChunks(totalItems);
      }
    }
  });
</script>

<CollapsibleSection id="Inventory" {order}>
  {#if tabs.length > 0}
    <Tabs.Root bind:value={$openTab} class="relative mb-0 rounded-lg bg-background/30 p-5 pt-4 @container">
      <Tabs.List>
        <ScrollArea.Root>
          <ScrollArea.Viewport class="border-b border-icon">
            <ScrollArea.Content class="!flex h-full shrink-0 flex-nowrap items-center gap-3 whitespace-nowrap px-4">
              {#each tabs as tab}
                {@const isActive = $openTab === tab.id}
                <Tabs.Trigger value={tab.id} class="group relative flex items-center justify-center gap-0.5 pb-2 text-xs uppercase">
                  <Avatar.Root class="size-8">
                    <Avatar.Image loading="lazy" src={tab.icon} class="size-8 object-contain" />
                    <Avatar.Fallback>
                      <Image class="size-8" />
                    </Avatar.Fallback>
                  </Avatar.Root>
                  {tab.id}
                  {#if isActive}
                    <div class="absolute -bottom-1 h-2 w-full rounded-full bg-icon" in:send={{ key: "active-tab" }} out:receive={{ key: "active-tab" }}></div>
                  {:else}
                    <div class="absolute -bottom-1 h-2 w-full rounded-full bg-icon opacity-0 transition-opacity duration-300 group-hover:opacity-100" out:fade={{ duration: 300 }}></div>
                  {/if}
                </Tabs.Trigger>
              {/each}
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="horizontal">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </Tabs.List>

      {#each tabs as tab}
        <Tabs.Content value={tab.id} asChild let:builder>
          {#if $openTab === tab.id}
            {#if tab.id === "storage" || tab.id === "museum"}
              <div use:builder.action {...builder}>
                <Tabs.Root bind:value={$openStorageTab}>
                  <Tabs.List class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
                    {#each tab.items.slice(0, $renderedItems) as item, index}
                      <Tabs.Trigger let:builder asChild value={item.texture_path ? index.toString() : "undefined"}>
                        <div use:builder.action {...builder} class="group">
                          {#if item.texture_path}
                            <div class="flex aspect-square items-center justify-center rounded group-data-[state=active]:bg-text/10 group-data-[state=inactive]:bg-text/[0.04]" in:fade={{ duration: 300, delay: 5 * (index + 1) }}>
                              <Item piece={item} isInventory={true} showRecombobulated={false} />
                            </div>
                          {:else}
                            <div class="aspect-square rounded bg-text/[0.04]" in:fade={{ duration: 300, delay: 5 * (index + 1) }}></div>
                          {/if}
                        </div>
                      </Tabs.Trigger>
                    {/each}
                  </Tabs.List>
                  {#if tab.items[Number($openStorageTab)]?.containsItems}
                    {@const containedItems = (tab.items[Number($openStorageTab)].containsItems as ProcessedSkyBlockItem[]) || []}
                    <div class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-8 @md:gap-1.5 @xl:gap-2">
                      {#each containedItems.slice(0, $renderedItems) as containedItem, index}
                        {#if index > 0}
                          {#if index % 54 === 0}
                            <hr class="col-span-full h-4 border-0" />
                          {/if}
                        {/if}
                        <Tabs.Content value={$openStorageTab.toString()}>
                          {#key $openStorageTab}
                            {#if containedItem.texture_path}
                              <div class="flex aspect-square items-center justify-center rounded bg-text/[0.04]" in:fade|global={{ duration: 300, delay: 5 * (index + 1) }}>
                                <Item piece={containedItem} isInventory={true} showRecombobulated={false} showCount={true} />
                              </div>
                            {:else}
                              <div class="aspect-square rounded bg-text/[0.04]" in:fade|global={{ duration: 300, delay: 5 * (index + 1) }}></div>
                            {/if}
                          {/key}
                        </Tabs.Content>
                      {/each}
                    </div>
                  {/if}
                </Tabs.Root>
              </div>
            {:else}
              <div use:builder.action {...builder} class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
                {#each tab.items.slice(0, $renderedItems) as item, index}
                  {#if index > 0}
                    {#if index % tab.gap === 0}
                      <hr class="col-start-1 col-end-10 h-4 border-0" />
                    {/if}
                  {/if}
                  {#if item.texture_path}
                    <div class="flex aspect-square items-center justify-center rounded bg-text/[0.04]" in:fade|global={{ duration: 300, delay: 5 * (index + 1) }}>
                      {#if tab.id === "inv"}
                        <Item piece={{ ...item, rarity: item.rarity ?? "uncommon" } as ProcessedSkyBlockItem} isInventory={true} showRecombobulated={false} showCount={true} />
                      {:else}
                        <Item piece={item} isInventory={true} showRecombobulated={false} showCount={true} />
                      {/if}
                    </div>
                  {:else}
                    <div class="aspect-square rounded bg-text/[0.04]" in:fade|global={{ duration: 300, delay: 5 * (index + 1) }}></div>
                  {/if}
                {/each}
              </div>
            {/if}
          {/if}
        </Tabs.Content>
      {/each}
    </Tabs.Root>
  {:else}
    <p class="space-x-0.5 leading-6">{profile.username} doesn't have any items.</p>
  {/if}
</CollapsibleSection>
