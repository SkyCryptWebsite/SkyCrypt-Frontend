<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import EmptyStat from "$src/lib/components/EmptyStat.svelte";
  import * as Select from "$ui/select";
  import { Skeleton } from "$ui/skeleton";
  import * as Table from "$ui/table";
  import * as Tabs from "$ui/tabs";
  import TrophyIcon from "@lucide/svelte/icons/trophy";
  import SvelteSeo from "svelte-seo";
  import {
    BoardPicker,
    DEFAULT_LEADERBOARD,
    EntryPlayers,
    findLeaderboard,
    formatLeaderboardDetail,
    formatLeaderboardValue,
    isLeaderboardMode,
    LEADERBOARD_MODES,
    leaderboardPath,
    MODE_LABELS,
    OutdatedNote,
    type LeaderboardMode
  } from "#lib/components/leaderboards";
  import Pagination from "#lib/components/newsroom/Pagination.svelte";
  import { Notice } from "#lib/components/notices";
  import { getLeaderboard, listLeaderboards } from "#lib/shared/api/skycrypt-api.remote";
  import { cn } from "#lib/shared/utils";

  const PAGE_SIZE = 50;

  const leaderboardId = $derived(page.params.leaderboard || DEFAULT_LEADERBOARD);
  const mode = $derived.by((): LeaderboardMode => {
    const value = page.url.searchParams.get("mode");
    return isLeaderboardMode(value) ? value : "all";
  });
  const pageNumber = $derived(Math.max(1, Math.trunc(Number(page.url.searchParams.get("page"))) || 1));

  const list = $derived(await listLeaderboards());
  const found = $derived(findLeaderboard(list, leaderboardId));
  const board = $derived(found?.board);
  const category = $derived(found?.category ?? list.categories?.[0]);
  const title = $derived(board ? `${board.name} Leaderboard | SkyCrypt` : "Leaderboards | SkyCrypt");
  const boardNotes = $derived(
    [board?.ascending && "Lowest first", board?.profile && "Whole profiles", MODE_LABELS[mode]].filter(Boolean)
  );
  const valueHeading = $derived.by(() => {
    if (board?.unit === "level") return "Level";
    if (board?.unit === "time") return "Time";
    return board?.name ?? "";
  });
</script>

<SvelteSeo
  {title}
  description="The best Hypixel SkyBlock players on SkyCrypt: levels, networth, skills, slayers, dungeons, collections, kills and more."
  canonical={`https://sky.shiiyu.moe/leaderboards/${leaderboardId}`} />

