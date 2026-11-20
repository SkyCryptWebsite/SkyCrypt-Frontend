import fs from "node:fs";
import path from "node:path";

export function readPreState(changesetDir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(changesetDir, "pre.json"), "utf8"));
  } catch {
    return null;
  }
}

export function pendingChangesets(changesetDir, preState = readPreState(changesetDir)) {
  const consumed = new Set(preState?.mode === "pre" ? (preState.changesets ?? []) : []);

  return fs
    .readdirSync(changesetDir)
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .map((file) => file.slice(0, -3))
    .filter((id) => !consumed.has(id));
}
