---
name: upgrade-deps
description: Upgrade every SkyCrypt Frontend dependency and GitHub Actions `uses:` version to latest, majors included, and report breaking changes, migrations, new features, and better or faster ways to do what the code already does. Use when asked to update packages, deps or actions.
---

1. Note the current versions (`pnpm outdated`), then run `pnpm up -L`. `pnpm-workspace.yaml` already pins what must stay.
2. Bump every `uses:` in `.github/workflows/` and `.github/actions/` to its latest major. Check each action's releases with `gh release list -R <owner>/<repo>` and read the notes for changed inputs and runtime requirements.
3. For every major bump, and minors of core packages (svelte, @sveltejs/kit, better-auth, drizzle, postgres, takumi, tailwind, vite, vitest), read the official changelog or migration guide before touching code. Use the Svelte MCP and Better Auth MCP where they apply. Check peer compatibility, such as drizzle and better-auth against the postgres driver.
4. Apply the required migrations. Run `pnpm update:shadcn` if shadcn-svelte moved. If the backend runs on :8080, regenerate the Orval targets.
5. While reading the changelogs, look for anything that does better what the code already does by hand. That covers new APIs, built-ins that replace custom code or dependencies, performance and bundle-size wins, deprecated patterns still in use, and config options that cut build or CI time. Find where each applies with a search.
6. Run `pnpm lint`, `pnpm test` and `pnpm build`. With the dev server up, also run `pnpm check:pages`. Fix what broke and don't delete tests to get green.
7. Report:
   - a table of package or action, old version, new version, and the breaking changes with what you did about them;
   - new features worth adopting;
   - better, faster or simpler ways to do existing things, each with the file it applies to and the expected gain.

   Name the docs you read.
8. Add a changeset if the upgrade changes runtime behavior. Don't commit: ask whether it goes on `dev` or a new branch.
