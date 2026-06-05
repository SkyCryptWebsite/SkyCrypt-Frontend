<script lang="ts">
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import ChevronsLeft from "@lucide/svelte/icons/chevrons-left";
  import ChevronsRight from "@lucide/svelte/icons/chevrons-right";
  import { Button } from "bits-ui";

  interface Props {
    page: number;
    totalPages: number;
    baseHref: string;
  }

  let { page, totalPages, baseHref }: Props = $props();

  const hrefFor = (n: number) => {
    if (n <= 1) return baseHref;
    const sep = baseHref.includes("?") ? "&" : "?";
    return `${baseHref}${sep}page=${n}`;
  };

  const atFirst = $derived(page <= 1);
  const atLast = $derived(page >= totalPages);

  const btnClass = "flex size-9 items-center justify-center rounded-lg bg-background-grey text-text transition-all duration-150 ease-out hover:scale-105 hover:bg-background-lore aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:scale-100 aria-disabled:hover:bg-background-grey";
</script>

{#if totalPages > 1}
  <nav aria-label="Pagination" class="flex items-center justify-end gap-1">
    <span class="px-3 text-sm font-semibold text-text/80 tabular-nums">
      Page <span class="font-bold text-text">{page}</span> of <span class="font-bold text-text">{totalPages}</span>
    </span>
    <Button.Root href={atFirst ? undefined : hrefFor(1)} aria-disabled={atFirst} aria-label="First page" data-sveltekit-preload-data="hover" class={btnClass}>
      <ChevronsLeft class="size-4" />
    </Button.Root>
    <Button.Root href={atFirst ? undefined : hrefFor(page - 1)} aria-disabled={atFirst} aria-label="Previous page" data-sveltekit-preload-data="hover" class={btnClass}>
      <ChevronLeft class="size-4" />
    </Button.Root>
    <Button.Root href={atLast ? undefined : hrefFor(page + 1)} aria-disabled={atLast} aria-label="Next page" data-sveltekit-preload-data="hover" class={btnClass}>
      <ChevronRight class="size-4" />
    </Button.Root>
    <Button.Root href={atLast ? undefined : hrefFor(totalPages)} aria-disabled={atLast} aria-label="Last page" data-sveltekit-preload-data="hover" class={btnClass}>
      <ChevronsRight class="size-4" />
    </Button.Root>
  </nav>
{/if}
