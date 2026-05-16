---
"skycrypt-frontend": patch
---

Escape JSON-LD payload so user-controlled fields (e.g. the `ign` URL parameter on stats pages) cannot break out of the `<script type="application/ld+json">` tag. `svelte-seo`'s `jsonLd` prop emits `JSON.stringify(data)` raw, and `JSON.stringify` does not escape `<`, `>` or `&` — so visiting `/stats/<script>alert(1)</script>` was enough to inject arbitrary HTML/JS into `<head>`. The new `JsonLd` component escapes those three characters to their unicode escapes (still valid JSON) before emitting the tag.
