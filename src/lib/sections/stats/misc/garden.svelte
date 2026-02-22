<script lang="ts">
  import { getMiscContext } from "$ctx";
  import { Chip, ScrollItems } from "$lib/components/misc";
  import { SectionSubtitle } from "$lib/components/sections";
  import { cn } from "$lib/shared/utils";
  import { format } from "numerable";

  const misc = $derived(getMiscContext().misc);
</script>

{#if misc && misc.garden_chips != null}
  <div class="space-y-4">
    <SectionSubtitle class="uppercase!">Garden Chips</SectionSubtitle>
    <ScrollItems>
      {#each Object.entries(misc.garden_chips) as [name, amount], index (index)}
        {@const hasUnlocked = amount}
        <Chip class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })}>
          <div class={cn("flex flex-col")}>
            <div class="font-bold whitespace-nowrap">
              <span class="capitalize opacity-60">{name.replaceAll("_", " ")}</span>
              <div class="text-sm">
                <span class="opacity-60">Level:</span>
                <span class="text-text">{format(amount)}</span>
              </div>
            </div>
          </div>
        </Chip>
      {/each}
    </ScrollItems>
  </div>
{/if}
