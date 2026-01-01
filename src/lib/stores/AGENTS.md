# SRC/LIB/STORES

## OVERVIEW

Global state: volatile UI (`writable`) and persistent preferences (`svelte-persisted-store`).

## WHERE TO LOOK

| File             | Purpose                              | Persistence |
| ---------------- | ------------------------------------ | ----------- |
| `internal.ts`    | Volatile UI (modals, tooltips, tabs) | Session     |
| `preferences.ts` | User config + schema validation      | Local       |
| `favorites.ts`   | Saved profiles + migration           | Local       |
| `themes.ts`      | Theme selection                      | Local       |
| `searches.ts`    | Recent search history                | Local       |

## CONVENTIONS

### Persistence Pattern

```typescript
export const storeName = persisted<Type>("localStorageKey", defaultValue);
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
- Standard Svelte `writable` stores
- Examples: `settingsOpen`, `tooltipAnchor`, `api_token`

### Typing

- STRICTLY type all stores: `persisted<SectionID[]>` not `persisted<any>`
- Import types from `$lib/sections/types` or `$types`
