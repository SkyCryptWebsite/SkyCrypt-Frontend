// Disables access to DOM typings like `HTMLElement` which are not available
// inside a service worker and instantiates the correct globals
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// Ensures that the `$service-worker` import has proper type definitions
/// <reference types="@sveltejs/kit" />

// Only necessary if you have an import from `$env/static/public`
/// <reference types="../.svelte-kit/ambient.d.ts" />

import { version } from "$service-worker";

// This gives `self` the correct types
const self = globalThis.self as unknown as ServiceWorkerGlobalScope;

// Create a unique cache name for this deployment
const _CACHE = `cache-${version}`;

// Remove previous cached data from disk
async function deleteOldCaches() {
  for (const key of await caches.keys()) {
    await caches.delete(key);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(deleteOldCaches());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
});
