---
"skycrypt-frontend": patch
---

Fix remaining SvelteKit remote query lifecycle regressions by replacing stored live query instances with plain reactive snapshots in the stats route, combined section loading, inventory, networth, additional stats, and header theme icon flows. This aligns the app more closely with the stricter remote query behavior introduced around sveltejs/kit#15533 and prevents inactive query access during tab and section transitions.
