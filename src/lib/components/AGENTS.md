# SRC/LIB/COMPONENTS

## OVERVIEW

Atomic Svelte 5 UI components for SkyBlock data visualization. Presentational only — no data fetching.

## STRUCTURE

```
components/
├── header/              # Profile header bar
│   ├── Info.svelte      # Player info display
│   ├── Settings.svelte  # Settings orchestrator (Dialog desktop, Drawer mobile)
│   └── settings/        # Sub-tabs: Packs, Themes, Order, Misc
│       ├── index.ts     # Barrel export
│       └── types.ts     # SettingsTab enum
├── item/                # Item rendering sub-components
│   ├── item-content.svelte  # Lore/tooltip content
│   └── item-lore.svelte     # MC text formatted lore
├── ui/                  # Primitive UI wrappers (ScrollArea, etc.)
├── Item.svelte          # Core item renderer (NBT, textures, glint, rarity)
├── ContainedItem.svelte # Inventory grid wrapper
├── Navbar.svelte        # Section navigation (scroll-to-hash)
├── Stat.svelte          # Single stat display
├── Skillbar.svelte      # Skill progress bar
├── Chip.svelte          # Metadata tags (Co-op, Bingo, Ironman)
├── Notice.svelte        # Alerts/warnings
├── SEO.svelte           # SvelteSeo wrapper
├── Skin3D.svelte        # 3D player skin renderer
├── PerformanceMode.svelte  # Low-end device detection
└── Section.svelte       # Reusable section container
```

## WHERE TO LOOK

| Task          | Location               | Notes                                    |
| ------------- | ---------------------- | ---------------------------------------- |
| Render items  | `Item.svelte`          | Core; handles rarity, glint, overlays    |
| Item lore     | `item/`                | MC text parsing in tooltips              |
| Header info   | `header/Info.svelte`   | Player stats at top of profile           |
| Settings tabs | `header/settings/`     | Packs, Themes, Order, Misc sub-tabs      |
| Grid layouts  | `ContainedItem.svelte` | Wrapper for inventory grids              |
| Notices       | `Notice.svelte`        | API errors, alerts, beta warnings        |
| Section nav   | `Navbar.svelte`        | Scroll-to-hash + active section tracking |

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
- `Item.svelte`: source of truth for SkyBlock item visualization
- Data via `$props()` or context getters — never direct API calls
