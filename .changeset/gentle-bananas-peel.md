---
"skycrypt-frontend": patch
---

Fix search flows after the SvelteKit remote query changes in sveltejs/kit#15533 by switching the home page and command palette to imperative `query().run()` calls with client-side navigation. This removes duplicate search requests, avoids redirect errors from reactive query usage, and resets command palette search state correctly.
