#!/usr/bin/env bash
# Stop: runs pnpm lint on uncommitted changes and asks for pnpm check:pages after UI, route or header changes,
# per AGENTS.md "Commands and verification". Each set of changes is checked once.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

# A second stop after this hook blocked lets the turn end, so a check that can't pass never loops.
if [ "$(jq -r '.stop_hook_active // false')" = "true" ]; then exit 0; fi

changed=$(git status --porcelain --untracked-files=all | cut -c4-)
[ -z "$changed" ] && exit 0

state="$(git rev-parse --git-dir)/claude-verified"
hash=$({ git diff HEAD; git ls-files -o --exclude-standard -z | xargs -0 shasum 2>/dev/null; } | shasum | cut -d' ' -f1)
[ "$(cat "$state" 2>/dev/null)" = "$hash" ] && exit 0

if ! output=$(pnpm lint 2>&1); then
  echo "pnpm lint failed on the uncommitted changes. Fix it, or tell the user why it can't pass:" >&2
  echo "$output" | tail -40 >&2
  exit 2
fi
echo "$hash" >"$state"

if echo "$changed" | grep -qE '^(vite\.config\.ts|src/routes/|src/hooks\.|src/app\.html|static/)'; then
  echo "pnpm lint passed. These changes touch UI, routes, CSP or headers: run 'pnpm check:pages <paths>' against the dev server, or tell the user it couldn't run and why." >&2
  exit 2
fi
