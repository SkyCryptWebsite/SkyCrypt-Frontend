# SRC/LIB/SECTIONS

## OVERVIEW

Domain-specific profile sections lazy-loaded by Sections.svelte orchestrator. Each section fetches its own data and provides it via context.

## STRUCTURE

```
sections/
├── Sections.svelte    # Orchestrator — COMPONENTS map + dynamic import + Tabs
├── constants.ts       # Section registry array (ordering)
├── types.ts           # SectionName union type
└── stats/
    ├── Gear.svelte            # Equipment & wardrobe
    ├── Accessories.svelte     # Accessory bag
    ├── Pets.svelte            # Pet collection
    ├── Inventory.svelte       # Player inventory
    ├── Collections.svelte     # Item collections
    ├── Dungeons.svelte        # Catacombs data
    ├── Minions.svelte         # Minion collection
    ├── Bestiary.svelte        # Mob kills
    ├── CrimsonIsle.svelte     # Nether faction data
    ├── Rift.svelte            # Rift dimension
    ├── Slayer.svelte          # Slayer bosses
    ├── SkillsSection.svelte   # Skills (sets SkillsContext)
    ├── MiscSection.svelte     # Misc stats (sets MiscContext)
    └── [section]/             # Sub-components per section
        └── *.svelte           # e.g., skills/mining.svelte
```

## WHERE TO LOOK

| Task             | Location                    | Notes                                           |
| ---------------- | --------------------------- | ----------------------------------------------- |
| Register section | `types.ts` + `constants.ts` | Add to `SectionName` union and `sections` array |
| Map component    | `Sections.svelte`           | Add dynamic import to `COMPONENTS`              |
| Fetch data       | `stats/[Section].svelte`    | Call API, set domain context                    |
| Implement UI     | `stats/[section]/`          | Consume context, render components              |

## CONVENTIONS

### Registration Trinity

Adding a section requires THREE coordinated changes:

1. `types.ts` — Add to `SectionName` union
2. `constants.ts` — Add to `sections` array (controls tab order)
3. `Sections.svelte` — Add entry to `COMPONENTS` record (dynamic import)

### Provider-Consumer Architecture

Sections fetch data and provide via context. No prop drilling.

```svelte
<!-- Provider (top-level section): Fetch + Set Context -->
<script>
  const ctx = new SkillsContext();
  setSkillsContext(ctx);
  $effect.pre(() => { ctx.current = data; });
</script>

<!-- Consumer (sub-component): Read Context -->
<script>
  const ctx = getSkillsContext();
  let level = $derived(ctx.current.mining.level);
</script>
```

### Naming

- Top-level: PascalCase (`Gear.svelte`, `CrimsonIsle.svelte`)
- Sub-features: lowercase (`skills/mining.svelte`, `misc/potions.svelte`)

### Known Gaps

- `misc/potions.svelte`, `misc/races.svelte` — types awaiting backend ModelsMiscOutput update
- `MiscSection.svelte` — TODO for Essence Shop
