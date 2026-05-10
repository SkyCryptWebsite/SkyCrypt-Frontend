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
    // Optional command failed.
  }
}

function output(command) {
  return execSync(command, { encoding: "utf8" }).trim();
}

run("git fetch origin dev");
run('git config user.name "github-actions[bot]"');
run('git config user.email "github-actions[bot]@users.noreply.github.com"');
run("git checkout -B dev origin/dev");

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
  runOptional("pnpm changeset pre exit");
  run("pnpm changeset pre enter beta");
}

run("pnpm changeset:version");

try {
  execSync("git diff --quiet");
  console.info("No beta version changes detected");
} catch {
  // There are changes to commit.
  run("git add -A");
  run('git commit -m "chore: version packages (beta) [skip ci]"');
  run("git push origin HEAD:dev");
}

const version = output("node -p \"require('./package.json').version\"");

if (!version.includes("beta")) {
  console.info(`Current version (${version}) is not a beta, skipping prerelease`);
  process.exit(0);
}

const tag = `v${version}`;
const remoteTag = output(`git ls-remote --tags origin ${tag}`);

if (remoteTag) {
  console.info(`Tag ${tag} already exists, skipping`);
} else {
  run(`git tag ${tag}`);
  run(`git push origin ${tag}`);
  run(`gh release create ${tag} --title ${tag} --generate-notes --prerelease`);
}
