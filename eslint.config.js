import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import { fileURLToPath } from "node:url";
import ts from "typescript-eslint";
import svelteConfig from "./svelte.config.js";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

/** @type { import("eslint").Linter.Config } */
export default ts.config(
  includeIgnoreFile(gitignorePath),
  ...pluginQuery.configs["flat/recommended"],
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  ...svelte.configs.prettier,
  prettier,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true
        }
      ],
      "svelte/no-at-html-tags": "off",
      "no-console": ["error", { allow: ["info", "warn", "dir", "timeLog", "assert", "clear", "count", "countReset", "group", "groupEnd", "table", "dirxml", "error", "groupCollapsed", "Console", "profile", "profileEnd", "timeStamp", "context"] }]
    }
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2017,
        ...globals.node
      }
    }
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"], // Add support for additional file extensions, such as .svelte
        parser: ts.parser,
        svelteFeatures: {
          experimentalGenerics: true
        },
        // We recommend importing and specifying svelte.config.js.
        // By doing so, some rules in eslint-plugin-svelte will automatically read the configuration and adjust their behavior accordingly.
        // While certain Svelte settings may be statically loaded from svelte.config.js even if you don’t specify it,
        // explicitly specifying it ensures better compatibility and functionality.
        svelteConfig
      }
    }
  },
  {
    rules: {
      "svelte/no-useless-mustaches": "off"
    }
  },
  { ignores: ["**/.DS_Store", "**/node_modules/", "**/build/", "**/.svelte-kit/", "**/package/", "**/.env", "**/.env.*", "**/pnpm-lock.yaml", "**/package-lock.json", "**/yarn.lock", "**/NotEnoughUpdates-REPO/", "**/static/", "**/cache/"] }
);
