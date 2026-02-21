import { defineConfig } from "orval";

export default defineConfig({
  skycrypt: {
    input: "http://localhost:8080/api/openapi/doc.json",
    output: {
      target: "./src/lib/shared/api/orval-generated.ts",
      client: "fetch",
      tsconfig: "./tsconfig.json",
      override: {
        mutator: {
          path: "./src/lib/shared/api/mutator/custom-instance.ts",
          name: "customFetch"
        }
      },
      prettier: true
    }
  },
  skycryptZod: {
    input: "http://localhost:8080/api/openapi/doc.json",
    output: {
      target: "./src/lib/shared/api/orval-generated-zod.ts",
      client: "zod",
      tsconfig: "./tsconfig.json",
      fileExtension: ".zod.ts",
      prettier: true
    }
  }
});
