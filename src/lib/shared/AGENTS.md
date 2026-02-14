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
│   │   └── custom-instance.ts  # customFetch: X-API-Token, URL resolution, getRequestEvent().fetch
│   ├── skycrypt-api.remote.ts  # Server wrappers (getProfileStats, getEmbedData, searchUser, getPacks)
│   └── themes.remote.ts        # Resource pack/themes endpoints
├── constants/
│   ├── themes/                 # 11 theme JSON files + index.ts barrel
│   │   └── Schema: { id, name, author, schema, light?, enchanted_glint?, backgrounds?, colors? }
│   ├── enchantments.ts         # MAX_ENCHANTS Set
│   ├── rarities.ts             # RARITIES array, RARITY_COLORS record
│   ├── stats.ts                # STATS_DATA, STAT_ALIASES (largest file)
│   └── packs.ts                # ResourcePack types
├── mc-text/
│   ├── parser/
│   │   ├── mcTextToHTML.ts     # § codes → HTML spans with CSS vars (--§a, --§b, etc.)
│   │   ├── styleLibrary.ts     # Color/format code mappings
│   │   └── utils.ts            # BASE_FORMATTING_CODE_REGEX
│   ├── obfuscated/             # §k (obfuscated text) animation handling
│   └── index.ts                # Barrel export
├── embedGenerator.ts           # OG meta: getLongDescription, getMetaTitle
├── helper.ts                   # formatNumber, renderLore, titleCase, getRarityClass, shouldShine
└── utils.ts                    # cn (twMerge+clsx), flyAndScale transition
```

## WHERE TO LOOK

| Task            | Location                         | Notes                                        |
| --------------- | -------------------------------- | -------------------------------------------- |
| API functions   | `api/orval-generated.ts`         | **READ ONLY** — `pnpm orval`                 |
| API instance    | `api/mutator/custom-instance.ts` | Token injection, URL resolution              |
| Server queries  | `api/skycrypt-api.remote.ts`     | fetchSection pattern, central error handling |
| Theme endpoints | `api/themes.remote.ts`           | Resource pack & theme fetching               |
| MC formatting   | `mc-text/parser/mcTextToHTML.ts` | `§a`→green, `§9`+MAX_ENCHANTS→rainbow        |
| Themes          | `constants/themes/`              | JSON theme definitions (11 themes)           |
| Game data       | `constants/stats.ts`             | Stat IDs, aliases (largest file)             |
| Helpers         | `helper.ts`                      | Number formatting, lore, rarity              |
| CSS utils       | `utils.ts`                       | `cn()` = twMerge(clsx(...))                  |

## ANTI-PATTERNS

| Forbidden                  | Do Instead                         |
| -------------------------- | ---------------------------------- |
| Edit `orval-generated*.ts` | Run `pnpm orval`                   |
| Edit `orval-generated-zod` | Run `pnpm orval` to regenerate     |
| Hardcode colors            | Use `constants/themes` or CSS vars |
| Complex logic in utils     | Move to `sections/` or `helper.ts` |
| Direct Axios/fetch calls   | Use Orval-generated API functions  |
