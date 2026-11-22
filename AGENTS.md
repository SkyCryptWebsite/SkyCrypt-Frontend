# AGENTS.md

Follow these instructions when working on SkyCrypt Frontend. Nested `AGENTS.md` files may add instructions for their directories. See `CONTRIBUTING.md` for setup and release policy.

## Working in this repository

- Read the code, configuration, and tests relevant to the task before editing. Preserve unrelated staged and unstaged work.
- Ask clarifying questions before starting non-trivial work when the request leaves a real choice open.
- Reuse existing helpers and components before introducing dependencies or abstractions.
- Update this file when project practices change, or when the user states a preference or corrects your approach in a way that should apply to future work. Add or update the rule without being asked and mention it in your report. Project rules go here, not in an agent's private memory, so every session and contributor sees them. Check instructions against the repository and link to existing documentation instead of repeating it. Keep machine-specific paths out of this file.

## Stack and setup

- SkyCrypt is a Hypixel SkyBlock profile viewer built with SvelteKit 2, Svelte 5, strict TypeScript, and Tailwind CSS 4. Production uses the Node adapter.
- Use Node 26 and pnpm 12, as required by `package.json` and CI. Other runtimes and package managers are unsupported. Keep `pnpm-lock.yaml` in sync with dependency changes.
- Install with `pnpm install`. Copy `.env.example` to `.env` without overwriting an existing file. Never commit secrets or local environment files.
- Profile data and end-to-end tests require the Go backend from the separate SkyCrypt-Backend repository. Newsroom uploads go to Cloudflare R2. See `.env.example` for service URLs.
- Database and authentication code use PostgreSQL, Drizzle, and Better Auth. `pnpm db:start` starts local PostgreSQL. Server startup applies migrations from `drizzle/` through `src/hooks.server.ts`; builds skip migration execution.

## Structure and boundaries

| Location              | Purpose                                                                |
| --------------------- | ---------------------------------------------------------------------- |
| `src/lib/components/` | Reusable UI and feature components; shared UI primitives live in `ui/` |
| `src/lib/layouts/`    | Structural composition of components                                   |
| `src/lib/sections/`   | Domain sections composed from layouts and components                   |
| `src/lib/shared/`     | Shared utilities, themes, API clients, and remote functions            |
| `src/lib/server/`     | Server-only authentication, integrations, and database code            |
| `src/lib/hooks/`      | Reusable Svelte hooks                                                  |
| `src/lib/types/`      | Shared TypeScript types                                                |
| `src/context/`        | Reactive contexts and preferences                                      |
| `src/routes/`         | SvelteKit routes and route-specific remote functions                   |
| `src/test-utils/`     | Shared test wrappers and helpers                                       |
| `e2e/`                | Playwright user-flow tests                                             |
| `drizzle/`            | SQL migrations and migration metadata                                  |
| `static/`             | Public assets                                                          |
| `scripts/`            | Release and maintenance scripts                                        |

