import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  compilerOptions: { experimental: { async: true } },
  kit: {
    experimental: {
      remoteFunctions: true,
      tracing: { server: true },
      instrumentation: { server: true }
    },
    adapter: adapter(),
    alias: {
      $params: "./src/params",
      $types: "./src/lib/types",
      $db: "./src/db",
      $constants: "./src/lib/server/constants",
      $ctx: "./src/context",
      $routes: "./src/routes",
      $src: "./src"
    },
    csrf: {
      trustedOrigins: ["https://cupcake.shiiyu.moe", "https://sky.shiiyu.moe", "http://localhost:5173", "http://localhost:4173", "http://localhost:3000", "http://localhost:8080"]
    },
    csp: {
      mode: "auto",
      directives: {
        "script-src": ["self", "unsafe-inline"],
        "worker-src": ["self", "blob:"],
        "style-src": ["self", "unsafe-inline", "https://fonts.googleapis.com"],
        "img-src": ["self", "data:", "https://textures.minecraft.net", "http://localhost:8080", "https://cupcake.shiiyu.moe", "https://sky.shiiyu.moe", "https://nmsr.nickac.dev"],
        "connect-src": ["self", "https://mowojang.matdoes.dev", "http://localhost:8080", "https://cupcake.shiiyu.moe", "https://sky.shiiyu.moe"],
        "font-src": ["self", "https://fonts.gstatic.com"],
        "frame-ancestors": ["self"]
      }
    },
    version: {
      name: process.env.PUBLIC_COMMIT_HASH,
      // in ms
      pollInterval: 1000 * 60 // 1 minute
    }
  },

  // Hide build warnings from node_modules
  onwarn: (warning, handler) => {
    if (warning.filename?.includes("node_modules")) return;

    handler(warning);
  },

  vitePlugin: {
    // Can be removed once Svelte 6 is released, as `true` will be the default
    dynamicCompileOptions: () => ({ runes: true })
  }
};

export default config;
