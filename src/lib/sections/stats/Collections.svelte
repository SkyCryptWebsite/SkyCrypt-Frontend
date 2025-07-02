<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import Chip from "$lib/components/Chip.svelte";
  import Error from "$lib/components/Error.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import Section from "$lib/components/Section.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { api, SectionName } from "$lib/shared/api";
  import { cn } from "$lib/shared/utils";
  import type { CollectionsV2 } from "$types/statsv2";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { createQuery } from "@tanstack/svelte-query";
  import { format } from "numerable";

  let { order }: { order: number } = $props();

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);

  const profileUUID = $derived(profile.uuid);
  const profileId = $derived(profile.profile_id);

  const query = createQuery<CollectionsV2>({
    queryKey: [SectionName.COLLECTIONS, profileUUID, profileId],
    queryFn: () => api(fetch).getSection(SectionName.COLLECTIONS, profileUUID, profileId)
  });

  const collections = $derived.by(() => {
    if ($query.isPending || $query.error || !$query.data) return;
    return $query.data;
  });
</script>

<Section id="Collections" {order}>
  {#if $query.isPending}
    <LoaderCircle class="text-icon animate-spin" />
  {/if}
  {#if $query.error}
    <Error />
  {/if}
  {#if $query.isSuccess && $query.data && collections}
    <Items class="flex-col">
      {#snippet text()}
        <div>
          <AdditionStat text="Maxed Collections" data="{collections.maxedCollections} / {collections.totalCollections}" maxed={collections.maxedCollections === collections.totalCollections} />
        </div>
      {/snippet}
      {#each Object.entries(collections.categories) as [_, data], index (index)}
        <div class="flex items-center gap-1 text-base font-semibold uppercase">
          <h3 class="text-xl">{data.name}</h3>
          {#if data.maxTiers === data.totalTiers}
            <span class="text-gold">Max!</span>
          {:else}
            <span class="text-text/80">({data.maxTiers} / {data.totalTiers} max)</span>
          {/if}
        </div>

        <ScrollItems>
          {#each data.items as item, index (index)}
            {@const hasUnlocked = item.totalAmount}
            {@const hasMaxed = item.tier === item.maxTier}
            <Chip image={{ src: item.texture }} class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })}>
              <div class={cn("flex flex-col")}>
                <div class="font-bold whitespace-nowrap">
                  <span class={cn(hasMaxed ? "text-maxed" : "opacity-60")}>{item.name}</span>
                  <span class={cn({ "text-gold": hasMaxed })}>{item.tier}</span>
                  <div class="text-sm">
                    <span class="opacity-60">Amount:</span>
                    <span class="text-text">{format(item.amount)}</span>
                  </div>
                </div>
              </div>
              {#snippet tooltip()}
                <div class="text-sm font-bold">
                  {#if item.amounts.length > 0}
                    <div class="mb-4">
                      {#each item.amounts as user, index (index)}
                        <div>
                          <span class="opacity-85">
                            {user.username}:
                          </span>
                          <span class="text-text">{format(user.amount)}</span>
                        </div>
                      {/each}
                    </div>
                  {/if}
                  <div>
                    <span class="opacity-85"> Total: </span>
                    <span class="text-text opacity-100">{format(item.totalAmount)}</span>
                  </div>
                </div>
              {/snippet}
            </Chip>
          {/each}
        </ScrollItems>
      {/each}
    </Items>
  {/if}
</Section>
