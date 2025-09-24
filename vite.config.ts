import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";

export default defineConfig({
  plugins: [
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: "skycrypt",
        project: "javascript-sveltekit"
      }
    }),
    tailwindcss(),
    sveltekit(),
    devtoolsJson()
  ],
  build: {
    sourcemap: true
  }
});
