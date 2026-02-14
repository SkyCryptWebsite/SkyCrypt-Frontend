<script lang="ts">
  import { SectionTitle } from "$lib/components/sections";
  import { SectionSubtitle } from "$lib/components/sections";
  import type { SectionName } from "$lib/sections/types";
  import { cn } from "$lib/shared/utils";
  import type { Snippet } from "svelte";

  type Props = {
    id: SectionName | "Catacombs" | "Master_Catacombs";
    class?: string;
    order?: number;
    children?: Snippet;
    subtitle?: Snippet;
    subtitleText?: string;
  };

  let { id, class: className, order, children, subtitle, subtitleText }: Props = $props();
</script>

<section {id} class={cn("order-(--order) mx-auto scroll-m-32", className)} style="--order: {order};">
  <div class="flex items-center justify-between">
    {#if subtitle}
      {@render subtitle()}
    {:else if subtitleText}
      <SectionSubtitle>{subtitleText}</SectionSubtitle>
    {:else}
      <SectionTitle>{id.replaceAll("_", " ")}</SectionTitle>
    {/if}
  </div>
  {@render children?.()}
</section>
