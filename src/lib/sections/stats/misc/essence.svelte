<script lang="ts">
  import { getMiscContext } from "$ctx";
  import { Chip, ScrollItems } from "$lib/components/misc";
  import { SectionSubtitle } from "$lib/components/sections";
  import { cn } from "$lib/shared/utils";
  import { format } from "numerable";

  const misc = $derived(getMiscContext().misc);
</script>

{#if misc && misc.essence != null}
  <div class="space-y-4">
    <SectionSubtitle class="uppercase!">Essence</SectionSubtitle>
    <ScrollItems>
      {#each misc.essence as essence, index (index)}
        {@const hasUnlocked = essence.amount}
        <Chip image={{ src: essence.texture ?? "" }} class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })}>
          <div class={cn("flex flex-col")}>
            <div class="font-bold whitespace-nowrap">
              <span class="opacity-60">{essence.name}</span>
              <div class="text-sm">
                <span class="opacity-60">Amount:</span>
                <span class="text-text">{format(essence.amount)}</span>
              </div>
            </div>
          </div>
        </Chip>
      {/each}
    </ScrollItems>
  </div>
{/if}
