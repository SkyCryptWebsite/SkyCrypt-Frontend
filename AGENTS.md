You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

# SKYCRYPT-FRONTEND

**Generated:** 2026-02-14 | **Commit:** 4e935d86 | **Branch:** dev

## OVERVIEW

Hypixel SkyBlock profile viewer. Svelte 5 + SvelteKit 2 + Tailwind v4 + Orval API. Adapter-node deployment via Docker.

## STRUCTURE

```
src/
├── lib/
│   ├── components/    # Atomic UI (Svelte 5 runes, snippets)
│   ├── layouts/       # Structural wrappers (Main, PlayerProfile, Stats, Skills, Items)
│   ├── sections/      # Domain logic (Provider-Consumer pattern, lazy-loaded)
│   ├── shared/        # API client, constants, mc-text parser, utils
│   ├── hooks/         # Svelte 5 rune hooks (.svelte.ts): IsMobile, IsHover
│   └── types/         # TypeScript definitions (barrel: index.ts)
├── context/           # Reactive state (createContext pattern, PersistedState)
├── routes/            # SvelteKit routing
│   ├── stats/[ign]/[[profile]]/  # Main profile view
│   └── api/tunnel/               # Sentry envelope proxy
├── plugins/           # Tailwind plugin (theme CSS var injection)
└── tests/             # Vitest browser tests
static/
├── img/               # Sea creatures, themes, textures
└── fonts/             # Icomoon icons, Montserrat
```

## WHERE TO LOOK

| Task              | Location                    | Notes                                          |
| ----------------- | --------------------------- | ---------------------------------------------- |
| Add component     | `src/lib/components/`       | Svelte 5 runes, snippets > slots               |
| Add stat section  | `src/lib/sections/stats/`   | Provider-Consumer + Registration Trinity       |
| Modify API calls  | `src/lib/shared/api/`       | Orval-generated — run `pnpm orval`, don't edit |
| Add context/state | `src/context/`              | createContext pattern, runed PersistedState    |
| Minecraft text    | `src/lib/shared/mc-text/`   | § code → HTML parser                           |
| Constants         | `src/lib/shared/constants/` | Game data, themes, rarities, stats             |
| Search schemas    | `src/routes/schema.ts`      | zod schemas for search validation              |
| Theming           | `src/plugins/themes.ts`     | Tailwind plugin injecting `:root[data-theme]`  |
| Page layout       | `src/lib/layouts/stats/`    | Main.svelte = composition root                 |
| Context init      | `src/routes/+layout.svelte` | Single point for ALL context initialization    |

## CONVENTIONS

### Svelte 5 Runes ONLY

```svelte
<!-- CORRECT -->
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
  let { data } = $props();
</script>

<!-- FORBIDDEN — Svelte 4 syntax -->
<script>
  export let data;
  $: doubled = count * 2;
</script>
```

### Path Aliases

```typescript
import { ... } from '$lib';         // src/lib
import { ... } from '$ctx';         // src/context
import { ... } from '$types';       // src/lib/types
import { ... } from '$routes';      // src/routes
import { ... } from '$constants';   // src/lib/server/constants
import { ... } from '$db';          // src/db
```

### Three-Tier UI Architecture

```
Components (atomic, presentational) → Layouts (structural, composition) → Sections (domain, data)
```

### Context-as-Store Pattern

```typescript
// Volatile: createContext() from src/context/createContext.svelte.ts
// Returns [getX, setX] pairs. Classes use $state() internally.
// Persisted: runed PersistedState for localStorage
// Init at +layout.svelte, consume via getX() anywhere below
```

### Snippets > Slots

All content injection uses Svelte 5 snippets. No `<slot>` usage.

```svelte
{#snippet content()}
  <span>Custom</span>
{/snippet}
<Container {content} />
```

### Styling

- Tailwind v4 primary, `cn()` helper (clsx + twMerge) from `$lib/shared/utils.ts`
- MC color CSS vars: `--§a` (green), `--§b` (aqua), `--§c` (red), etc. in `app.css`
- Theme plugin: `src/plugins/themes.ts` → `:root[data-theme="..."]` CSS vars

### Formatting

- Prettier: double quotes, no trailing comma, `printWidth: 999999`, `bracketSameLine: true`
- `svelteStrictMode: true` — enforces Svelte best practices
- Conventional commits enforced via commitlint + simple-git-hooks

## ANTI-PATTERNS

| Forbidden                            | Reason                                             |
| ------------------------------------ | -------------------------------------------------- |
| Edit `orval-generated*.ts`           | Auto-generated. Run `pnpm orval` instead           |
| Svelte 4 syntax (`export let`, `$:`) | Project uses Svelte 5 runes exclusively            |
| `<slot>` for content injection       | Use snippets (`{#snippet}` + `{@render}`)          |
| npm/yarn/bun/deno                    | pnpm only                                          |
| `@ts-ignore` / `as any`              | Fix types properly                                 |
| Direct Axios/fetch calls             | Use Orval-generated API functions                  |
| `svelte-persisted-store`             | Use `runed` PersistedState (despite being in deps) |

## KNOWN ISSUES

- Paneforge library disabled — tracking svecosystem/paneforge#89
- Svelte preloading disabled — upstream svelte#17304
- `@ts-expect-error` in +layout.svelte for SvelteSeo openGraph types
- Potions/Races sections disabled — awaiting backend ModelsMiscOutput update
- Essence Shop — TODO in MiscSection.svelte

## COMMANDS

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm check        # Svelte + TS checks
pnpm lint         # ESLint
pnpm test         # Vitest (browser)
pnpm test:unit    # Vitest --run
pnpm test:ui      # Vitest --ui
pnpm orval        # Regenerate API types from backend
pnpm changeset    # Create changeset for versioning
```

## BUILD & CI

- **Node 24**, **pnpm 10**, **rolldown-vite** (Vite overridden via pnpm overrides)
- GitHub Actions: ci.yml (PRs) → checks + test + build; website.yml (push) → checks + CodeQL + build + Docker
- Docker: multi-stage node:22-alpine, adapter-node, port 3000. ARGs: PUBLIC_COMMIT_HASH, PUBLIC_SERVER_API_URL
- Sentry: client init in hooks.client.ts, server in instrumentation.server.ts, tunnel at /api/tunnel
- Changesets: beta (dev branch) + stable (prod branch), @svitejs/changesets-changelog-github-compact
- simple-git-hooks + commitlint for conventional commit enforcement
- Build needs `.env` (CI copies `.env.example`); PUBLIC\_\* vars exposed to client

## ROUTING

```
/                                → Home (search, contributors)
/stats/[ign]/[[profile]]         → Profile viewer (main app)
/api/tunnel                      → POST: Sentry envelope proxy
```

- Single root layout: +layout.svelte initializes ALL contexts
- Stats page: server load (embed data) + client-side getProfileStats()
- Error pages: root +error.svelte + stats-specific +error.svelte
- No +layout.server.ts, +layout.ts, or +page.ts files — keep routing simple

## NOTES

- Vitest dual-env: `*.svelte.spec.ts` (browser/playwright), `*.spec.ts` (node)
- Tailwind v4 with custom theme plugin (src/plugins/themes.ts) and nice-colors-dark
- Experimental SvelteKit features: remoteFunctions, tracing, instrumentation
- CSRF trusted origins: cupcake.shiiyu.moe, sky.shiiyu.moe
- TSConfig: strict, bundler moduleResolution, verbatimModuleSyntax
- Barrel exports at: components/\*, context, types, shared/constants/themes, shared/mc-text
