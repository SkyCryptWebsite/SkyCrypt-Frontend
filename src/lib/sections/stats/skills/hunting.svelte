<script lang="ts">
  import { getSkillsContext } from "$ctx";
  import { Chip } from "$lib/components/misc";
  import ScrollAreaPrimitive from "$lib/components/ScrollAreaPrimitive.svelte";
  import { AdditionStat } from "$lib/components/stats";
  import Items from "$lib/layouts/stats/Items.svelte";
  import type { ModelsAttributeShard } from "$lib/shared/api/orval-generated";
  import { RARITIES } from "$lib/shared/constants/rarities";
  import { getRarityClass, renderLore, titleCase } from "$lib/shared/helper";
  import { cn } from "$lib/shared/utils";
  import { tz } from "@date-fns/tz";
  import { ScrollArea, Tabs } from "bits-ui";
  import { formatDate } from "date-fns";
  import { format } from "numerable";

  type RarityTab = string;

  const skills = $derived(getSkillsContext().skills);
  const hunting = $derived(skills?.hunting);
  const allShards = $derived(hunting?.shards ?? []);

  let search = $state("");
  let selectedRarity = $state<RarityTab>("");

  const normalize = (value?: string | null) => value?.trim().toLocaleLowerCase() ?? "";
  const getFamilyText = (shard?: ModelsAttributeShard) => shard?.family?.filter(Boolean).join(", ") ?? "";
  const getShardRarity = (shard?: ModelsAttributeShard) => normalize(shard?.rarity) || "common";
  const isMaxed = (shard?: ModelsAttributeShard) => (shard?.maxSyphon ?? 0) > 0 && (shard?.syphoned ?? 0) >= (shard?.maxSyphon ?? 0);
  const hasProgress = (shard?: ModelsAttributeShard) => (shard?.owned ?? 0) > 0 || (shard?.syphoned ?? 0) > 0 || shard?.capturedTimestamp != null;

  const summary = $derived.by(() => {
    const shards = allShards;

    return {
      totalListed: shards.length,
      maxed: shards.filter((shard) => isMaxed(shard)).length,
      unlocked: hunting?.unlocked ?? 0,
      maxUnlocked: hunting?.maxUnlocked,
      syphoned: hunting?.syphoned ?? 0,
      maxSyphoned: hunting?.maxSyphoned
    };
  });

  const filteredShards = $derived.by(() => {
    const query = normalize(search);

    return allShards
      .map((shard, index) => ({ shard, index }))
      .filter(({ shard }) => {
        if (!query) return true;

        return [shard.name, shard.abilityName, getFamilyText(shard)].some((value) => normalize(value).includes(query));
      })
      .sort((a, b) => {
        const bucketA = isMaxed(a.shard) ? 0 : hasProgress(a.shard) ? 1 : 2;
        const bucketB = isMaxed(b.shard) ? 0 : hasProgress(b.shard) ? 1 : 2;

        if (bucketA !== bucketB) return bucketA - bucketB;

        const syphonDiff = (b.shard.syphoned ?? 0) - (a.shard.syphoned ?? 0);
        if (syphonDiff !== 0) return syphonDiff;

        const nameCompare = (a.shard.name ?? "").localeCompare(b.shard.name ?? "");
        if (nameCompare !== 0) return nameCompare;

        return a.index - b.index;
      })
      .map(({ shard }) => shard);
  });

  const rarityTabs = $derived.by(() => {
    const presentRarities = new Set(filteredShards.map((shard) => getShardRarity(shard)));
    const orderedRarities = RARITIES.filter((rarity) => presentRarities.has(rarity));
    const extraRarities = [...presentRarities].filter((rarity) => !RARITIES.includes(rarity)).sort((a, b) => a.localeCompare(b));

    return [...orderedRarities, ...extraRarities] satisfies RarityTab[];
  });

  const currentRarity = $derived(rarityTabs.includes(selectedRarity) ? selectedRarity : (rarityTabs[0] ?? "common"));
  const visibleShards = $derived(filteredShards.filter((shard) => getShardRarity(shard) === currentRarity));
</script>

