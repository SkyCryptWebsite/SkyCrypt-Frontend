---
"skycrypt-frontend": patch
---

Restore the card background and inline-emoji rendering after upgrading to `takumi-js@1.1.x`. The underlying Rust crate's commit `adc48da` ("Treat absolute/floated children as out-of-flow for inline layout detection") reworked which children participate in inline formatting context, leaving the previous `<img class="absolute inset-0">` background unrendered — which made the white text and emoji appear to vanish too. The persistent image is now applied as `background-image` CSS on the parent `<main>`, matching the pattern shown in the takumi docs.
