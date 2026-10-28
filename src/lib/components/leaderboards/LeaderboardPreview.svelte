<script lang="ts">
  import { Skeleton } from "$ui/skeleton";
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import type { LeaderboardInfo } from "#lib/shared/api/orval-generated";
  import { getLeaderboard } from "#lib/shared/api/skycrypt-api.remote";
  import EntryPlayers from "./EntryPlayers.svelte";
  import { formatLeaderboardValue, leaderboardPath } from "./format";
  import OutdatedNote from "./OutdatedNote.svelte";

  let { board, limit = 5 }: { board: LeaderboardInfo; limit?: number } = $props();
</script>

<div class="flex flex-col gap-3 rounded-xl border bg-background/50 p-4">
  <a
    href={leaderboardPath(board.id ?? "")}
    data-sveltekit-preload-data="hover"
    class="group flex items-center justify-between gap-2 rounded-md font-semibold">
    {board.name}
    <ArrowRight class="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
  </a>

  <svelte:boundary>
    {#snippet pending()}
      {#each new Array(limit) as _, index (index)}
        <Skeleton class="h-8 w-full rounded-lg" />
      {/each}
    {/snippet}
    {#snippet failed()}
      <p class="text-sm text-muted-foreground">Couldn't load this leaderboard.</p>
    {/snippet}

    {const page = await getLeaderboard({ leaderboard: board.id ?? "", mode: "all", page: 1, limit })}
    {#if !page.entries?.length}
      <p class="text-sm text-muted-foreground">Nobody is ranked yet.</p>
    {:else}
      <ol class="flex flex-col gap-1">
        {#each page.entries as entry (`${entry.uuid}/${entry.profile_id}`)}
          <li class="flex items-center gap-2 rounded-lg px-1.5 py-1 text-sm hover:bg-muted/50">
            <span class="w-6 shrink-0 text-right font-semibold text-muted-foreground tabular-nums">{entry.rank}</span>
            <EntryPlayers {entry} class="grow text-sm" />
            {#if entry.outdated}
              <OutdatedNote updatedAt={entry.updated_at} />
            {/if}
            <span class="shrink-0 font-semibold tabular-nums">
              {formatLeaderboardValue(board, entry.value, entry.raw)}
            </span>
          </li>
        {/each}
      </ol>
    {/if}
  </svelte:boundary>
</div>
