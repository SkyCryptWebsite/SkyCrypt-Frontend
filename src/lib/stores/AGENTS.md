# SRC/LIB/STORES

## OVERVIEW

Global state: volatile UI (`writable`) and persistent preferences (`PersistedState`).

## WHERE TO LOOK

| File             | Purpose                              | Persistence |
| ---------------- | ------------------------------------ | ----------- |
| `internal.ts`    | Volatile UI (modals, tooltips, tabs) | None        |
| `preferences.ts` | User config + schema validation      | Local       |
| `favorites.ts`   | Saved profiles + migration           | Local       |
| `themes.ts`      | Theme selection                      | Local       |
| `searches.ts`    | Recent search history                | Local       |

## CONVENTIONS

### Persistence Pattern

```typescript
export const storeName = new PersistedState<Type>("localStorageKey", defaultValue);
// Key MUST match store name
```

### Self-Healing Migration

Handle schema changes gracefully:

```typescript
if (browser) {
  store.subscribe((val) => {
    if (isInvalid(val)) {
      console.warn("Schema mismatch! Resetting.");
      localStorage.removeItem("storeKey");
      window.location.reload();
    }
  });
}
```

### Volatile State

- Use `internal.ts` for shared state that resets on reload
- Standard Svelte `$` runes
- Examples: `settingsOpen`, `tooltipAnchor`, `api_token`

### Typing

- STRICTLY type all stores: `new PersistedState<SectionID[]>` not `new PersistedState<any>`
- Import types from `$lib/sections/types` or `$types`
