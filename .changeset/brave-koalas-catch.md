---
"skycrypt-frontend": patch
---

Stop the production container restart loop caused by unhandled promise rejections under Node 24. Two changes: (1) the `/stats/[ign]/[[profile]]/card` endpoint now uses `Promise.allSettled` rather than `Promise.all` for the parallel `getProfileStats` / `getNetworth` / `getCombined` calls — when one rejects first, the losing-side promises no longer become orphaned rejections that crash the process. (2) A `process.on("unhandledRejection")` safety net in `instrumentation.server.ts` logs + reports any future orphans to Sentry instead of exiting, since Node 24's default `--unhandled-rejections=throw` is fatal. Combined this ends the ~2-minute restart cycle visible in production logs.
