# SRC/LIB/LAYOUTS

## OVERVIEW

Structural composition wrappers for the stats profile view. Middle tier between atomic components and domain sections.

## STRUCTURE

```
layouts/
└── stats/
    ├── Main.svelte            # Composition root — orchestrates all below
    ├── PlayerProfile.svelte   # Player info, avatar, profile selector
    ├── Skills.svelte          # Skills grid layout
    ├── Stats.svelte           # Stats display layout
    ├── Items.svelte           # Equipment/inventory layout
    └── AdditionalStats.svelte # Extra stats section
```

## COMPOSITION FLOW

```
Main.svelte
├── Creates ProfileContext from API data
├── PlayerProfile (header, avatar, profile switcher)
├── Skills (skill bars grid)
├── Stats (stat cards)
├── Items (equipment display)
├── AdditionalStats
└── Sections (lazy-loaded domain sections via Sections.svelte)
```

## CONVENTIONS

- Layouts receive data from parent (Main.svelte) or context — never fetch directly
- Main.svelte is the **only** layout that creates contexts (ProfileContext)
- Layouts compose components — they don't contain domain logic
- Paneforge panels disabled here (commented out in Main.svelte) — tracking svecosystem/paneforge#89
