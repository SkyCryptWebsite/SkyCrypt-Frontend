import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const changesetDir = path.join(process.cwd(), ".changeset");
const outputFile = process.env.GITHUB_OUTPUT;

function run(command) {
  execSync(command, { stdio: "inherit" });
}

function runOptional(command) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch {
    // Optional command failed (e.g., already in pre mode).
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

const hasChangesets = fs.existsSync(changesetDir) && fs.readdirSync(changesetDir).some((name) => name.endsWith(".md") && name !== "README.md");

if (!hasChangesets) {
  const version = output("node -p \"require('./package.json').version\"");
  setOutput("release_ready", version.includes("beta") ? "true" : "false");
  process.exit(0);
}

run("git fetch origin dev");
run('git config user.name "github-actions[bot]"');
run('git config user.email "github-actions[bot]@users.noreply.github.com"');
run("git checkout -B changeset-release/dev origin/dev");

const preStatePath = path.join(changesetDir, "pre.json");
let inPreMode = false;

if (fs.existsSync(preStatePath)) {
  try {
    const preState = JSON.parse(fs.readFileSync(preStatePath, "utf8"));
    inPreMode = preState?.mode === "pre";
  } catch {
    inPreMode = false;
  }
}

if (!inPreMode) {
  runOptional("pnpm changeset pre enter beta");
}
run("pnpm changeset:version");

try {
  execSync("git diff --quiet");
  setOutput("release_ready", "false");
  process.exit(0);
} catch {
  // There are changes to commit.
}

run("git add -A");
run('git commit -m "chore: version packages (beta)"');
run("git push origin HEAD:changeset-release/dev --force");

const existingPr = output("gh pr list --head changeset-release/dev --base dev --json number --jq '.[0].number'");

if (!existingPr) {
  run('gh pr create --title "Version Packages" --body "" --base dev --head changeset-release/dev');
}

setOutput("release_ready", "false");
