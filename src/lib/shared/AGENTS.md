# SRC/LIB/SHARED

## OVERVIEW

Shared utilities, constants, and API clients for SkyCrypt frontend.

## STRUCTURE

```
shared/
├── api/             # Orval-generated API client
│   ├── mutator/     # Custom Axios instance
│   └── *.ts         # DO NOT EDIT (Generated)
├── constants/       # Static game data
│   ├── themes/      # Theme JSON definitions
│   └── *.ts         # Enchantments, rarities, stats
├── mc-text/         # Minecraft text parser
│   ├── parser/      # Core parsing (§ codes)
│   └── obfuscated/  # §k handling
├── embedGenerator.ts
├── helper.ts
└── utils.ts
```

## WHERE TO LOOK

| Task          | Location                         | Notes                |
| ------------- | -------------------------------- | -------------------- |
| API client    | `api/orval-generated.ts`         | **READ ONLY**        |
| API config    | `api/mutator/custom-instance.ts` | Axios interceptors   |
| MC formatting | `mc-text/parser/`                | `§a`, `§l` to HTML   |
| Themes        | `constants/themes/`              | UI theme definitions |
| Game data     | `constants/`                     | SkyBlock mappings    |

## ANTI-PATTERNS

| Forbidden                  | Do Instead                         |
| -------------------------- | ---------------------------------- |
| Edit `orval-generated*.ts` | Run `pnpm orval`                   |
| Hardcode colors            | Use `constants/themes` or CSS vars |
| Complex logic in utils     | Move to `sections/`                |
| Direct Axios calls         | Use generated Orval hooks          |
