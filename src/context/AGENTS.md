# SRC/CONTEXT

## OVERVIEW

Reactive state management via Svelte 5 runes. All app contexts initialized in root `+layout.svelte`.

## STRUCTURE

```
context/
├── createContext.svelte.ts    # Core: ProfileContext, SkillsContext, MiscContext, PacksContext, etc.
├── preferences.svelte.ts      # PersistedState: section order, performance, glint, keybinds
├── themes.svelte.ts           # PersistedState: theme ID + changeTheme (manipulates document.dataset)
├── favorites.svelte.ts        # PersistedState: {uuid, ign, displayName?}[]
├── searches.svelte.ts         # PersistedState: recent searches
├── packs.svelte.ts            # PersistedState: disabled resource packs
├── wiki.svelte.ts             # PersistedState: wiki order data
├── internal.svelte.ts         # Volatile: tabValue, showItem, itemContent, settingsOpen, openCommand
├── utils.ts                   # loadOldStorageKey migration helper
└── index.ts                   # Barrel export (all get/init/set functions)
```

## PATTERNS

### createContext Pattern

```typescript
// createContext<T>() returns [getX, setX] from Svelte context API
// Classes use $state(null) for private reactive fields
const [getProfileContext, setProfileContext] = createContext<ProfileContext>();

// Provider (layout/section level):
const ctx = new ProfileContext();
setProfileContext(ctx);
$effect.pre(() => {
  ctx.current = data;
});

// Consumer (any descendant):
const profile = getProfileContext();
let name = $derived(profile.current?.name);
```

### Volatile vs Persisted

| Type          | Storage      | Class                               | Init Function               |
| ------------- | ------------ | ----------------------------------- | --------------------------- |
| **Volatile**  | Memory only  | `$state()` in createContext classes | `setXContext()`             |
| **Persisted** | localStorage | `runed` PersistedState              | `initX()` in +layout.svelte |

### All Contexts

| Context        | Type      | Data                                                                              |
| -------------- | --------- | --------------------------------------------------------------------------------- |
| ProfileContext | volatile  | ModelsStatsOutput (current profile)                                               |
| SkillsContext  | volatile  | ModelsSkillsOutput                                                                |
| MiscContext    | volatile  | ModelsMiscOutput                                                                  |
| PacksContext   | volatile  | ModelsResourcePackConfig[]                                                        |
| MobileContext  | volatile  | IsMobile (MediaQuery)                                                             |
| HoverContext   | volatile  | IsHover (MediaQuery)                                                              |
| InternalState  | volatile  | UI state (tabs, modals, settings)                                                 |
| Preferences    | persisted | sectionOrder, performanceMode, keybind, showGlint, rainbowEnchantments, mctooltip |
| Theme          | persisted | theme ID string                                                                   |
| Favorites      | persisted | player favorites list                                                             |
| RecentSearches | persisted | search history                                                                    |
| DisabledPacks  | persisted | disabled resource pack IDs                                                        |
| WikiOrder      | persisted | wiki ordering data                                                                |

## CONVENTIONS

- Import via `$ctx` alias: `import { getProfileContext } from '$ctx'`
- Volatile contexts: `get/set` pairs from `createContext()`
- Persisted contexts: `init` functions called once in `+layout.svelte`
- NEVER use `svelte-persisted-store` — use `runed` PersistedState
- Migration from old keys: use `loadOldStorageKey()` from `utils.ts`

## ANTI-PATTERNS

| Forbidden                           | Do Instead                   |
| ----------------------------------- | ---------------------------- |
| `svelte-persisted-store`            | `runed` PersistedState       |
| Direct localStorage access          | PersistedState wrapper       |
| Context init outside +layout.svelte | Only root layout initializes |
| Prop drilling through layouts       | Use context get/set pattern  |
