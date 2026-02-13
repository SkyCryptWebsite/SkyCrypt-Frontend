import { execSync } from "node:child_process";
import fs from "node:fs";

const outputFile = process.env.GITHUB_OUTPUT;

function run(command) {
  execSync(command, { stdio: "inherit" });
}

function runOptional(command) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch {
    // Optional command failed (e.g., not in pre mode).
  }
}

function output(command) {
  return execSync(command, { encoding: "utf8" }).trim();
}

function setOutput(name, value) {
  if (!outputFile) {
    return;
  }

  fs.appendFileSync(outputFile, `${name}=${value}\n`);
}

run("git fetch origin prod");
run('git config user.name "github-actions[bot]"');
run('git config user.email "github-actions[bot]@users.noreply.github.com"');
run("git checkout -B changeset-release/prod origin/prod");

runOptional("pnpm changeset pre exit");
run("pnpm changeset version");

try {
  execSync("git diff --quiet");
  const version = output("node -p \"require('./package.json').version\"");
  setOutput("release_ready", version.includes("beta") ? "false" : "true");
  process.exit(0);
} catch {
  // There are changes to commit.
}

run("git add -A");
run('git commit -m "chore: version packages"');
run("git push origin HEAD:changeset-release/prod --force");

const existingPr = output("gh pr list --head changeset-release/prod --base prod --json number --jq '.[0].number'");

if (!existingPr) {
  run('gh pr create --title "Version Packages (Stable)" --body "" --base prod --head changeset-release/prod');
}

setOutput("release_ready", "false");
