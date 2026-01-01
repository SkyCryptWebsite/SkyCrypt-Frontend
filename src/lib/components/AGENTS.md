# SRC/LIB/COMPONENTS

## OVERVIEW

Reusable, atomic Svelte 5 UI components for Hypixel SkyBlock data visualization.

## STRUCTURE

```
components/
├── header/            # Profile header (stats, gamemode display)
├── item/              # Item rendering sub-components (lore, tooltip logic)
├── Item.svelte        # Core item renderer (NBT, textures, glint)
├── Navbar.svelte      # Global navigation
├── Notice.svelte      # Standard alerts/warnings
└── Chip.svelte        # Small metadata tags (e.g., 'Co-op', 'Bingo')
```

## WHERE TO LOOK

| Task         | Location               | Notes                                 |
| ------------ | ---------------------- | ------------------------------------- |
| Render items | `Item.svelte`          | Core; handles rarity, glint, overlays |
| Item lore    | `item/`                | MC text parsing in tooltips           |
| Header info  | `header/`              | User stats at top of profile          |
| Grid layouts | `ContainedItem.svelte` | Wrapper for inventory grids           |
| Notices      | `Notice.svelte`        | API errors, alerts, beta warnings     |

## CONVENTIONS

### Snippets > Slots

Use snippets for content injection:

```svelte
{#snippet content()}
  <span>Custom</span>
{/snippet}
<Container {content} />
```

### Tooltips & Hover

Use `HoverContext` from `$ctx` - never local hover state:

- `getHoverContext()` to consume
- `setHover(data)` on mouseenter, `setHover(null)` on mouseleave

### Atomic Philosophy

- Components: purely presentational ("how to show")
- Sections: logic ("what to show")
- `Item.svelte`: source of truth for SkyBlock item visualization
