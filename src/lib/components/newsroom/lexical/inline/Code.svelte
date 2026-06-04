<script lang="ts">
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

<code class="rounded bg-background-lore px-1.5 py-0.5 font-mono text-[0.875em]">{@render children()}</code>
