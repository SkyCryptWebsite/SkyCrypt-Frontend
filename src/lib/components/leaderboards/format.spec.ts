import { describe, expect, it } from "vitest";
import { formatDuration, formatLeaderboardValue, groupLeaderboards } from "./format";

describe("formatDuration", () => {
  it("shows minutes, padded seconds and milliseconds", () => {
    expect(formatDuration(198061)).toBe("3:18.061");
    expect(formatDuration(59_005)).toBe("0:59.005");
  });
});

describe("formatLeaderboardValue", () => {
  it("formats run times from the raw milliseconds, not the value", () => {
    expect(formatLeaderboardValue({ unit: "time" }, 0, 250357)).toBe("4:10.357");
  });
});

describe("groupLeaderboards", () => {
  it("keeps the API order and starts a group whenever it changes", () => {
    const groups = groupLeaderboards([
      { id: "a", group: "Farming" },
      { id: "b", group: "Farming" },
      { id: "c", group: "Mining" },
      { id: "d" }
    ]);
    expect(groups.map((g) => [g.name, g.boards.map((b) => b.id)])).toEqual([
      ["Farming", ["a", "b"]],
      ["Mining", ["c"]],
      ["", ["d"]]
    ]);
  });
});
