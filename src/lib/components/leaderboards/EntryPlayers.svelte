<script lang="ts">
  import { resolve } from "$app/paths";
  import { Badge } from "$ui/badge";
  import type { LeaderboardEntry } from "#lib/shared/api/orval-generated";
  import { cn } from "#lib/shared/utils";

  let {
    entry,
    showMode = false,
    class: className
  }: { entry: LeaderboardEntry; showMode?: boolean; class?: string } = $props();

  // Profile boards (coop collections, garden) rank the whole profile; show who is on it.
  const players = $derived(
    entry.members?.length ? entry.members : [{ uuid: entry.uuid ?? "", username: entry.username ?? "" }]
  );
  const shown = $derived(players.slice(0, 4));
  const label = $derived.by(() => {
    const names = players.map((p) => p.username || "Unknown");
    if (names.length <= 2) return names.join(", ");
    return `${names.slice(0, 2).join(", ")} +${names.length - 2}`;
  });
  const href = $derived(
    resolve("/stats/[ign=ign]/[[profile=profile]]", {
      ign: players[0]?.username || players[0]?.uuid || "",
      profile: entry.cute_name || ""
    })
  );
</script>

<a
  {href}
  data-sveltekit-preload-data="hover"
  class={cn(
    "flex min-w-0 items-center gap-3 rounded-md font-semibold hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
    className
  )}>
  <span class="flex shrink-0 -space-x-2">
    {#each shown as player (player.uuid)}
      <img
        loading="lazy"
        src={`https://nmsr.nickac.dev/face/${player.uuid}`}
        alt=""
        class="size-7 rounded-sm ring-2 ring-background [image-rendering:pixelated]" />
    {/each}
  </span>
  <span class="truncate">{label}</span>
  {#if showMode && entry.game_mode && entry.game_mode !== "normal"}
    <Badge variant="outline" class="hidden capitalize @sm:inline-flex">{entry.game_mode}</Badge>
  {/if}
</a>
