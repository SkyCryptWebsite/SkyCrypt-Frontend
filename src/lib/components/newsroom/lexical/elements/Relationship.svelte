<script lang="ts">
  import type { LexicalNode } from "$types";

  const { node }: { node: LexicalNode } = $props();

  type UserRef = { mcUuid?: string | null; displayName?: string | null; name?: string };

  // Only `users` relationships are rendered (as a link to their SkyCrypt stats); others are skipped.
  const user = $derived(node.relationTo === "users" ? (node.value as UserRef) : null);
  const name = $derived(user?.displayName?.trim() || user?.name || "");
</script>

{#if user && name}
  {#if user.mcUuid}
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a href="/stats/{user.mcUuid}" data-sveltekit-preload-data="hover" class="font-semibold text-link underline underline-offset-2 transition-colors hover:text-hover">{name}</a>
  {:else}
    <span class="font-semibold text-text">{name}</span>
  {/if}
{/if}
