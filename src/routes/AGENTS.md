# SRC/ROUTES

## OVERVIEW

SvelteKit file-based routing. Three routes: home, stats profile viewer, Sentry tunnel.

## STRUCTURE

```
routes/
├── +layout.svelte             # Root layout: ALL context initialization
├── +page.svelte               # Home page (search, contributors)
├── +error.svelte              # Root error page
├── schema.ts                  # Valibot search validation schemas
├── enums.ts                   # Route-related enums
├── contributors.remote.ts     # Contributor data fetching
├── stats/
│   └── [ign]/
│       └── [[profile]]/
│           ├── +page.server.ts  # Server load: getEmbedData()
│           ├── +page.svelte     # Client: getProfileStats() → Main layout
│           └── +error.svelte    # Stats-specific error page
└── api/
    └── tunnel/
        └── +server.ts           # POST: Sentry envelope proxy
```

## DATA FLOW

```
+layout.svelte        → Inits ALL persisted contexts (preferences, theme, favorites, packs, searches, internal)
                      → Sets volatile contexts (mobile, hover, packs)
                      → Renders Header, CommandPalette, Toaster, Drawer

+page.server.ts       → getEmbedData() for OpenGraph meta (server-only)
+page.svelte (stats)  → getProfileStats() (client/server via remote wrapper) → Main.svelte
```

## CONVENTIONS

- No `+layout.server.ts`, `+layout.ts`, or `+page.ts` files — keep it simple
- Root `+layout.svelte` is the **single point** for context initialization
- Stats page uses server load only for embed/SEO data; profile data loaded client-side
- `@ts-expect-error` on SvelteSeo openGraph.image type (known issue)
- Search validation via Valibot schemas in `schema.ts`
