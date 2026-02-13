<script lang="ts">
  import { getPreferences, getFavorites, getRecentSearches } from "$ctx";
  import { cn } from "$lib/shared/utils";
  import { Avatar, Command } from "bits-ui";

  // Props kept for API clarity but sourced from context
  const {
    ign = "",
    _searchQuery = "",
    _searchUserRemoteFn,
    _searchQueryValidated
  }: {
    ign?: string;
    _searchQuery?: string;
    _searchUserRemoteFn?: unknown;
    _searchQueryValidated?: Record<string, unknown>;
  } = $props();

  const preferences = getPreferences();
  const favorites = getFavorites();
  const recentSearches = getRecentSearches();
</script>

{#if recentSearches.current.length !== 0}
  <Command.Group>
    <Command.GroupHeading class="text-muted-foreground px-3 pt-4 pb-2 text-xs">Recent Searches</Command.GroupHeading>
    <Command.GroupItems>
      {#each recentSearches.current.slice(0, 5) as recentSearch, index (index)}
        {#if !ign || recentSearch.ign !== ign}
          <Command.LinkItem value={recentSearch.ign} href="/stats/{recentSearch.ign}" class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", preferences.performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")} keywords={[recentSearch.ign, "profile", "player", "favorite", "favorites"]}>
            <Avatar.Root class="size-4 shrink-0 bg-text/10">
              <Avatar.Image loading="lazy" src={recentSearch.uuid ? `https://nmsr.nickac.dev/face/${recentSearch.uuid}` : "https://nmsr.nickac.dev/face/bc8ea1f51f253ff5142ca11ae45193a4ad8c3ab5e9c6eec8ba7a4fcb7bac40"} alt={recentSearch.ign} class="aspect-square size-4 [image-rendering:pixelated]" />
              <Avatar.Fallback class="flex h-full items-center justify-center text-lg font-semibold text-text/60 uppercase">
                {recentSearch.ign.slice(0, 2)}
              </Avatar.Fallback>
            </Avatar.Root>
            {recentSearch.ign}
          </Command.LinkItem>
        {/if}
      {/each}
    </Command.GroupItems>
  </Command.Group>
{/if}

{#if recentSearches.current.length !== 0 || favorites.current.length !== 0}
  <Command.Separator class="bg-foreground/5 h-px w-full" />
{/if}

{#if favorites.current.length !== 0 && (!ign || !favorites.current.some((f) => f.ign === ign))}
  <Command.Group>
    <Command.GroupHeading class="text-muted-foreground px-3 pt-4 pb-2 text-xs">Favorites</Command.GroupHeading>
    <Command.GroupItems>
      {#each favorites.current.slice(0, 5) as favorite, index (index)}
        {#if !ign || favorite.ign !== ign}
          <Command.LinkItem value={favorite.ign} href="/stats/{favorite.ign}" class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", preferences.performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")} keywords={[favorite.ign, favorite.uuid, "profile", "player", "favorite", "favorites"]}>
            <Avatar.Root class="size-4 shrink-0 bg-text/10">
              <Avatar.Image loading="lazy" src={`https://nmsr.nickac.dev/face/${favorite.uuid}`} alt={favorite.ign} class="aspect-square size-4 [image-rendering:pixelated]" />
              <Avatar.Fallback class="flex h-full items-center justify-center text-lg font-semibold text-text/60 uppercase">
                {favorite.ign.slice(0, 2)}
              </Avatar.Fallback>
            </Avatar.Root>
            {favorite.ign}
          </Command.LinkItem>
        {/if}
      {/each}
    </Command.GroupItems>
  </Command.Group>
{/if}
