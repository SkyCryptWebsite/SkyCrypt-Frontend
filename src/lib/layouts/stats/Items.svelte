<script lang="ts">
  import SectionSubtitle from "$lib/components/sections/SectionSubtitle.svelte";
  import { cn } from "$lib/shared/utils";
  import type { Snippet } from "svelte";

  type Props = {
    subtitle?: string;
    class?: string;
    text?: Snippet;
    children?: Snippet;
    info?: Snippet;
  };

  let { subtitle, class: className, text, children, info }: Props = $props();
</script>

<div class="space-y-4">
  {#if subtitle}
    <SectionSubtitle>{subtitle}</SectionSubtitle>
  {/if}
  {@render text?.()}

  <div class={cn("flex flex-wrap gap-3", className)}>
    {@render children?.()}
  </div>

  {@render info?.()}
</div>