- Compose components into layouts, then layouts into sections. Components must not depend on sections.
- Initialize global contexts in `src/routes/+layout.svelte`. Keep request-specific user and session state out of shared server globals.
- Use configured aliases such as `#lib`, `$ctx`, `$types`, `$ui`, and `$utils`. Alias and SvelteKit configuration live in `vite.config.ts`.
- Write local and alias imports without `.js`/`.ts` extensions or a trailing `/index` (`#lib/server/db`, `./format`). Keep the extension on `.svelte.ts` modules so they aren't read as components. shadcn-managed files in `src/lib/components/ui/` and Orval output keep their generated style. `#lib` resolves through the Vite alias and the `#lib/*` TypeScript path, not only the `package.json` import map, which needs exact file names.
- `getHeaders` in `src/lib/shared/api/mutator/custom-instance.ts` forwards every incoming request header to the backend. That is intended; don't strip headers or flag it in reviews.
- Keep credentials and database access in server-only code. Treat every `PUBLIC_*` environment variable as exposed to the browser.
- `src/routes/api/internal/` holds routes only the Go backend calls (API key verification and usage reporting), guarded by `SERVER_API_TOKEN` through `requireBackendToken`. nginx must never route `/api/internal` publicly. The backend enforces API key rate limits, so Better Auth's own API key rate limiter stays disabled.
- Log with evlog, never `console.*` in server code (ESLint enforces this). Configure it in `evlog.config.ts`; `src/hooks.server.ts` wires the hooks, Better Auth identity and drains. In a request, add context to the single wide event with `locals.log.set({ ... })` instead of extra log lines. Outside a request use `log` from `evlog`: `log.info("tag", "message")`, or `log.error({ action: "domain.event", error })` so HyperDX can filter on `action`. Output is plain text in the Dokploy Logs tab and ships to HyperDX when `HYPERDX_OTLP_ENDPOINT` is set (dev writes NDJSON to `.evlog/logs`, readable with `pnpm exec evlog logs`). Server traces (SvelteKit spans plus outgoing `fetch`) go to the same HyperDX endpoint through `src/instrumentation.server.ts`, which reads `process.env` because it loads before the app; `traceHandler` in `src/hooks.server.ts` puts the trace id on each request's wide event so HyperDX links logs to traces. Browser code logs with `log` from `evlog/client` (set up in `src/hooks.client.ts`); warnings and errors post to `/api/client-logs`, an unauthenticated endpoint that sanitizes and rate limits input, so never trust or extend its payload without updating `src/lib/server/client-logs.ts`.

## Cloudflare

The `shiiyu.moe` zone sits in front of everything. Its custom, transform and configuration rules live in Cloudflare, not in this repo. Confirm with the user before changing them.

- Clients may send `X-Known-Bot: true` on purpose: the backend then serves stored data instead of spending a Hypixel API key request. Don't strip or restrict it. Bot counts use `X-Verified-Bot`, which Cloudflare sets on every request, so clients can't spoof it.
- Never block HTTP/1.x or allow only HTTP/3. Doing that once locked Googlebot out and hurt search rankings.
- Every page calls `/_app/remote/*`, so a challenge or rate limit there breaks the site for real users. Change those rules with care.
- Requests to `api.shiiyu.moe` with an `x-api-key` header skip the bot rules; the backend checks keys and enforces rate limits.
- Don't add Cloudflare cache rules for `/_app/*`, including `/_app/remote/*`. Caching them broke the site; nginx handles caching.
- Do routing, redirects and caching in nginx (the GitOpsConfig repo, `nginx/conf.d`), not in Traefik or Dokploy domain settings.

## Implementation conventions

- Use Svelte 5 runes (`$state`, `$derived`, `$props`) and snippets. Avoid legacy reactive declarations, `export let`, and slots in new code.
- Use the Svelte MCP to get the latest svelte documentation and conventions. Use the async flag to get the latest SvelteKit documentation and conventions for async svelte and remote functions, as that is the default for this project (instead of +page.server.ts way of loading data).
- The project enables async Svelte compilation and SvelteKit remote functions. Use `--async` when validating with Svelte MCP/CLI tooling.
- Check official documentation before implementing: the Svelte MCP for Svelte and SvelteKit, the library's own docs (for example takumi, Better Auth, Cloudflare) and the Node 26 docs for server code. Prefer SvelteKit features, then Node 26 built-ins, then library features, then hand-written code. Context7 can lag behind official docs. Say which docs you checked when reporting.
- Use SvelteKit remote functions in `*.remote.ts` for new data loading and mutations instead of adding `+page.server.ts`. Migrate existing server route files only when the task calls for it.
- Validate remote-function inputs and check authentication and authorization on the server. Follow nearby implementations, and check permissions in each protected mutation even when route guards or hidden controls restrict access.
- Use Tailwind utilities, the shared `cn()` helper, and existing theme tokens and UI primitives. UI changes must work with a keyboard, show focus, adapt to screen size, and support existing themes.
- Encode static images, animated ones included, as AVIF, not WebP or GIF.
- Name reusable Svelte components in PascalCase and utilities in camelCase; follow SvelteKit route naming and nearby feature-file conventions.
- Follow `.oxfmtrc.json`: two spaces, double quotes, no trailing commas, sorted imports, and ordered Tailwind classes. Format only changed files.
- Comment only what the code cannot say (a non-obvious reason, a gotcha, a security constraint) and keep comments to a minimum, only add a comment when its absolutely necessary. Don't restate what the code does. Also do not add comments for any changes, unless it adheres to the above rule.
- Never nest ternaries (ESLint enforces `no-nested-ternary`). Use `if`/`else`, an early-returning helper, or a lookup object instead.
- Use braces on `if`/`else` blocks. Skip them only for a short single-statement guard such as `if (!user) return;`.

