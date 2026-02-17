<script lang="ts">
  import { getHoverContext, getInternalState } from "$ctx";
  import { AdditionStat } from "$lib/components/stats";
  import { type ModelsPlotLayout } from "$lib/shared/api/orval-generated";
  import { renderLore } from "$lib/shared/helper";
  import { animateObfuscatedText } from "$lib/shared/mc-text/obfuscated";
  import { flyAndScale } from "$lib/shared/utils";
  import Image from "@lucide/svelte/icons/image";
  import { Avatar, Tooltip } from "bits-ui";

  let { plot }: { plot: ModelsPlotLayout | undefined } = $props();

  const isHover = getHoverContext();
  const internalState = getInternalState();

  const allMaxed = $derived(plot?.unlocked === plot?.total);
</script>

<div class="mb-3 flex items-center gap-1 text-base font-semibold uppercase">
  <h3 class="text-xl">Plots</h3>
  {#if allMaxed}
    <span class="text-gold">Max!</span>
  {:else}
    <span class="text-text/80">({plot?.unlocked} / {plot?.total} max)</span>
  {/if}
</div>

<div class="space-y-0.5">
  {#if plot?.unlocked != null && plot?.total != null}
    <AdditionStat text="Unlocked Plots" data={`${plot.unlocked}/${plot?.total}`} maxed={plot.unlocked === plot.total} />
  {/if}
  {#if plot?.barnSkin}
    <AdditionStat text="Barn Skin" data={plot.barnSkin} />
  {/if}
</div>
{#if plot}
  <div class="@container relative mt-3 mb-0 rounded-lg bg-background/30 p-5">
    <div class="grid grid-cols-[repeat(5,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
      {#each plot.layout as plotItem, index (index)}
        {#snippet tooltipContent()}
          {#if plotItem.display_name}
            <p {@attach animateObfuscatedText}>{@html renderLore(plotItem.display_name)}</p>
          {/if}
        {/snippet}
        <Tooltip.Root disableCloseOnTriggerClick={false}>
          <Tooltip.Trigger onclick={() => (internalState.content = tooltipContent)}>
            <Avatar.Root class="flex aspect-square items-center justify-center rounded-sm bg-text/4 p-1">
              <Avatar.Image src={plotItem.texture_path} class="h-auto w-14 select-none [image-rendering:pixelated]" />
              <Avatar.Fallback>
                <Image class="size-full" />
              </Avatar.Fallback>
            </Avatar.Root>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            {#if isHover.current}
              <Tooltip.Content forceMount class="z-50 rounded-lg bg-background-grey p-4 font-semibold text-text/80" sideOffset={6} side="top" align="center">
                {#snippet child({ wrapperProps, props, open })}
                  {#if open}
                    <div {...wrapperProps}>
                      <div {...props} transition:flyAndScale>
                        <Tooltip.Arrow />
                        {@render tooltipContent()}
                      </div>
                    </div>
                  {/if}
                {/snippet}
              </Tooltip.Content>
            {/if}
          </Tooltip.Portal>
        </Tooltip.Root>
      {/each}
    </div>
  </div>
{/if}
