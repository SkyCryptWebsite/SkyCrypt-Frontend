<script lang="ts">
  import { getProfileContext } from "$ctx";
  import { Chip } from "$lib/components/misc";
  import { Section } from "$lib/components/sections";
  import { AdditionStat } from "$lib/components/stats";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { getAttributeShardsSection } from "$lib/shared/api/skycrypt-api.remote";
  import { renderLore } from "$lib/shared/helper";
  import { cn } from "$lib/shared/utils";
  import { tz } from "@date-fns/tz";
  import { formatDate } from "date-fns";
  import { format } from "numerable";
  import VirtualList from "svelte-tiny-virtual-list";

  const ITEM_GAP = 8 as const;
  const BASE_ITEM_HEIGHT = 80 as const;
  const CAPTURED_ITEM_HEIGHT = 100 as const;

  let { order }: { order: number } = $props();

  const profile = $derived(getProfileContext().current);
  const profileUUID = $derived(profile?.uuid);
  const profileId = $derived(profile?.profile_id);

  const attributeShards = $derived(await getAttributeShardsSection({ uuid: profileUUID!, profileId: profileId! }));
  const allShards = $derived(attributeShards.shards ?? []);

  const getItemSize = (index: number) => (allShards[index]?.captured ? CAPTURED_ITEM_HEIGHT : BASE_ITEM_HEIGHT) + ITEM_GAP;
</script>

<Section id="Attribute_Shards" {order}>
  {#if attributeShards}
    <Items class="flex-col">
      {#snippet text()}
        <div>
          <AdditionStat text="Unlocked" data="{attributeShards.unlocked} / {attributeShards.maxUnlocked}" maxed={attributeShards.unlocked === attributeShards.maxUnlocked} />
          <AdditionStat text="Syphoned" data="{attributeShards.syphoned} / {attributeShards.maxSyphoned}" maxed={attributeShards.syphoned === attributeShards.maxSyphoned} />
        </div>
      {/snippet}
      {#if attributeShards.shards}
        <VirtualList height={640} width="100%" itemCount={attributeShards.shards.length} itemSize={getItemSize} estimatedItemSize={BASE_ITEM_HEIGHT} scrollDirection="vertical">
          {#snippet item({ index, style })}
            {@const hasUnlocked = allShards[index].captured}
            {@const hasMaxed = allShards[index].syphoned === allShards[index].maxSyphon}
            <div {style} class="px-4 font-semibold whitespace-nowrap">
              <div class="box-border h-full pb-2">
                <Chip image={{ src: allShards[index].texture ?? "" }} class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })}>
                  <div class={cn("flex flex-col")}>
                    <div class="font-bold whitespace-nowrap">
                      <span class={cn(hasMaxed ? "text-maxed" : "opacity-60")}>{allShards[index].name}</span>
                      <div class="text-sm">
                        <div class={cn({ "text-gold": hasMaxed })}>
                          <span class="opacity-60">Syphoned:</span>
                          <span>{format(allShards[index].syphoned)}</span>
                        </div>
                        <div>
                          <span class="opacity-60">Owned:</span>
                          <span>{format(allShards[index].owned)}</span>
                        </div>
                        {#if allShards[index].captured}
                          <div>
                            <span class="opacity-60">Captured:</span>
                            <span>{formatDate(allShards[index].captured, "dd MMMM yyyy 'at' HH:mm", { in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone) })} </span>
                          </div>
                        {/if}
                      </div>
                    </div>
                  </div>
                  {#snippet tooltip()}
                    <div class="font-icomoon leading-snug font-semibold">
                      {#each allShards[index]?.lore as lore, index (index)}
                        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                        {@html renderLore(lore, true, index)}
                      {/each}
                    </div>
                  {/snippet}
                </Chip>
              </div>
            </div>
          {/snippet}
        </VirtualList>
      {/if}
    </Items>
  {/if}
</Section>
