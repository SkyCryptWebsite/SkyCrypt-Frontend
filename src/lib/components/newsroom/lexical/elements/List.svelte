<script lang="ts">
  import type { LexicalNode } from "$types";
  import LexicalRenderer from "../LexicalRenderer.svelte";

  const { node }: { node: LexicalNode } = $props();

  const ordered = $derived(node.listType === "number");
  const check = $derived(node.listType === "check");
  const tag = $derived(ordered ? "ol" : "ul");
  const cls = $derived(check ? "my-3 ml-1 list-none space-y-1" : ordered ? "my-3 ml-6 list-decimal space-y-1" : "my-3 ml-6 list-disc space-y-1");
</script>

<svelte:element this={tag} class={cls}>
  <LexicalRenderer nodes={node.children ?? []} />
</svelte:element>