## Newsroom and rich text

- Posts and banners live in `src/lib/server/db/schema/content.schema.ts` and are managed under `admin-dashboard/posts` and `admin-dashboard/banners`, gated by the `content: ["manage"]` permission. A published post keeps its live columns while edits autosave to `draft`; every publish writes a `post_revision`.
- The editor is Edra, vendored in `src/lib/components/edra/` (Tiptap v3). We own that code: edit it directly. `getContentExtensions()` is the server-safe schema and must stay free of `.svelte` imports; node names and attributes must match the editor's.
- Store editor JSON and render it on the server with `renderContent` in `src/lib/server/rich-text.ts`. Call `assertValidContent` before every save; it checks the schema and allows only safe links and embed hosts. Never render user content with the editor on public pages.
- Show users with `UserChip` (`src/lib/components/misc/`) and `getPublicProfiles` (`src/lib/server/public-profile.ts`): the primary Minecraft account, with the Discord profile on hover or tap. Keep private fields out of `PublicProfile`.
- Live data uses `query.live` with `watch()` from `src/lib/server/live.ts`; call `publish()` after changing posts or banners so open pages update.

## Generated code and database changes

- Do not manually edit Orval-generated API clients or schemas in `src/lib/shared/api/`. Change `orval.config.ts`, custom mutators, or the upstream API definition, then regenerate the relevant target.
- Run `pnpm exec orval --project <target>` for `skycrypt`, `skycryptZod`, or `patreon`. SkyCrypt targets read `http://localhost:8080/openapi.json`; Patreon reads its configured upstream spec. Required services must be available.
- Edit database schemas in `src/lib/server/db/schema/`, then run `pnpm db:generate` and review the SQL and metadata in `drizzle/`. Do not rewrite applied migrations.
- `pnpm auth:schema` regenerates the Better Auth schema from `src/lib/server/auth.ts`. Review the generated changes and generate any required database migration separately.
- `pnpm db:push` directly changes the configured database; use it only for local schema work. Commit migrations for schema changes. Drizzle CLI commands require `DATABASE_URL` in the process environment.

## Commands and verification

| Command                                        | Purpose                                                           |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| `pnpm dev`                                     | Start Vite at `http://localhost:5173`                             |
| `pnpm check`                                   | Synchronize SvelteKit types and run Svelte/TypeScript diagnostics |
| `pnpm lint`                                    | Check formatting, run ESLint, and run `pnpm check`                |
| `pnpm exec oxfmt --write <files>`              | Format selected files                                             |
| `pnpm format`                                  | Format the repository                                             |
| `pnpm test`                                    | Run both Vitest projects once                                     |
| `pnpm exec vitest run --project server <file>` | Run a focused Node test                                           |
| `pnpm exec vitest run --project client <file>` | Run a focused browser/component test                              |
| `pnpm test:coverage`                           | Run Vitest with V8 coverage                                       |
| `pnpm test:e2e`                                | Run Playwright tests; starts or reuses the local dev server       |
| `pnpm check:pages [baseUrl] [paths...]`        | Load pages in Chromium; fail on console, CSP or HTTP errors       |
| `pnpm build`                                   | Create the production build                                       |
| `pnpm preview`                                 | Serve the build locally at `http://localhost:4173`                |
| `pnpm runbuild`                                | Start the built Node server                                       |

