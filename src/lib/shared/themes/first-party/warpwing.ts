import type { ThemeV3 } from "../schema";
import { defaultTheme } from "./default";

export const warpwingTheme = {
  schema: 3,
  light: defaultTheme.light,
  colors: {
    icon: "oklch(67.48% 0.1158 207.35)",
    link: "oklch(67.48% 0.1158 207.35)",
    hover: "oklch(67.48% 0.1158 207.35)",
    logo: "oklch(53.96% 0.0886 205.04)"
  },
  backgrounds: {
    skillbar: {
      type: "color",
      color: "oklch(67.48% 0.1158 207.35)"
    },
    page: {
      url: "https://blog.warpwing.cloud/_astro/demo-banner.BbPub-ks_1KHh80.webp"
    }
  },
  minecraft: defaultTheme.minecraft,
  metadata: {
    id: "warpwing",
    name: "Forest Walk",
    author: "WarpWing",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  }
} satisfies ThemeV3;
