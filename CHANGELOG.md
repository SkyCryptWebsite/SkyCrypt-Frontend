# Changelog

## 3.3.0-beta.1

### Patch Changes

- feat: remove consumables in Misc -> Uncategorized ([`0113d81`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/0113d81bfec105eee9b1e826e48535c29809c2f9))

## 3.3.0-beta.0

### Minor Changes

- feat: add attribute shards section ([`7f8dd28`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/7f8dd287848031216cecc7239aa422930af85366))

- feat: add support for 'sacks' tab in inventory ([`07537a2`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/07537a2157305ff2e9a62e6885d20f07efeb126f))

### Patch Changes

- chore: update repository URL in package.json and add pnpm workspace configuration ([`1985230`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/1985230a947b23bcc3f2c5eb5f5e086eb376e37a))

- fix: searching for a profile on an error page would not re-render the new page [SvelteKit Issue #15310](https://github.com/sveltejs/kit/issues/15310) ([`b01cd5a`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/b01cd5a45d53bb79ffc4e31873dfc895c3048c05))

- fix: last skillbar being misaligned when the items are even ([`4f5a428`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/4f5a428469c596c4ed826d2c851a7634fa7c2d9f))

- feat: add lava sea creatures and differentiate between water and lava sea creatures ([`f375582`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/f3755826b540344c7691cc192c6ef6fce356b673))

- chore: remove unused static assets ([`d85ebca`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/d85ebcacd8e214dcbac9ac00a28bdfa83e9115d3))

- fix: pet name being always white when using mc styled tooltips ([`9319fd7`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/9319fd71de27bab022565ce68032a9233698e875))

- feat: enhance renderLore function to support options for breaking spaces and dashes ([`0f5bc72`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/0f5bc72955f43c8e7b03811fad4d45038ef57f41))

- refactor: rename max to maxLevel in ModelsGardenChip and update references ([`096911c`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/096911c9b9da791fc568d97a5c28c087721b877e))

- feat: replace Essence component with Chips component and update API models ([`1215372`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/1215372d35ac6296130666b80b320f6f35418960))

- refactor: move Garden Chips from misc section to garden section ([`a66852f`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/a66852f61f953d6a95c8f5105eb1675e5144a394))
  feat: add DNA Analysis Milestone to garden section
  feat: add images to garden upgrades and chips, and add max level display for chips

- fix maxed enchants only showing a different color if rightmost in their respective line ([`f76c675`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/f76c675b858bf9220b3aba9a2df55389d6dd1cde))

- fix: update tooltip class for better word wrapping and adjust renderLore to support breaking spaces ([`0be8b23`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/0be8b23a14ac95d3ff4146774519d9947546c62e))

- feat: add mutations to garden ([`64b10c2`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/64b10c2716a7045ceac7deb821e47e190cdb3bb1))

- feat: implement tab context management, update skill sections with new tab enum, and open all collapsibles by default ([`17632d1`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/17632d1a254800afa8062a109c0f8b2d32f8fcd7))

- feat: add images to foraging tree gift chips ([`9c7a2c7`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/9c7a2c7c70eaea012d9a5b8f5958b57878fb747b))

## 3.2.0

### Minor Changes

- feat: add garden upgrades and garden chips ([#276](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/276))

- feat: add foraging in skills section ([#276](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/276))

### Patch Changes

- refactor: add tabs to skills section ([#276](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/276))

- refactor: make image in chip component optional ([#276](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/276))

## 3.2.0-beta.3

### Minor Changes

- feat: add garden upgrades and garden chips ([`123c4eb`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/123c4ebc1940ed7702c7b25bb71b3e1caad08e37))

- feat: add foraging in skills section ([`1c3fe6b`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/1c3fe6b4b6fd6411e2a2912c67811fb246b05782))

### Patch Changes

- refactor: add tabs to skills section ([`e6a3feb`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/e6a3feb7416c0d29a8fcbe9f433c1b1885629446))

- # refactor: make image in chip component optional ([`c7d580c`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/c7d580c060cdcc01178ec45224577708f1088370))

## 3.2.0

### Minor Changes

- Add runtime theme engine V3 with visual editor, replacing old build-time JSON theme system. Users can now create, edit, share, and manage custom themes directly on the website. Includes Zod schema validation, URL-based compressed sharing, MC color palette presets, live preview, and migration of all 11 first-party themes to the new V3 format. ([#269](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/269))

### Patch Changes

- Extracted DungeonCataCard, GardenPlotGrid, SectionBoundary, and CommandPalette (with CommandSearchGroup and CommandSettingsGroup sub-components) from large files. ([#266](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/266))

- Extracted 8 reusable components from large section files: SettingToggleRow, ContainedItemsGrid, NetworthCard, ContributorCard, ContributorCardSkeleton, CtaCard, InventorySearch, InventoryGrid. ([#266](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/266))

- Migrate tooltips to a singleton pattern ([#271](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/271))

- Reorganized component directory structure — moved 29 components into categorical subdirectories (item/, stats/, notices/, misc/, sections/). Updated 100+ import paths. ([#266](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/266))

- Added string shorthand props (text, subtitleText, tooltipContent) to Section, SectionTitle, SectionSubtitle, Notice, and Chip components. ([#266](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/266))

## 3.2.0-beta.2

### Patch Changes

- Migrate tooltips to a singleton pattern ([`9b3cfd3`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/9b3cfd32169d0539ad41d993a92a6a79ace8fa9c))

## 3.2.0-beta.1

### Minor Changes

- Add runtime theme engine V3 with visual editor, replacing old build-time JSON theme system. Users can now create, edit, share, and manage custom themes directly on the website. Includes Zod schema validation, URL-based compressed sharing, MC color palette presets, live preview, and migration of all 11 first-party themes to the new V3 format. ([#269](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/269))

## 3.1.2-beta.0

### Patch Changes

- Extracted DungeonCataCard, GardenPlotGrid, SectionBoundary, and CommandPalette (with CommandSearchGroup and CommandSettingsGroup sub-components) from large files. ([#266](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/266))

- Extracted 8 reusable components from large section files: SettingToggleRow, ContainedItemsGrid, NetworthCard, ContributorCard, ContributorCardSkeleton, CtaCard, InventorySearch, InventoryGrid. ([#266](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/266))

- Reorganized component directory structure — moved 29 components into categorical subdirectories (item/, stats/, notices/, misc/, sections/). Updated 100+ import paths. ([#266](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/266))

- Added string shorthand props (text, subtitleText, tooltipContent) to Section, SectionTitle, SectionSubtitle, Notice, and Chip components. ([#266](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/266))

## 3.1.1

### Patch Changes

- Refactor how bots and embeds are handled to prevent getting flagged for "cloaking" ([#261](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/261))

## 3.1.1-beta.0

### Patch Changes

- Refactor how bots and embeds are handled to prevent getting flagged for "cloaking" ([`c4fab6e`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/c4fab6ee92b10a4a136b1c87e9e350f15f9a757e))

## 3.1.0

### Minor Changes

- Migrate to changesets from changelogen ([#246](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/246))

- Added minecraft styled tooltips ([#254](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/254))

### Patch Changes

- Changeset for PR #243 ([#246](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/246))

- Use totalAmount instead of amount for collections ([#246](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/246))

## 3.1.0-beta.3

### Patch Changes

- Refactor how bots and embeds are handled to prevent getting flagged for "cloaking" ([`c4fab6e`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/c4fab6ee92b10a4a136b1c87e9e350f15f9a757e))

- Enable link preloading again ([`8fa2660`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/8fa26605a08f45505122928ea5ea60a63374ecf0))

## 3.1.0

### Minor Changes

- Migrate to changesets from changelogen ([#246](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/246))

- Added minecraft styled tooltips ([#254](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/254))

### Patch Changes

- Changeset for PR #243 ([#246](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/246))

- Use totalAmount instead of amount for collections ([#246](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/246))

## 3.1.0

### Minor Changes

- Migrate to changesets from changelogen ([#246](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/246))

- Added minecraft styled tooltips ([#254](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/254))

### Patch Changes

- Changeset for PR #243 ([#246](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/246))

- Use totalAmount instead of amount for collections ([#246](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/246))

## 3.1.0-beta.3

### Patch Changes

- Refactor how bots and embeds are handled to prevent getting flagged for "cloaking" ([`c4fab6e`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/c4fab6ee92b10a4a136b1c87e9e350f15f9a757e))

- Enable link preloading again ([`8fa2660`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/8fa26605a08f45505122928ea5ea60a63374ecf0))

## 3.1.0-beta.2

### Minor Changes

- Added minecraft styled tooltips ([#252](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/pull/252))

## 3.1.0-beta.1

### Patch Changes

- [`d70e081`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/d70e0811a2e2ca368c67fa30650a688f1f8e0fde) Thanks [@DarthGigi](https://github.com/DarthGigi)! - Changeset for PR #243

- [`c039d0b`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/c039d0b2f24365f36be0c860d003b3fb2cda45b9) Thanks [@DarthGigi](https://github.com/DarthGigi)! - Use totalAmount instead of amount for collections

## 3.1.0-beta.0

### Minor Changes

- [`977ebff`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/977ebff4621e6734c2800677cd607da91ed75d8f) Thanks [@DarthGigi](https://github.com/DarthGigi)! - Migrate to changesets from changelogen

All notable changes to this project will be documented in this file.

The format is based on [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

## v3.0.0

Initial release of the new GO rewrite of SkyCrypt-Backend.

## v2.0.0

Initial release of SkyCrypt v2 - A complete rewrite using SvelteKit.

## v1.0.0

Initial release
