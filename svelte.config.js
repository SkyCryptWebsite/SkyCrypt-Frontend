import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const forceRunesMode = (filename) => {
  if (filename.match(/[\\/\\]node_modules[\\/\\]/)) {
    return false;
  }
  return true;
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors

  preprocess: vitePreprocess({ script: true }),
  optimizeDeps: {
    include: ["fs"]
  },

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
    alias: {
      $params: "./src/params",
      $types: "./src/lib/types",
      $db: "./src/db",
      $constants: "./src/lib/server/constants",
      $ctx: "./src/context"
    },
    csrf: {
      trustedOrigins: ["https://cupcake.shiiyu.moe", "https://sky.shiiyu.moe", "http://localhost:5173", "http://localhost:4173", "http://localhost:3000", "http://localhost:8080"]
    },
    serviceWorker: {
      register: false
    },
    csp: {
      mode: "auto",
      directives: {
        "script-src": ["self", "unsafe-inline"],
        "style-src": ["self", "unsafe-inline", "https://fonts.googleapis.com"],
        "img-src": ["self", "data:", "https://vzge.me", "https://crafatar.com", "https://mc-heads.net", "http://localhost:8080", "https://cupcake.shiiyu.moe", "https://sky.shiiyu.moe"],
        "connect-src": ["self", "https://crafatar.com", "http://localhost:8080", "https://cupcake.shiiyu.moe", "https://sky.shiiyu.moe"],
        "font-src": ["self", "https://fonts.gstatic.com"]
      }
    }
  },
  // Hide build warnings from node_modules
  onwarn: (warning, handler) => {
    if (warning.filename.includes("node_modules")) return;
    handler(warning);
  },
  vitePlugin: {
    // Can be removed once Svelte 6 is released, as `true` will be the default
    dynamicCompileOptions({ filename, compileOptions }) {
      // Dynamically set runes mode per Svelte file
      if (forceRunesMode(filename) && !compileOptions.runes) {
        return { runes: true };
      }
    }
  }
};

export default config;
