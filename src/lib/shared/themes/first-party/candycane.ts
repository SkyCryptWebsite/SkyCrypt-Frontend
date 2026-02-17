import type { ThemeV3 } from "../schema";
import { defaultTheme } from "./default";

export const candycaneTheme = {
  schema: 3,
  light: true,
  colors: {
    icon: "oklch(52.68% 0.2161 29.23)",
    link: "oklch(53.47% 0.2194 29.23)",
    hover: "oklch(59.05% 0.2423 29.23)",
    maxed: "oklch(72.98% 0.1509 75.83)",
    gold: "oklch(65.54% 0.1405 71.76)",
    logo: "oklch(53.08% 0.2177 29.23)"
  },
  backgrounds: {
    skillbar: {
      type: "stripes",
      angle: "45deg",
      colors: ["oklch(68.22% 0.2063 24.43)", "oklch(100% 0 0)"],
      width: 10
    },
    maxedbar: {
      type: "stripes",
      angle: "45deg",
      colors: ["oklch(67.03% 0.2188 33.21)", "oklch(83.26% 0.1543 79.33)"],
      width: 10
    },
    page: {
      url: "https://sky.shiiyu.moe/img/themes/candycane/bg.avif"
    }
  },
  minecraft: {
    palette: "nice-dark",
    overrides: defaultTheme.minecraft.overrides
  },
  metadata: {
    id: "candycane",
    name: "Candy Cane Theme",
    author: "Cookie_Wookie_7",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  }
} satisfies ThemeV3;
