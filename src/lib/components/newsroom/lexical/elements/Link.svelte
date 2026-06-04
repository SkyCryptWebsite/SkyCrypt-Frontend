<script lang="ts">
  import type { LexicalNode } from "$types";
  import LexicalRenderer from "../LexicalRenderer.svelte";

  const { node }: { node: LexicalNode } = $props();

  // Payload links carry the href on `fields.url`; legacy/custom links use `url`.
  const href = $derived(node.fields?.url ?? node.url ?? "#");
  const newTab = $derived(node.fields?.newTab ?? true);
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a {href} target={newTab ? "_blank" : undefined} rel={newTab ? "noopener noreferrer" : undefined} class="text-link underline underline-offset-2 transition-colors hover:text-hover">
  <LexicalRenderer nodes={node.children ?? []} />
</a>
