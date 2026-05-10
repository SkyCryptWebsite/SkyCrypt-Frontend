import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const changesetDir = path.join(process.cwd(), ".changeset");

/**
 * Extract the section for `version` out of CHANGELOG.md (everything between
 * `## ${version}` and the next `## ` heading). We pass this to
 * `gh release create --notes-file` instead of `--generate-notes`, because
 * the latter only lists merged PRs since the previous tag — direct-to-`dev`
 * commits with changesets would otherwise be invisible on the release page.
 */
function extractChangelogSection(version) {
  const changelogPath = path.join(process.cwd(), "CHANGELOG.md");
  if (!fs.existsSync(changelogPath)) return "";
  const lines = fs.readFileSync(changelogPath, "utf8").split("\n");
  const start = lines.findIndex((line) => line === `## ${version}`);
  if (start === -1) return "";
  const next = lines.findIndex((line, i) => i > start && line.startsWith("## "));
  return lines.slice(start + 1, next === -1 ? undefined : next).join("\n").trim();
}

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

  const notes = extractChangelogSection(version);
  if (notes) {
    const notesPath = path.join(os.tmpdir(), `release-notes-${tag}.md`);
    fs.writeFileSync(notesPath, notes);
    try {
      run(`gh release create ${tag} --title ${tag} --notes-file "${notesPath}" --prerelease`);
    } finally {
      fs.rmSync(notesPath, { force: true });
    }
  } else {
    console.warn(`No CHANGELOG.md section for ${version}; falling back to --generate-notes`);
    run(`gh release create ${tag} --title ${tag} --generate-notes --prerelease`);
  }
}
