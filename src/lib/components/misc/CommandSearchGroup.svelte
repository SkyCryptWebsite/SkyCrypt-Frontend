<script lang="ts">
  import { getPreferences, getFavorites, getRecentSearches } from "$ctx";
  import { Avatar, Command } from "bits-ui";
  import { commandItemClass } from "./command-utils";

  const { ign = "" }: { ign?: string } = $props();

  const preferences = getPreferences();
  const favorites = getFavorites();
  const recentSearches = getRecentSearches();
</script>

{#snippet playerItem(item: { ign: string; uuid?: string })}
  <Command.LinkItem value={item.ign} href="/stats/{item.ign}" class={commandItemClass(preferences.performanceMode)} keywords={[item.ign, item.uuid, "profile", "player", "favorite", "favorites"].filter(Boolean) as string[]}>
    <Avatar.Root class="size-4 shrink-0 bg-text/10">
      <Avatar.Image loading="lazy" src={item.uuid ? `https://nmsr.nickac.dev/face/${item.uuid}` : "https://nmsr.nickac.dev/face/bc8ea1f51f253ff5142ca11ae45193a4ad8c3ab5e9c6eec8ba7a4fcb7bac40"} alt={item.ign} class="aspect-square size-4 [image-rendering:pixelated]" />
      <Avatar.Fallback class="flex h-full items-center justify-center text-lg font-semibold text-text/60 uppercase">
        {item.ign.slice(0, 2)}
      </Avatar.Fallback>
    </Avatar.Root>
    {item.ign}
  </Command.LinkItem>
{/snippet}

{#if recentSearches.current.length !== 0}
  <Command.Group>
    <Command.GroupHeading class="text-muted-foreground px-3 pt-4 pb-2 text-xs">Recent Searches</Command.GroupHeading>
    <Command.GroupItems>
      {#each recentSearches.current.slice(0, 5) as recentSearch, index (index)}
        {#if !ign || recentSearch.ign !== ign}
          {@render playerItem(recentSearch)}
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
          {@render playerItem(favorite)}
        {/if}
      {/each}
    </Command.GroupItems>
  </Command.Group>
{/if}