<main
  class="@container mx-auto flex max-w-272 flex-col gap-4 pt-5 pr-[max(1.25rem,env(safe-area-inset-right))] pb-[max(1.25rem,env(safe-area-inset-bottom))] pl-[max(1.25rem,env(safe-area-inset-left))]">
  <div
    class="flex flex-col gap-4 rounded-xl border glass p-4 glass-brightness-150 glass-contrast-60 dark:glass-brightness-50 dark:glass-contrast-100">
    <header class="flex flex-col gap-1">
      <h1 class="text-3xl leading-tight font-bold text-foreground">Leaderboards</h1>
      <p class="text-sm text-foreground/70">
        The top {list.size ?? 1000} of every leaderboard, from the profiles SkyCrypt has seen. Players appear once per profile.
      </p>
    </header>

    <nav aria-label="Leaderboard categories" class="flex flex-wrap gap-2">
      {#each list.categories ?? [] as c (c.id)}
        <a
          href={leaderboardPath(c.leaderboards?.[0]?.id ?? DEFAULT_LEADERBOARD, mode)}
          data-sveltekit-preload-data="hover"
          aria-current={c.id === category?.id ? "page" : undefined}
          class={cn(
            "rounded-full border px-3 py-1 text-sm font-semibold transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            c.id === category?.id
              ? "border-primary bg-primary text-primary-foreground hover:bg-primary"
              : "bg-background/50"
          )}>
          {c.name}
        </a>
      {/each}
    </nav>

    <div class="flex flex-col gap-3 @md:flex-row @md:items-center @md:justify-between">
      <BoardPicker boards={category?.leaderboards ?? []} current={board} {mode} />

      <Tabs.Root
        value={mode}
        onValueChange={(value) => void goto(leaderboardPath(leaderboardId, value as LeaderboardMode))}>
        <Tabs.List class="hidden @lg:inline-flex">
          {#each LEADERBOARD_MODES as m (m)}
            <Tabs.Trigger value={m}>{MODE_LABELS[m]}</Tabs.Trigger>
          {/each}
        </Tabs.List>
      </Tabs.Root>
      <Select.Root
        type="single"
        value={mode}
        onValueChange={(value) => void goto(leaderboardPath(leaderboardId, value as LeaderboardMode))}>
        <Select.Trigger class="w-full @lg:hidden" aria-label="Game mode">{MODE_LABELS[mode]}</Select.Trigger>
        <Select.Content>
          {#each LEADERBOARD_MODES as m (m)}
            <Select.Item value={m}>{MODE_LABELS[m]}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
  </div>

  {#if !board}
    <EmptyStat
      class="glass"
      icon={TrophyIcon}
      title="Unknown leaderboard"
      description="Pick a category and a leaderboard above." />
  {:else}
    {#key `${leaderboardId}/${mode}/${pageNumber}`}
      <svelte:boundary>
        {#snippet pending()}
          <div
            class="flex flex-col gap-2 rounded-xl border glass p-4 glass-brightness-150 glass-contrast-60 dark:glass-brightness-50 dark:glass-contrast-100">
            {#each new Array(10) as _, index (index)}
              <Skeleton class="h-10 w-full rounded-lg" />
            {/each}
          </div>
        {/snippet}
        {#snippet failed(err, retry)}
          <Notice title="Failed to load the leaderboard." type="error" error={err} {retry} />
        {/snippet}

        {const result = await getLeaderboard({
          leaderboard: leaderboardId,
          mode,
          page: pageNumber,
          limit: PAGE_SIZE
        })}
        {const totalPages = Math.max(1, Math.ceil((result.total ?? 0) / PAGE_SIZE))}

        {#if !result.entries?.length}
          <EmptyStat
            class="glass"
            icon={TrophyIcon}
            title="Nobody here yet"
            description={mode === "all"
              ? "Profiles show up here once they've been viewed on SkyCrypt."
              : `No ${MODE_LABELS[mode].toLowerCase()} profiles are ranked yet.`} />
        {:else}
          <div
            class="overflow-hidden rounded-xl border glass glass-brightness-150 glass-contrast-60 dark:glass-brightness-50 dark:glass-contrast-100">
            <div class="flex flex-wrap items-baseline justify-between gap-2 border-b px-4 py-3">
              <h2 class="text-lg font-semibold">
                {board.name}
                {#if board.group}<span class="text-sm font-medium text-muted-foreground">· {board.group}</span>{/if}
              </h2>
              <span class="text-sm text-muted-foreground">{boardNotes.join(" · ")}</span>
            </div>
            {#if result.ready === false}
              <p class="border-b px-4 py-2 text-sm text-muted-foreground">
                Leaderboards are being rebuilt and may be incomplete for a few minutes.
              </p>
            {/if}
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head class="w-12 text-right">#</Table.Head>
                  <Table.Head>{board.profile ? "Profile members" : "Player"}</Table.Head>
                  <Table.Head class="hidden @lg:table-cell">Profile</Table.Head>
                  <Table.Head class="text-right">{valueHeading}</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {#each result.entries as entry (`${entry.uuid}/${entry.profile_id}`)}
                  <Table.Row>
                    <Table.Cell class="text-right font-bold text-muted-foreground tabular-nums"
                      >{entry.rank}</Table.Cell>
                    <Table.Cell class="w-full max-w-0">
                      <EntryPlayers {entry} showMode={mode === "all"} />
                    </Table.Cell>
                    <Table.Cell class="hidden text-muted-foreground @lg:table-cell">{entry.cute_name}</Table.Cell>
                    <Table.Cell class="text-right whitespace-nowrap">
                      <div class="flex items-center justify-end gap-1.5">
                        {#if entry.outdated}
                          <OutdatedNote updatedAt={entry.updated_at} />
                        {/if}
                        <span class="font-semibold tabular-nums">
                          {formatLeaderboardValue(board, entry.value, entry.raw)}
                        </span>
                      </div>
                      {#if formatLeaderboardDetail(board, entry.raw)}
                        <div class="hidden text-xs text-muted-foreground tabular-nums @sm:block">
                          {formatLeaderboardDetail(board, entry.raw)}
                        </div>
                      {/if}
                    </Table.Cell>
                  </Table.Row>
                {/each}
              </Table.Body>
            </Table.Root>
          </div>

          {#if totalPages > 1}
            <div
              class="flex items-center justify-end rounded-xl border glass p-4 glass-brightness-150 glass-contrast-60 dark:glass-brightness-50 dark:glass-contrast-100">
              <Pagination page={pageNumber} {totalPages} baseHref={leaderboardPath(leaderboardId, mode)} />
            </div>
          {/if}
        {/if}
      </svelte:boundary>
    {/key}
  {/if}
</main>
