<script lang="ts">
  import type { LexicalNode } from "$types";
  import LexicalRenderer from "../LexicalRenderer.svelte";

  const { node }: { node: LexicalNode } = $props();
</script>

<blockquote class="my-3 border-l-4 border-background-grey pl-4 text-text/80 italic">
  <LexicalRenderer nodes={node.children ?? []} />
</blockquote>
