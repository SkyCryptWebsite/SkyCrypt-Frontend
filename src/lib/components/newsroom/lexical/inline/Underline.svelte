<script lang="ts">
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

<u class="underline underline-offset-2">{@render children()}</u>
