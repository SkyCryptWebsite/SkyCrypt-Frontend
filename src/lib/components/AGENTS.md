# SRC/LIB/COMPONENTS

## OVERVIEW

Atomic Svelte 5 UI components for SkyBlock data visualization. Presentational only — no data fetching.

## STRUCTURE

```
components/
├── header/              # Profile header bar
│   ├── Header.svelte    # Top-level header wrapper
│   ├── Info.svelte      # Player info display
│   ├── types.ts         # Header type definitions
│   └── settings/        # Settings sub-tabs
│       ├── Packs.svelte, Themes.svelte, Order.svelte, Misc.svelte
│       ├── SettingToggleRow.svelte
│       ├── index.ts     # Barrel export
│       └── types.ts     # SettingsTab enum
├── item/                # Item rendering (7 files)
│   ├── Item.svelte              # Core renderer (NBT, textures, glint, rarity)
│   ├── item-content.svelte      # Lore/tooltip content (164 lines)
│   ├── ContainedItem.svelte     # Inventory grid cell wrapper
│   ├── ContainedItemsGrid.svelte
│   ├── InventoryGrid.svelte
│   ├── InventorySearch.svelte
│   └── EmptyEquipment.svelte
├── misc/                # Diverse UI (15 files)
│   ├── CommandPalette.svelte    # Ctrl+K command palette
│   ├── Navbar.svelte            # Section navigation (scroll-to-hash)
│   ├── SEO.svelte, Skin3D.svelte, Wardrobe.svelte
│   ├── Chip.svelte, CtaCard.svelte, PerformanceMode.svelte
│   ├── ContributorCard.svelte, ContributorCardSkeleton.svelte
│   ├── ScrollItems.svelte, command-utils.ts
│   └── index.ts
├── notices/             # Alerts (4 files)
│   ├── Notice.svelte, APINotice.svelte, BetaNotice.svelte
│   └── index.ts
├── sections/            # Section containers (5 files)
│   ├── Section.svelte           # Reusable section container
│   ├── SectionBoundary.svelte   # Async boundary (snippet pending/failed)
│   ├── SectionTitle.svelte, SectionSubtitle.svelte
│   └── index.ts
├── stats/               # Stat display (8 files)
│   ├── Stat.svelte, AdditionStat.svelte, Bonus.svelte
│   ├── Skillbar.svelte, NetworthCard.svelte
│   ├── DungeonCataCard.svelte, GardenPlotGrid.svelte
│   └── index.ts
└── ScrollAreaPrimitive.svelte   # Viewport children render
```

## WHERE TO LOOK

| Task             | Location              | Notes                                    |
| ---------------- | --------------------- | ---------------------------------------- |
| Render items     | `item/Item.svelte`    | Core; handles rarity, glint, overlays    |
| Item lore        | `item/item-content`   | MC text parsing in tooltips              |
| Inventory grids  | `item/InventoryGrid`  | Grid + search + contained items          |
| Header info      | `header/Info.svelte`  | Player stats at top of profile           |
| Settings tabs    | `header/settings/`    | Packs, Themes, Order, Misc sub-tabs      |
| Section wrappers | `sections/`           | Section, SectionBoundary (async)         |
| Notices          | `notices/`            | API errors, alerts, beta warnings        |
| Section nav      | `misc/Navbar.svelte`  | Scroll-to-hash + active section tracking |
| Command palette  | `misc/CommandPalette` | Ctrl+K search + settings commands        |
| Stat display     | `stats/`              | Stat, Skillbar, NetworthCard             |

## CONVENTIONS

### Snippets > Slots

```svelte
<!-- Content injection via snippets, never <slot> -->
{#snippet content()}
  <span>Custom</span>
{/snippet}
<Container {content} />

<!-- Children pattern -->
{@render children?.()}
```

### Tooltips & Hover

Use `HoverContext` from `$ctx` — never local hover state:

- `getHoverContext()` to consume
- `setHover(data)` on mouseenter, `setHover(null)` on mouseleave

### Component Naming

- Top-level: PascalCase (`Item.svelte`, `Navbar.svelte`)
- Sub-components in folders: kebab-case (`item/item-content.svelte`)

### Atomic Philosophy

- Components: purely presentational ("how to show")
- Sections: domain logic ("what to show")
- `item/Item.svelte`: source of truth for SkyBlock item visualization
- Data via `$props()` or context getters — never direct API calls
- Barrel exports in every subdirectory (`index.ts`)
