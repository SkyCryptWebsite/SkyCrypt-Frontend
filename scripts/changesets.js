import fs from "node:fs";
import path from "node:path";

export function readPreState(changesetDir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(changesetDir, "pre.json"), "utf8"));
  } catch {
    return null;
  }
}

function changesetIds(dir) {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .map((file) => file.slice(0, -3));
}

export function pendingChangesets(changesetDir, preState = readPreState(changesetDir)) {
  const consumed = new Set(preState?.mode === "pre" ? (preState.changesets ?? []) : []);

  return changesetIds(changesetDir).filter((id) => !consumed.has(id));
}

// A stable release also ships what the beta line already versioned, which changesets v3 moves into .changeset/pre/.
export function releasableChangesets(changesetDir) {
  const preDir = path.join(changesetDir, "pre");
  const versioned = fs.existsSync(preDir) ? changesetIds(preDir) : [];

  return [...pendingChangesets(changesetDir, null), ...versioned];
}
