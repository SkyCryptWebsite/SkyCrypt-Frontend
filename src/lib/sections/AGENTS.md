# SRC/LIB/SECTIONS

## OVERVIEW

Domain-specific profile sections (Stats, Skills, Dungeons) lazy-loaded by main layout.

## STRUCTURE

```
sections/
├── Sections.svelte    # Orchestrator (lazy-loads components)
├── constants.ts       # Section registry & ordering
├── types.ts           # SectionName type definitions
└── stats/
    ├── [Section].svelte   # Top-level (e.g., SkillsSection.svelte)
    └── [category]/        # Sub-components (e.g., skills/mining.svelte)
```

## WHERE TO LOOK

| Task             | Location                    | Notes                                           |
| ---------------- | --------------------------- | ----------------------------------------------- |
| Register section | `types.ts` + `constants.ts` | Add to `SectionName` union and `sections` array |
| Map component    | `Sections.svelte`           | Add dynamic import to `COMPONENTS`              |
| Fetch data       | `stats/[Section].svelte`    | API hook, pass to Context                       |
| Implement UI     | `stats/[Section]/`          | Consume context, render components              |

## CONVENTIONS

### Registration Trinity

Adding a section requires THREE files:

1. `types.ts` - Add to `SectionName` union
2. `constants.ts` - Add to `sections` array
3. `Sections.svelte` - Add dynamic import

### Provider-Consumer Architecture

Sections fetch data and provide via Context-as-Store. No prop drilling.

```svelte
<!-- Parent: Fetch + Set Context -->
<script>
  const ctx = new SkillsContext();
  setSkillsContext(ctx);
  $effect(() => { ctx.skills = data; });
</script>

<!-- Child: Consume Context -->
<script>
  const ctx = getSkillsContext();
  let level = $derived(ctx.skills.mining.level);
</script>
```

### Naming

- Top-level: PascalCase (`Gear.svelte`, `CrimsonIsle.svelte`)
- Sub-features: lowercase (`skills/mining.svelte`, `misc/potions.svelte`)