{#if hunting}
  <Items class="flex-col" subtitle="Hunting">
    {#snippet text()}
      <div class="space-y-3">
        <AdditionStat text="Unlocked" data={`${summary.unlocked} / ${summary.maxUnlocked ?? "?"}`} maxed={summary.maxUnlocked != null && summary.unlocked >= summary.maxUnlocked} />
        <AdditionStat text="Syphoned" data={`${summary.syphoned} / ${summary.maxSyphoned ?? "?"}`} maxed={summary.maxSyphoned != null && summary.syphoned >= summary.maxSyphoned} />
        <AdditionStat text="Maxed Shards" data={summary.maxed} />
        <AdditionStat text="Shards Listed" data={summary.totalListed} />
      </div>
    {/snippet}

    {#if hunting.shards}
      <input
        type="search"
        placeholder="Search shards, abilities, or families"
        class="mt-4 block w-80 max-w-full rounded-lg bg-text/10 px-3 py-2 font-normal text-text placeholder:text-text/80 focus-visible:outline-none"
        bind:value={search}
        onkeydown={(event) => {
          event.stopPropagation();
        }} />
      {#if filteredShards.length === 0}
        <p class="space-x-0.5 leading-6">No hunting shards match your search.</p>
      {/if}
      <Tabs.Root bind:value={() => currentRarity, (value) => (selectedRarity = value as RarityTab)}>
        <Tabs.List class="flex w-fit flex-wrap gap-1 rounded-md border border-skillbar p-1 text-sm">
          {#each rarityTabs as rarity (rarity)}
            <Tabs.Trigger value={rarity} class={cn("rounded-md px-3 py-1.5 font-semibold text-text/80 transition-colors data-[state=active]:bg-skillbar data-[state=active]:text-white", getRarityClass(rarity, "text"))}>
              {titleCase(rarity)}
            </Tabs.Trigger>
          {/each}
        </Tabs.List>

        {#each rarityTabs as rarity (rarity)}
          {#if currentRarity === rarity}
            <Tabs.Content value={rarity} class="pt-4">
              {#if visibleShards.length === 0}
                <p class="space-x-0.5 leading-6">No {titleCase(rarity)} shards match your search.</p>
              {:else}
                <ScrollAreaPrimitive class="relative w-full" viewClass="h-160 pr-2" type="auto" orientation="vertical">
                  {#snippet viewportChildren()}
                    <div class="space-y-2">
                      {#each visibleShards as shard, index (shard.shardId ?? `${shard.name}-${index}`)}
                        {@const hasMaxed = isMaxed(shard)}
                        {@const familyText = getFamilyText(shard)}
                        {@const rarityClass = getRarityClass(getShardRarity(shard), "text")}
                        <Chip image={{ src: shard.texture ?? "" }} class="w-fit max-w-full">
                          <div class="flex min-w-0 flex-col">
                            <div class="font-bold">
                              <div class={cn("truncate", rarityClass, hasMaxed && "text-maxed")}>{shard.name}</div>
                              <div class="mt-1 space-y-0.5 text-sm break-words whitespace-normal">
                                <div class={hasMaxed ? "text-gold" : undefined}>
                                  <span class="opacity-60">Syphoned:</span>
                                  <span>{format(shard.syphoned ?? 0)} / {format(shard.maxSyphon ?? 0)}</span>
                                </div>
                                <div>
                                  <span class="opacity-60">Owned:</span>
                                  <span>{format(shard.owned ?? 0)}</span>
                                </div>
                                {#if shard.abilityName}
                                  <div>
                                    <span class="opacity-60">Ability:</span>
                                    <span>{shard.abilityName}</span>
                                    {#if shard.abilityLevel != null || shard.abilityMaxLevel != null}
                                      <span class="opacity-60"> ({shard.abilityLevel ?? 0}/{shard.abilityMaxLevel ?? 0})</span>
                                    {/if}
                                  </div>
                                {/if}
                                {#if familyText}
                                  <div>
                                    <span class="opacity-60">Family:</span>
                                    <span>{familyText}</span>
                                  </div>
                                {/if}
                                {#if shard.capturedTimestamp}
                                  <div>
                                    <span class="opacity-60">Captured:</span>
                                    <span>{formatDate(shard.capturedTimestamp, "dd MMMM yyyy 'at' HH:mm", { in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone) })}</span>
                                  </div>
                                {/if}
                              </div>
                            </div>
                          </div>
                          {#snippet tooltip()}
                            <div class="font-icomoon leading-snug font-semibold">
                              {#each shard.lore ?? [] as lore, loreIndex (loreIndex)}
                                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                                {@html renderLore(lore, true, loreIndex)}
                              {/each}
                            </div>
                          {/snippet}
                        </Chip>
                      {/each}
                    </div>
                  {/snippet}

                  <ScrollArea.Scrollbar orientation="vertical" class="flex h-full w-2.5 touch-none rounded-full transition-all ease-out select-none">
                    <ScrollArea.Thumb class="flex rounded-full bg-icon" />
                  </ScrollArea.Scrollbar>
                  <ScrollArea.Corner />
                </ScrollAreaPrimitive>
              {/if}
            </Tabs.Content>
          {/if}
        {/each}
      </Tabs.Root>
    {/if}
  </Items>
{:else}
  <p class="space-x-0.5 leading-6">This player doesn't have anything related to hunting.</p>
{/if}
