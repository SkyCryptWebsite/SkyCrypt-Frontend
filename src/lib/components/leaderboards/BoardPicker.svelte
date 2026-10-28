<script lang="ts">
  import { buttonVariants } from "$ui/button";
  import * as Command from "$ui/command";
  import * as Popover from "$ui/popover";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import type { LeaderboardInfo } from "#lib/shared/api/orval-generated";
  import { cn } from "#lib/shared/utils";
  import { groupLeaderboards, leaderboardPath, type LeaderboardMode } from "./format";

  let {
    boards,
    current,
    mode
  }: { boards: LeaderboardInfo[]; current: LeaderboardInfo | undefined; mode: LeaderboardMode } = $props();

  let open = $state(false);
  const groups = $derived(groupLeaderboards(boards));
</script>

<Popover.Root bind:open>
  <Popover.Trigger class={cn(buttonVariants({ variant: "outline" }), "w-full justify-between @md:w-72")}>
    <span class="truncate">{current?.name ?? "Pick a leaderboard"}</span>
    <ChevronsUpDownIcon class="size-4 opacity-60" />
  </Popover.Trigger>
  <Popover.Content class="w-(--bits-popover-anchor-width) min-w-72 p-0" align="start" sideOffset={6}>
    <Command.Root>
      <Command.Input placeholder="Search leaderboards…" />
      <Command.List class="max-h-80">
        <Command.Empty>No leaderboard found.</Command.Empty>
        {#each groups as group (group.name)}
          <Command.Group heading={group.name || undefined}>
            {#each group.boards as board (board.id)}
              <Command.LinkItem
                href={leaderboardPath(board.id ?? "", mode)}
                value={`${board.id} ${board.name} ${group.name}`}
                onSelect={() => (open = false)}
                class={cn(board.id === current?.id && "font-bold text-primary")}>
                {board.name}
              </Command.LinkItem>
            {/each}
          </Command.Group>
        {/each}
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
