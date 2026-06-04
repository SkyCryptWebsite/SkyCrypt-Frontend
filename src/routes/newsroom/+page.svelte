<script lang="ts">
  import { goto } from "$app/navigation";
  import { getPreferences } from "$ctx";
  import Pagination from "$lib/components/newsroom/Pagination.svelte";
  import PostCard from "$lib/components/newsroom/PostCard.svelte";
  import { POST_TYPE_LABELS } from "$lib/components/newsroom/TypeBadge.svelte";
  import { cn } from "$lib/shared/utils";
  import { POST_TYPES, type PostType } from "$types";
  import SvelteSeo from "svelte-seo";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  const preferences = getPreferences();

  const filterHref = (t?: PostType) => (t ? `/newsroom?type=${t}` : "/newsroom");
  const baseHref = $derived(filterHref(data.type));

  function onFilterChange(e: Event) {
    const value = (e.currentTarget as HTMLSelectElement).value;
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    void goto(filterHref(value === "" ? undefined : (value as PostType)));
  }
</script>

<SvelteSeo title="Newsroom | SkyCrypt" description="Latest announcements and updates from the SkyCrypt team" canonical="https://sky.shiiyu.moe/newsroom" />

<main class="@container mx-auto flex max-w-272 flex-col gap-6 pt-5 pr-[max(1.25rem,env(safe-area-inset-right))] pb-[max(1.25rem,env(safe-area-inset-bottom))] pl-[max(1.25rem,env(safe-area-inset-left))]">
  <div class={cn("flex flex-col gap-4 rounded-lg p-5 @md:flex-row @md:items-center @md:justify-between", preferences.performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-60 dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
    <header class="flex flex-col gap-1">
      <h1 class="text-3xl leading-tight font-bold text-text">Newsroom</h1>
      <p class="text-sm text-text/70">Latest announcements and updates from the SkyCrypt team.</p>
    </header>
    <div class="flex flex-col items-stretch gap-3 @sm:flex-row @sm:items-center">
      <select aria-label="Filter by category" value={data.type ?? ""} onchange={onFilterChange} class="rounded-lg bg-background-grey px-3 py-2 text-sm font-semibold text-text transition-colors hover:bg-background-lore focus-visible:outline-none">
        <option value="">All categories</option>
        {#each POST_TYPES as t (t)}
          <option value={t}>{POST_TYPE_LABELS[t]}</option>
        {/each}
      </select>
      <Pagination page={data.page} totalPages={data.totalPages} {baseHref} />
    </div>
  </div>

  {#if data.docs.length === 0}
    <div class={cn("mx-auto flex w-full max-w-md flex-col items-center justify-center gap-2 rounded-lg p-10 text-center", preferences.performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-60 dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
      <p class="text-lg font-semibold text-text">No posts yet</p>
      <p class="text-sm text-text/80">
        {data.type ? `No ${POST_TYPE_LABELS[data.type].toLowerCase()} posts in this category.` : "Check back soon for announcements and updates."}
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-5 @md:grid-cols-2 @4xl:grid-cols-3">
      {#each data.docs as post (post.id)}
        <PostCard {post} as="h2" />
      {/each}
    </div>

    {#if data.totalPages > 1}
      <div class={cn("flex items-center justify-end rounded-lg p-3", preferences.performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-60 dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
        <Pagination page={data.page} totalPages={data.totalPages} {baseHref} />
      </div>
    {/if}
  {/if}
</main>
