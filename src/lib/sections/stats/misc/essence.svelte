<script lang="ts">
  import { getMiscContext } from "$ctx";
  import Chip from "$lib/components/Chip.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import { cn } from "$lib/shared/utils";
  import { format } from "numerable";

  const misc = $derived(getMiscContext());
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
