<script lang="ts">
  import type { LexicalNode } from "$types";
  import LexicalRenderer from "../LexicalRenderer.svelte";

  const { node }: { node: LexicalNode } = $props();
</script>

<p class="my-3 leading-7">
  <LexicalRenderer nodes={node.children ?? []} />
</p>
