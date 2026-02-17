# Changelog

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

<<<<<<< HEAD

## 3.1.0-beta.3

### Patch Changes

- Refactor how bots and embeds are handled to prevent getting flagged for "cloaking" ([`c4fab6e`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/c4fab6ee92b10a4a136b1c87e9e350f15f9a757e))

- Enable link preloading again ([`8fa2660`](https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/8fa26605a08f45505122928ea5ea60a63374ecf0))

=======

> > > > > > > origin/prod

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
