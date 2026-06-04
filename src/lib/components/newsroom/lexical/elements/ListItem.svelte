<script lang="ts">
  import type { LexicalNode } from "$types";
  import { cn } from "$lib/shared/utils";
  import LexicalRenderer from "../LexicalRenderer.svelte";

  const { node }: { node: LexicalNode } = $props();

  // Checklist items carry a `checked` boolean; plain list items don't.
  const isCheck = $derived(node.checked !== undefined);
</script>

{#if isCheck}
  <li class="flex items-start gap-2 leading-7">
    <input type="checkbox" checked={node.checked} disabled class="mt-1.5 size-3.5 shrink-0 accent-icon" />
    <span class={cn(node.checked && "text-text/60 line-through")}>
      <LexicalRenderer nodes={node.children ?? []} />
    </span>
  </li>
{:else}
  <li class="leading-7">
    <LexicalRenderer nodes={node.children ?? []} />
  </li>
{/if}
