# SRC/LIB/SHARED

## OVERVIEW

Shared utilities, constants, API client, and Minecraft text parser.

## STRUCTURE

```
shared/
├── api/
│   ├── orval-generated.ts      # DO NOT EDIT — API functions & types
│   ├── orval-generated-zod.ts  # DO NOT EDIT — Zod validators
│   ├── mutator/
│   │   └── custom-instance.ts  # customFetch: X-API-Token, URL resolution
│   └── skycrypt-api.remote.ts  # Server-side wrappers (getProfileStats, etc.)
├── constants/
│   ├── themes/                 # 10 theme JSON files (default, light, skylea, etc.)
│   │   └── index.ts            # Theme list barrel export
│   ├── enchantments.ts         # MAX_ENCHANTS Set
│   ├── rarities.ts             # RARITIES array, RARITY_COLORS record
│   ├── stats.ts                # STATS_DATA, STAT_ALIASES (523 lines)
│   └── packs.ts                # ResourcePack types
├── mc-text/
│   ├── parser/
│   │   ├── mcTextToHTML.ts     # § codes → HTML spans with CSS classes
│   │   ├── styleLibrary.ts    # Color/format code mappings
│   │   └── utils.ts            # BASE_FORMATTING_CODE_REGEX
│   ├── obfuscated/             # §k (obfuscated text) handling
│   └── index.ts                # Barrel export
├── embedGenerator.ts           # OG meta: getLongDescription, getMetaTitle
├── helper.ts                   # formatNumber, renderLore, titleCase, getRarityClass, shouldShine
└── utils.ts                    # cn (twMerge+clsx), flyAndScale transition
```

## WHERE TO LOOK

| Task           | Location                         | Notes                            |
| -------------- | -------------------------------- | -------------------------------- |
| API functions  | `api/orval-generated.ts`         | **READ ONLY** — `pnpm orval`     |
| API instance   | `api/mutator/custom-instance.ts` | Token injection, URL resolution  |
| Server queries | `api/skycrypt-api.remote.ts`     | fetchSection pattern wrappers    |
| MC formatting  | `mc-text/parser/mcTextToHTML.ts` | `§a`, `§l` → HTML spans          |
| Themes         | `constants/themes/`              | JSON theme definitions           |
| Game data      | `constants/stats.ts`             | Stat IDs, aliases (largest file) |
| Helpers        | `helper.ts`                      | Number formatting, lore, rarity  |
| CSS utils      | `utils.ts`                       | `cn()` only                      |

## ANTI-PATTERNS

| Forbidden                  | Do Instead                         |
| -------------------------- | ---------------------------------- |
| Edit `orval-generated*.ts` | Run `pnpm orval`                   |
| Hardcode colors            | Use `constants/themes` or CSS vars |
| Complex logic in utils     | Move to `sections/` or `helper.ts` |
| Direct Axios/fetch calls   | Use Orval-generated API functions  |
| Edit Zod validators        | Run `pnpm orval` to regenerate     |
