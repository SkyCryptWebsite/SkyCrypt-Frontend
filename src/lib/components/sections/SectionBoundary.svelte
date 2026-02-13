<script lang="ts" generics="T">
  import type { Snippet } from "svelte";
  import Notice from "$lib/components/notices/Notice.svelte";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";

  let { promise, children }: { promise: Promise<T>; children: Snippet<[T]> } = $props();
</script>

<svelte:boundary>
  {#snippet pending()}
    <LoaderCircle class="mx-auto mt-4 animate-spin text-icon" />
  {/snippet}
  {#snippet failed(err, retry)}
    <Notice title="An unexpected error has occurred" type="error" error={err} {retry} />
  {/snippet}

  {#await promise then result}
    {@render children(result)}
  {/await}
</svelte:boundary>
