<script lang="ts">
  import { getProfileContext } from "$ctx";
  import EmptyStat from "$src/lib/components/EmptyStat.svelte";
  import { Separator } from "$ui/separator";
  import { Skeleton } from "$ui/skeleton";
  import TrophyIcon from "@lucide/svelte/icons/trophy";
  import VirtualList from "svelte-tiny-virtual-list";
  import {
    formatLeaderboardValue,
    isLeaderboardMode,
    leaderboardPath,
    MODE_LABELS,
    OutdatedNote
  } from "#lib/components/leaderboards";
  import ScrollAreaItems from "#lib/components/ScrollAreaItems.svelte";
  import { Section, SectionSubtitle } from "#lib/components/sections";
  import { AdditionStat } from "#lib/components/stats";
  import type { LeaderboardRank } from "#lib/shared/api/orval-generated";
  import { getPlayerLeaderboardRanks, listLeaderboards } from "#lib/shared/api/skycrypt-api.remote";

  let { order }: { order: number } = $props();

  // Board pages show 50 entries; link to the page the rank is on.
  const PAGE_SIZE = 50;
  const ROW_HEIGHT = 24;

  const profile = $derived(getProfileContext().current);
</script>

<Section id="Leaderboards" {order}>
  {#if profile?.uuid}
    <svelte:boundary>
      {#snippet pending()}
        <div class="space-y-2 rounded-xl border p-4">
          <Skeleton class="h-7 w-48 rounded-lg" />
          <Skeleton class="h-16 w-full rounded-lg" />
          <Skeleton class="h-80 w-full rounded-xl" />
        </div>
      {/snippet}
      {#snippet failed()}
        <EmptyStat title="Leaderboards are unavailable" description="Try again in a moment." icon={TrophyIcon} />
      {/snippet}

      {const [ranks, list] = await Promise.all([
        getPlayerLeaderboardRanks({ player: profile.uuid }),
        listLeaderboards()
      ])}
      {const current = ranks.profiles?.find((p) => p.profile_id?.toLowerCase() === profile.profile_id?.toLowerCase())}
      {const all = current?.ranks ?? []}
      {const gameMode = isLeaderboardMode(current?.game_mode) ? current.game_mode : "normal"}
      {const categories = (list.categories ?? [])
        .map((category) => ({ ...category, ranks: all.filter((rank) => rank.category === category.id) }))
        .filter((category) => category.ranks.length > 0)}

      {#if all.length === 0}
        <EmptyStat
          title="Not on any leaderboard"
          description={`Only the top ${list.size ?? 1000} of each leaderboard are ranked. This profile isn't among them yet.`}
          icon={TrophyIcon} />
      {:else}
        <div class="space-y-2 rounded-xl border p-4">
          <SectionSubtitle>Leaderboards</SectionSubtitle>
          <div class="space-y-0.5">
            <AdditionStat text="Ranked on" data={`${all.length} leaderboards`} />
            <AdditionStat text="First places" data={all.filter((rank) => rank.rank === 1).length} />
            <AdditionStat text="Top 10 placements" data={all.filter((rank) => (rank.rank ?? 0) <= 10).length} />
            {#if gameMode !== "normal"}
              <AdditionStat
                text={`Top 10 among ${MODE_LABELS[gameMode].toLowerCase()} profiles`}
                data={all.filter((rank) => (rank.mode_rank ?? 0) <= 10).length} />
            {/if}
          </div>
          <p class="text-sm text-muted-foreground">
            Only the top {list.size ?? 1000} of each leaderboard are ranked. Ranks are among all game modes.
          </p>

          <ScrollAreaItems>
            {#each categories as category (category.id)}
              <div class="flex min-w-80 flex-col gap-1 rounded-xl border bg-background/50 py-4 @md:min-w-96">
                <div class="flex w-full items-center justify-center gap-1.5 text-center font-semibold">
                  {category.name}
                  <span class="text-muted-foreground">{category.ranks.length}</span>
                </div>
                <Separator class="bg-primary" />
                <VirtualList
                  height={Math.min(320, category.ranks.length * ROW_HEIGHT)}
                  width="100%"
                  itemCount={category.ranks.length}
                  itemSize={ROW_HEIGHT}
                  scrollDirection="vertical">
                  {#snippet item({ index, style })}
                    {const rank: LeaderboardRank = category.ranks[index]}
                    <a
                      {style}
                      href={leaderboardPath(rank.leaderboard?.id ?? "", "all", Math.ceil((rank.rank ?? 1) / PAGE_SIZE))}
                      data-sveltekit-preload-data="hover"
                      class="flex items-center gap-1 px-4 font-semibold whitespace-nowrap hover:underline focus-visible:underline focus-visible:outline-none">
                      <span class="w-12 shrink-0 text-muted-foreground tabular-nums">#{rank.rank}</span>
                      <span class="min-w-0 truncate text-foreground">
                        {rank.leaderboard?.name}{#if rank.leaderboard?.profile}<span class="text-muted-foreground">
                            (coop)</span
                          >{/if}
                      </span>
                      <span class="ml-auto shrink-0 pl-2 text-muted-foreground tabular-nums">
                        {formatLeaderboardValue(rank.leaderboard, rank.value, rank.raw)}
                      </span>
                      {#if rank.outdated}
                        <OutdatedNote updatedAt={rank.updated_at} />
                      {/if}
                    </a>
                  {/snippet}
                </VirtualList>
              </div>
            {/each}
          </ScrollAreaItems>
        </div>
      {/if}
    </svelte:boundary>
  {/if}
</Section>
