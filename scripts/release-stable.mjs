import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const changesetDir = path.join(process.cwd(), ".changeset");

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
run("git checkout -B prod origin/prod");

const preStatePath = path.join(changesetDir, "pre.json");

if (fs.existsSync(preStatePath)) {
  try {
    const preState = JSON.parse(fs.readFileSync(preStatePath, "utf8"));

    if (preState?.mode === "pre") {
      runOptional("pnpm changeset pre exit");
    }
  } catch {
    runOptional("pnpm changeset pre exit");
  }
}

run("pnpm changeset version");

try {
  execSync("git diff --quiet");
  console.info("No stable version changes detected");
} catch {
  // There are changes to commit.
  run("git add -A");
  run('git commit -m "chore: version packages (stable) [skip ci]"');
  run("git push origin HEAD:prod");
  run("git fetch origin prod");
  run("git checkout -B prod origin/prod");
}

const version = output("node -p \"require('./package.json').version\"");

if (version.includes("beta")) {
  console.info(`Current version (${version}) is still a beta, skipping stable release`);
  process.exit(0);
}

const tag = `v${version}`;
const remoteTag = output(`git ls-remote --tags origin ${tag}`);

if (remoteTag) {
  console.info(`Tag ${tag} already exists, skipping`);
} else {
  run(`git tag ${tag}`);
  run(`git push origin ${tag}`);
}

const existingRelease = outputOptional(`gh release view ${tag} --json tagName --jq '.tagName'`);

if (existingRelease) {
  console.info(`Release ${tag} already exists, skipping`);
} else {
  run(`gh release create ${tag} --title ${tag} --generate-notes`);
}
