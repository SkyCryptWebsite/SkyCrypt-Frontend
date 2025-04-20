import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: "skycrypt",
        project: "javascript-sveltekit"
      }
    }),
    tailwindcss(),
    sveltekit()
  ],
  server: {
    fs: {
      // Allow serving files from static/resourcepacks
      allow: [".."]
    }
  },
  optimizeDeps: {
    exclude: ["@napi-rs/canvas"]
  },
  build: {
    sourcemap: true,
    commonjsOptions: {
      ignore: ["@napi-rs/canvas-*", "@napi-rs/canvas-darwin-arm64", "@napi-rs/canvas-darwin-x64", "@napi-rs/canvas-linux-arm64-gnu", "@napi-rs/canvas-linux-arm64-musl", "@napi-rs/canvas-linux-x64-gnu", "@napi-rs/canvas-linux-x64-musl", "@napi-rs/canvas-win32-x64-msvc"]
    }
  }
});
