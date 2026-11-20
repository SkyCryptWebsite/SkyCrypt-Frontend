import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { pendingChangesets } from "./changesets.js";

let dir;

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "changesets-"));
  fs.writeFileSync(path.join(dir, "README.md"), "");
  fs.writeFileSync(path.join(dir, "config.json"), "{}");
});

afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

describe("pendingChangesets", () => {
  it("ignores README and non-markdown files", () => {
    expect(pendingChangesets(dir)).toEqual([]);
  });

  it("skips changesets already consumed by the beta pre release", () => {
    fs.writeFileSync(path.join(dir, "old-fix.md"), "");
    fs.writeFileSync(path.join(dir, "new-feat.md"), "");
    const preState = { mode: "pre", tag: "beta", changesets: ["old-fix"] };

    expect(pendingChangesets(dir, preState)).toEqual(["new-feat"]);
  });

  it("counts every changeset once pre mode has exited", () => {
    fs.writeFileSync(path.join(dir, "old-fix.md"), "");

    expect(pendingChangesets(dir, { mode: "exit", changesets: ["old-fix"] })).toEqual(["old-fix"]);
  });
});
