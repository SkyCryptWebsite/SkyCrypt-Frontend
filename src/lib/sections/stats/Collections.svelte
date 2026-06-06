<script lang="ts">
  import { getCombinedContext } from "$ctx";
  import { Chip, ScrollItems } from "$lib/components/misc";
  import { Section } from "$lib/components/sections";
  import { AdditionStat } from "$lib/components/stats";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { cn } from "$lib/shared/utils";
  import { format } from "numerable";

  let { order }: { order: number } = $props();

  const collections = $derived(getCombinedContext().current?.collections);
</script>

<Section id="Collections" {order}>
  {#if collections}
    <Items class="flex-col">
      {#snippet text()}
        <div>
          <AdditionStat text="Maxed Collections" data="{collections.maxedCollections} / {collections.totalCollections}" maxed={collections.maxedCollections === collections.totalCollections} />
        </div>
      {/snippet}
      {#if collections.categories}
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
              <Chip image={{ src: item.texture ?? "" }} class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })}>
                <div class="flex flex-col">
                  <div class="font-bold whitespace-nowrap">
                    <span class={cn(hasMaxed ? "text-maxed" : "opacity-60")}>{item.name}</span>
                    <span class={cn({ "text-gold": hasMaxed })}>{item.tier}</span>
                    <div class="text-sm">
                      <span class="opacity-60">Amount:</span>
                      <span class="text-text">{format(item.totalAmount)}</span>
                    </div>
                  </div>
                </div>
                {#snippet tooltip()}
                  <div class="text-sm font-bold">
                    {#if item.amounts && item.amounts.length > 0}
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
      {/if}
    </Items>
  {/if}
</Section>
