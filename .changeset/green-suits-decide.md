---
"skycrypt-frontend": patch
---

Fix the settings drag-and-drop lists after the `@dnd-kit/svelte` 0.4.0 upgrade by restoring stable sortable behavior with the updated plugin configuration and provider lifecycle handling. This keeps whole-row dragging working reliably in the Order and Misc settings tabs.
