<script lang="ts">
  import { getMiscContext } from "$ctx";
  import { Chip, ScrollItems } from "$lib/components/misc";
  import { SectionSubtitle } from "$lib/components/sections";
  import { cn } from "$lib/shared/utils";
  import { format } from "numerable";

  const misc = $derived(getMiscContext().misc);

  interface ChipData {
    amount?: number;
    maxAmount?: number;
    name?: string;
    texture?: string;
  }
</script>

{#if misc && misc.essence != null}
  {@render chips("Essence", misc.essence)}
{/if}

{#if misc && misc.consumables != null}
  {@render chips("Consumables", misc.consumables)}
{/if}

{#snippet chips(title: string, data: ChipData[])}
  <div class="space-y-4">
    <SectionSubtitle class="uppercase!">{title}</SectionSubtitle>
    <ScrollItems>
      {#each data as item, index (index)}
        {@const hasUnlocked = item.amount}
        {@const hasMaxed = item.maxAmount != null && item.amount === item.maxAmount}
        <Chip image={{ src: item.texture ?? "" }} class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })}>
          <div class="flex flex-col">
            <div class="font-bold whitespace-nowrap">
              <span class={cn(hasMaxed ? "text-maxed" : "opacity-60")}>{item.name}</span>
              <div class={cn("text-sm", hasMaxed ? "text-gold" : "text-text")}>
                <span class="opacity-60">Amount:</span>
                <span>
                  {format(item.amount)}{#if item.maxAmount != null}/{item.maxAmount}{/if}
                </span>
              </div>
            </div>
          </div>
        </Chip>
      {/each}
    </ScrollItems>
  </div>
{/snippet}
