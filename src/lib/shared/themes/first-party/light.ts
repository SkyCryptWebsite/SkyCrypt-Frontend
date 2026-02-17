import type { ThemeV3 } from "../schema";
import { defaultTheme } from "./default";

export const lightTheme = {
  schema: 3,
  light: true,
  colors: {
    ...defaultTheme.colors,
    icon: "oklch(67.18% 0.2125 144.8)",
    link: "oklch(75.19% 0.2293 145.93)",
    hover: "oklch(81.61% 0.2465 146.18)",
    maxed: "oklch(72.95% 0.1509 75.84)",
    gold: "oklch(65.57% 0.1406 71.71)",
    logo: "oklch(62.96% 0.1848 147.07)"
  },
  backgrounds: {
    skillbar: {
      type: "color",
      color: "oklch(76.9% 0.2065 142.21)"
    },
    maxedbar: {
      type: "color",
      color: "oklch(83.26% 0.1543 79.33)"
    },
    page: {
      url: "https://sky.shiiyu.moe/img/themes/light/bg.avif"
    }
  },
  minecraft: {
    palette: "nice-dark",
    overrides: defaultTheme.minecraft.overrides
  },
  metadata: {
    id: "default-light",
    name: "Default Light Theme",
    author: "SkyCrypt Team",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  }
} satisfies ThemeV3;
