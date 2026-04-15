---
"skycrypt-frontend": patch
---

Reduce Svelte 5 `await_reactivity_loss` warnings after the SvelteKit remote function changes by keeping profile, networth, theme icon, and performance-mode reads in non-async reactive paths. This aligns the affected UI with the stricter query lifecycle introduced around sveltejs/kit#15533.
