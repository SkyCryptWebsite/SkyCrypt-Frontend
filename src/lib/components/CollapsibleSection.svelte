<script lang="ts">
  import SectionTitle from "$lib/components/SectionTitle.svelte";
  import { cn } from "$lib/shared/utils";
  import { inviewportSections } from "$lib/stores/internal";
  import { collapsePreferences } from "$lib/stores/preferences";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import { Collapsible } from "bits-ui";
  import { IsInViewport } from "runed";
  import type { Snippet } from "svelte";
  import { slide } from "svelte/transition";

  type Props = {
    id: string;
    class?: string;
    order?: number;
    children?: Snippet;
    subtitle?: Snippet;
  };

  let { id, class: className, order, children, subtitle }: Props = $props();
  let sectionElement = $state<HTMLElement>();
  let hasBeenInViewport = $state(false);

  let transormedID = $derived.by(() => {
    if (id === "Miscellaneous") {
      return "Misc";
    }
    return id.replaceAll(" ", "_");
  });
  const inViewport = new IsInViewport(() => sectionElement, { rootMargin: "200px 0px", threshold: 0 });

  $effect(() => {
    inviewportSections.update((sections) => {
      return {
        ...sections,
        [transormedID]: inViewport.current
      };
    });
  });

  $effect(() => {
    if (inViewport.current && !hasBeenInViewport) {
      hasBeenInViewport = true;
    }
  });
</script>

<Collapsible.Root bind:open={() => $collapsePreferences[transormedID.toLowerCase()] ?? true, (v) => ($collapsePreferences[transormedID.toLowerCase()] = v)}>
  {#snippet child({ props })}
    <section {...props} id={transormedID} class={cn("order-(--order) mx-auto scroll-m-32", className)} style="--order: {order};" bind:this={sectionElement}>
      <Collapsible.Trigger class="flex items-center justify-between">
        {#if !subtitle}
          <SectionTitle>{id}</SectionTitle>
        {:else}
          {@render subtitle()}
        {/if}
        <ChevronDown class={cn("text-text/60 h-6 w-6 transition-all duration-300", { "rotate-180": $collapsePreferences[transormedID.toLowerCase()] ?? true })} />
      </Collapsible.Trigger>
      <!-- {#if hasBeenInViewport} -->
      <Collapsible.Content forceMount>
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:slide>
              {@render children?.()}
            </div>
          {/if}
        {/snippet}
      </Collapsible.Content>
      <!-- {/if} -->
    </section>
  {/snippet}
</Collapsible.Root>
