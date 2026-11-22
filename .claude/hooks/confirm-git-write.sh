#!/usr/bin/env bash
# PreToolUse(Bash): makes the user confirm git add/commit/push, per AGENTS.md (never stage unasked; ask dev vs branch).
if jq -r '.tool_input.command // ""' | grep -qE '(^|[[:space:];&|(])git[[:space:]]+(-C[[:space:]]+[^[:space:]]+[[:space:]]+)?(add|commit|push)([[:space:]]|$)'; then
  jq -n '{hookSpecificOutput: {hookEventName: "PreToolUse", permissionDecision: "ask",
    permissionDecisionReason: "AGENTS.md: only stage when asked, and ask whether this goes on dev or a new branch before committing or pushing."}}'
fi
