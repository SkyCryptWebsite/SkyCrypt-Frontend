<script lang="ts">
  import type { BlockRichText, LexicalNode } from "$types";
  import LexicalRenderer from "../LexicalRenderer.svelte";

  const { block }: { block: BlockRichText } = $props();
</script>

<LexicalRenderer nodes={block.content.root.children as unknown as LexicalNode[]} />
