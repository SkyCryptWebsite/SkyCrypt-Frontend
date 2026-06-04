<script lang="ts">
  import type { Modifier } from "./lexical";
  import Code from "./inline/Code.svelte";
  import Bold from "./inline/Bold.svelte";
  import Italic from "./inline/Italic.svelte";
  import Strikethrough from "./inline/Strikethrough.svelte";
  import Underline from "./inline/Underline.svelte";
  import Self from "./ModifierWrapper.svelte";

  const { text, mods, index = 0 }: { text: string; mods: Modifier[]; index?: number } = $props();

  const components = { bold: Bold, italic: Italic, underline: Underline, strikethrough: Strikethrough, code: Code };

  const current = $derived(mods[index]);
  const Mod = $derived(current ? components[current] : null);
  const hasMore = $derived(index < mods.length - 1);
</script>

{#if Mod}
  <Mod>
    {#if hasMore}<Self {text} {mods} index={index + 1} />{:else}{text}{/if}
  </Mod>
{:else}{text}{/if}
