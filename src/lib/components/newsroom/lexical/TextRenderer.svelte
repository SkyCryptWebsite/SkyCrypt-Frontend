<script lang="ts">
  import type { LexicalNode } from "$types";
  import { getActiveModifiers } from "./lexical";
  import ModifierWrapper from "./ModifierWrapper.svelte";

  const { node }: { node: LexicalNode } = $props();

  const parts = $derived((node.text ?? "").split("\n"));
  const mods = $derived(getActiveModifiers(node.format));
</script>

{#each parts as part, i (i)}<ModifierWrapper text={part} {mods} />{#if i < parts.length - 1}<br />{/if}{/each}