- Add regression tests beside the code when behavior changes. Use `*.spec.ts` for Node tests and `*.svelte.spec.ts` for browser/component tests. Reuse helpers from `src/test-utils/`.
- Only write tests that would catch a real bug: logic, parsing, edge cases, security checks, persistence and migrations, and user flows that broke before. Don't test that something renders, that a prop or class is applied, that a constant or lookup table has its current values, or how a library behaves. A test that has to change whenever the UI changes on purpose, without ever catching a regression, costs more than it saves. Delete such tests when you find them.
- Vitest has `server` and `client` projects in `vite.config.ts`. The client project uses headless Chromium and requires `pnpm exec playwright install chromium`. Tests must make assertions; `expect.requireAssertions` is enabled.
- Run `pnpm lint`, relevant tests, and `pnpm build` for code changes before submitting. For documentation-only changes, check formatting and the accuracy of referenced paths and commands.
- Use the player `tiltedhoney` or `Refraction` when checking profile pages (in the browser); these profiles have populated data.
- After changing UI, routes, CSP, headers or third-party scripts, run `pnpm check:pages` against the running dev server (add paths for the pages you touched) and fix what it reports before calling the work done. Cloudflare blocks headless browsers on the public sites, so check those in the browser preview instead.
- Gather evidence yourself instead of asking the user to paste it: CI logs with `gh run view <id> --log-failed`, production logs and containers through the Dokploy MCP, errors and traces through the HyperDX (clickstack) MCP, and browser console output through the preview tools. Use the `gh` CLI for GitHub; the GitHub MCP may be signed in to a different account.
- For dependency upgrades, follow the `upgrade-deps` skill in `.github/skills/`.
- End-to-end tests run locally with the backend and its required API credentials; they are currently disabled in CI. A production build can also require backend access for prerendered data.
- Report which checks you ran, their results, and anything you could not run. Never report a skipped check as passing.
- Claude Code hooks in `.claude/settings.json` enforce part of this: before a turn ends, `pnpm lint` runs on uncommitted changes and changes to UI, routes or headers prompt for `pnpm check:pages`. Every `git add`, `git commit` and `git push` needs the user's confirmation.

## Commits, pull requests, and releases

- Use Conventional Commits, for example `fix(theme): preserve contrast`. The commit-message hook runs commitlint.
- Before committing or pushing, ask whether the change goes directly on `dev` or on a new branch. The answer depends on the change, so never choose on your own.
- Never stage changes (`git add`, `git mv`, `git rm`) unless asked. The user stages after reviewing; rename or delete files with plain `mv`/`rm`.
- Follow `.github/PULL_REQUEST_TEMPLATE.md`: explain the problem and resulting behavior, link relevant issues, list verification, and include before/after screenshots for visible UI changes. Note migration or environment requirements.
- Add a changeset with `pnpm changeset` when the change belongs in the release changelog. Documentation-only agent guidance does not need one.
- Changesets target `dev`. Automation creates beta releases on `dev` and stable releases on `prod`. Follow `CONTRIBUTING.md` for promotion and changeset cleanup. Run release scripts only for an explicit release task.
- Preserve applicable license notices. New contributions default to AGPLv3; brand assets listed in `NOTICE` are proprietary (`LICENSES/LicenseRef-SkyCrypt-Brand.txt`). `NOTICE` is the authoritative list; mirror changes in `static/BRAND_ASSETS_LICENSE`, `REUSE.toml` and the README list.
