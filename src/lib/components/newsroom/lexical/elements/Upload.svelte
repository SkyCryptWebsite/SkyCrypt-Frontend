<script lang="ts">
  import type { LexicalNode, Media } from "$types";

  const { node }: { node: LexicalNode } = $props();

  // Lexical upload nodes populate `value` with the resolved media doc at depth >= 1.
  const media = $derived(node.value as Media | undefined);
  const src = $derived(media?.sizes?.card?.url ?? media?.url ?? "");
  const width = $derived(media?.sizes?.card?.width ?? media?.width ?? undefined);
  const height = $derived(media?.sizes?.card?.height ?? media?.height ?? undefined);
  const alt = $derived(media?.alt ?? "");
</script>

{#if src}
  <figure class="my-6 flex flex-col items-center gap-2">
    <img {src} {alt} {width} {height} loading="lazy" class="h-auto max-w-full rounded-lg bg-background-grey" />
  </figure>
{/if}
