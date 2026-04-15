---
"skycrypt-frontend": patch
---

Fix SvelteKit 2.56 remote query lifecycle regressions by keeping the combined profile query local to the consuming components instead of passing a live query instance through context. This aligns the app with the remote function tracking changes from sveltejs/kit#15533 and the related refresh model changes in sveltejs/kit#15562.
