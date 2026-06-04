<script lang="ts">
  import type { LexicalNode } from "$types";
  import { cn } from "$lib/shared/utils";
  import LexicalRenderer from "../LexicalRenderer.svelte";

  const { node }: { node: LexicalNode } = $props();

  const sizes: Record<string, string> = {
    h1: "mt-8 mb-3 text-3xl leading-tight",
    h2: "mt-8 mb-3 text-2xl",
    h3: "mt-6 mb-2 text-xl",
    h4: "mt-6 mb-2 text-lg",
    h5: "mt-6 mb-2 text-base",
    h6: "mt-6 mb-2 text-sm tracking-wide text-text/70 uppercase"
  };

  const tag = $derived(node.tag && node.tag in sizes ? node.tag : "h2");
</script>

<svelte:element this={tag} class={cn("font-bold text-text", sizes[tag])}>
  <LexicalRenderer nodes={node.children ?? []} />
</svelte:element>
