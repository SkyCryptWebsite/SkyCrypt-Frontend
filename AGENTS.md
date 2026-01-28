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

**Generated:** 2026-01-01 | **Commit:** 17772675 | **Branch:** dev

## OVERVIEW

Hypixel SkyBlock profile viewer. Svelte 5 + SvelteKit 2 + Tailwind v4 + Orval API.

## STRUCTURE

```
src/
├── lib/
│   ├── components/    # Atomic UI (Svelte 5 runes, snippets)
│   ├── layouts/       # Structural wrappers for sections
│   ├── sections/      # Domain logic (stats, skills, misc)
│   ├── shared/        # API, constants, mc-text parser, utils
│   ├── stores/        # Persisted + volatile state
│   ├── hooks/         # Svelte 5 rune hooks (.svelte.ts)
│   └── types/         # TypeScript definitions
├── routes/            # SvelteKit routing
│   ├── stats/[ign]/[[profile]]/  # Main profile view
│   └── og/[ign]/[[profile]]/     # OG image generation
├── context/           # Context classes (createContext pattern)
└── tests/             # Vitest browser tests
static/
├── img/               # Sea creatures, themes, textures
└── fonts/             # Icomoon icons, Montserrat
```

## WHERE TO LOOK

| Task             | Location                    | Notes                                       |
| ---------------- | --------------------------- | ------------------------------------------- |
| Add component    | `src/lib/components/`       | Use Svelte 5 runes, check existing patterns |
| Add stat section | `src/lib/sections/stats/`   | Follow Provider-Consumer pattern            |
| Modify API calls | `src/lib/shared/api/`       | Orval-generated - regenerate, don't edit    |
| Add store        | `src/lib/stores/`           | Use svelte-persisted-store for persistence  |
| Minecraft text   | `src/lib/shared/mc-text/`   | Parser for Minecraft formatting codes       |
| Constants        | `src/lib/shared/constants/` | Colors, items, sea creatures                |
| Route params     | `src/routes/schema.ts`      | Valibot schemas for route validation        |

## CONVENTIONS

### Svelte 5 Runes ONLY

```svelte
// CORRECT let count = $state(0); let doubled = $derived(count * 2); let {data} = $props(); // FORBIDDEN - Svelte 4 syntax export let data; $: doubled = count * 2;
```

### Path Aliases

```typescript
import { ... } from '$params';      // Route params
import { ... } from '$types';       // Type definitions
import { ... } from '$ctx';         // Context classes
import { ... } from '$routes';      // Route helpers
import { ... } from '$constants';   // Constants
import { ... } from '$db';          // Database
```

### Three-Tier UI Architecture

```
Components (atomic) → Layouts (structural) → Sections (domain)
```

### Context-as-Store Pattern

```typescript
// src/context/createContext.svelte.ts
// Use for shared state: SkillsContext, MiscContext, HoverContext, ProfileContext
```

### Minecraft Color Variables

```css
/* Use CSS variables for MC formatting codes */
--§a  /* green */
--§b  /* aqua */
--§c  /* red */
/* etc. */
```

## ANTI-PATTERNS

| Forbidden                            | Reason                                   |
| ------------------------------------ | ---------------------------------------- |
| Edit `orval-generated*.ts`           | Auto-generated. Run `pnpm orval` instead |
| Svelte 4 syntax (`export let`, `$:`) | Project uses Svelte 5 runes exclusively  |
| npm/yarn/bun/deno                    | pnpm only                                |
| `@ts-ignore` / `as any`              | Fix types properly                       |

## KNOWN ISSUES

- Paneforge library has blocking issues (TODO in Main.svelte)
- Svelte preloading disabled due to issue #17304
- `@ts-expect-error` in preferences.ts for SectionName type mismatch

## COMMANDS

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm check        # Svelte + TS checks
pnpm lint         # ESLint
pnpm test         # Vitest (node)
pnpm test:ui      # Vitest (browser UI)
pnpm orval        # Regenerate API types
```

## BUILD & CI

- **Node 24**, **pnpm 10**
- Rolldown-Vite for bundling
- GitHub Actions: checks → test → build → Docker (ghcr.io)
- Sentry integration for error tracking
- changelogen for releases

## NOTES

- Vitest dual-env: `*.svelte.spec.ts` (browser), `*.spec.ts` (node)
- Tailwind v4 with nice-colors-dark theme
- OG images generated via `/og/[ign]/[[profile]]` route
