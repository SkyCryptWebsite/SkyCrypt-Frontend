import { resolve } from "$app/paths";
import type { ResolvedPathname } from "$app/types";
import { format } from "numerable";
import type { LeaderboardInfo, LeaderboardList } from "#lib/shared/api/orval-generated";
import { formatNumber } from "#lib/shared/helper";

export const LEADERBOARD_MODES = ["all", "normal", "ironman", "stranded", "bingo"] as const;
export type LeaderboardMode = (typeof LEADERBOARD_MODES)[number];

export const MODE_LABELS: Record<LeaderboardMode, string> = {
  all: "All modes",
  normal: "Normal",
  ironman: "Ironman",
  stranded: "Stranded",
  bingo: "Bingo"
};

export const DEFAULT_LEADERBOARD = "skyblock_level";

export function isLeaderboardMode(value: string | null | undefined): value is LeaderboardMode {
  return LEADERBOARD_MODES.includes(value as LeaderboardMode);
}

/** A run time in milliseconds as m:ss.SSS. */
export function formatDuration(ms: number) {
  const minutes = Math.floor(ms / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  const millis = Math.floor(ms % 1000);
  return `${minutes}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
}

/** The main number of an entry, in the board's unit. */
export function formatLeaderboardValue(board: Pick<LeaderboardInfo, "unit"> | undefined, value = 0, raw = 0) {
  switch (board?.unit) {
    case "level":
      return format(value, "0,0.00");
    case "time":
      return formatDuration(raw);
    case "coins":
      return formatNumber(raw);
    default:
      return format(raw, "0,0");
  }
}

/** The secondary number of an entry: the XP behind a level, the exact coins behind a short amount. */
export function formatLeaderboardDetail(board: Pick<LeaderboardInfo, "unit"> | undefined, raw = 0) {
  switch (board?.unit) {
    case "level":
      return `${format(raw, "0,0")} XP`;
    case "coins":
      return `${format(raw, "0,0")} coins`;
    default:
      return undefined;
  }
}

/** Link to a board page; mode and page go in the query so the path stays one route. */
export function leaderboardPath(leaderboard: string, mode: LeaderboardMode = "all", page = 1): ResolvedPathname {
  const params = new URLSearchParams();
  if (mode !== "all") params.set("mode", mode);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  const path = resolve("/leaderboards/[[leaderboard]]", { leaderboard });
  return (query ? `${path}?${query}` : path) as ResolvedPathname;
}

/** Finds a board and its category in the list. */
export function findLeaderboard(list: LeaderboardList | undefined, id: string) {
  for (const category of list?.categories ?? []) {
    const board = category.leaderboards?.find((b) => b.id === id);
    if (board) return { category, board };
  }
  return undefined;
}

/** Splits a category's boards by group, keeping the order the API lists them in. */
export function groupLeaderboards(boards: LeaderboardInfo[]) {
  const groups: { name: string; boards: LeaderboardInfo[] }[] = [];
  for (const board of boards) {
    const name = board.group ?? "";
    const last = groups.at(-1);
    if (last?.name === name) {
      last.boards.push(board);
    } else {
      groups.push({ name, boards: [board] });
    }
  }
  return groups;
}
