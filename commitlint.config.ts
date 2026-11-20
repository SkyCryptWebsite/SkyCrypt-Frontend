import type { UserConfig } from "@commitlint/types";

const aiAttribution =
  /^co-authored-by:.*\b(claude|anthropic|copilot|codex|openai|gemini|cursor)\b|generated (with|by) (claude|copilot|codex)/im;

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  plugins: [
    {
      rules: {
        "no-ai-attribution": ({ raw }) => [
          !aiAttribution.test(raw ?? ""),
          "remove the AI co-author or attribution line"
        ]
      }
    }
  ],
  rules: {
    "no-ai-attribution": [2, "always"]
  }
};

export default config;
