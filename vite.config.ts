import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { webdriverio } from "@vitest/browser-webdriverio";
import devtoolsJson from "vite-plugin-devtools-json";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: "skycrypt",
        project: "skycrypt-sveltekit"
      },
      adapter: "node"
    }),
    tailwindcss(),
    sveltekit(),
    devtoolsJson()
  ],
  build: { sourcemap: true },
  test: {
    expect: { requireAssertions: true },
    projects: [
      {
        extends: "./vite.config.ts",
        test: {
          name: "client",
          browser: {
            enabled: true,
            provider: webdriverio(),
            instances: [{ browser: "chrome" }],
            headless: true
          },
          include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
          exclude: ["src/lib/server/**"],
          setupFiles: ["./vitest-setup-client.ts"]
        }
      },
      {
        extends: "./vite.config.ts",
        test: {
          name: "server",
          environment: "node",
          include: ["src/**/*.{test,spec}.{js,ts}"],
          exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"]
        }
      }
    ]
  }
});
