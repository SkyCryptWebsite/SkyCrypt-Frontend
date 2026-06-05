---
"skycrypt-frontend": patch
---

Eliminate `derived_inert` runtime warnings by hoisting `new IsInViewport(...)` out of a `$derived` in `Chip.svelte` and splitting `getThemeIcons(...).current` in the header. Align remaining stats-view remote queries with the post-2.61 docs idiom (`await` for template/context-feed sites; `.current`/`.loading`/`.error` kept only for the loading-button-spinner case). Drop the redundant `getCombined()` in `Sections.svelte`. Make the navbar's tab scroll-on-mount race-resistant and its `IntersectionObserver` `rootMargin` NaN-safe.
