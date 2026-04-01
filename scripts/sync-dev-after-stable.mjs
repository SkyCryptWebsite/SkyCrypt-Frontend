import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const changesetDir = path.join(process.cwd(), ".changeset");

function run(command) {
  execSync(command, { stdio: "inherit" });
}

function output(command) {
  return execSync(command, { encoding: "utf8" }).trim();
}

function outputOptional(command) {
  try {
    return execSync(command, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

run("git fetch origin prod dev");
run('git config user.name "github-actions[bot]"');
run('git config user.email "github-actions[bot]@users.noreply.github.com"');
run("git checkout -B dev-sync origin/dev");

try {
  run('git merge --no-ff -m "chore: sync prod into dev [skip ci]" origin/prod');
} catch {
  const conflicts = outputOptional("git diff --name-only --diff-filter=U");

  if (conflicts) {
    throw new Error(`Syncing prod into dev has merge conflicts:\n${conflicts}`);
  }
}

const preStatePath = path.join(changesetDir, "pre.json");
let isInBetaPreMode = false;

if (fs.existsSync(preStatePath)) {
  try {
    const preState = JSON.parse(fs.readFileSync(preStatePath, "utf8"));
    isInBetaPreMode = preState?.mode === "pre" && preState?.tag === "beta";
  } catch {
    isInBetaPreMode = false;
  }
}

if (!isInBetaPreMode) {
  run("pnpm changeset pre enter beta");
}

try {
  execSync("git diff --quiet");
} catch {
  run("git add -A");
  run('git commit -m "chore: re-enter beta pre mode [skip ci]"');
}

const commitsAhead = Number(output("git rev-list --count origin/dev..HEAD"));

if (commitsAhead === 0) {
  console.info("No prod changes to sync back into dev");
  process.exit(0);
}

run("git push origin HEAD:dev");
