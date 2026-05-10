---
"skycrypt-frontend": patch
---

Render the JSON-LD `<script type="application/ld+json">` block via `<svelte:element>` instead of `{@html}`, dropping the closing-tag-splitting workaround. The XSS-safe `safeJsonLd` escaping (`<` / `>` / `&`) is unchanged and still preserves data fidelity, so crawlers see exactly the same JSON content as before.
