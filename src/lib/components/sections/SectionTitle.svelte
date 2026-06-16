<script lang="ts">
  import { cn } from "$lib/shared/utils";
  import type { Snippet } from "svelte";

  let { text, children, class: className }: { text?: string; children?: Snippet; class?: string } = $props();
</script>

<h3 class={cn("text-2xl mt-4 font-semibold uppercase", className)}>
  {#if children}
    {@render children()}
  {:else if text}
    {text}
  {/if}
</h3>
