<script lang="ts">
  import { getDynamicCtx } from "$ctx/dynamic.svelte";
  import Chip from "$lib/components/Chip.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import { SectionName } from "$lib/shared/api";
  import { cn } from "$lib/shared/utils";
  import type { MiscV2 } from "$types/statsv2";
  import { format } from "numerable";

  const ctx = getDynamicCtx<() => MiscV2 | undefined>(SectionName.MISC);
  const misc = $derived(ctx?.data?.());
</script>

{#if misc && misc.essence != null}
  <div class="space-y-4">
    <SectionSubtitle class="uppercase!">Essence</SectionSubtitle>
    <ScrollItems>
      {#each misc.essence as essence, index (index)}
        {@const hasUnlocked = essence.amount}
        <Chip image={{ src: essence.texture }} class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })}>
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
