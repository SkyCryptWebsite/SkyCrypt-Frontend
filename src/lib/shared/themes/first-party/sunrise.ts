import type { ThemeV3 } from "../schema";
import { defaultTheme } from "./default";

export const sunriseTheme = {
  schema: 3,
  light: defaultTheme.light,
  colors: {
    ...defaultTheme.colors,
    icon: "oklch(68.54% 0.1745 32.89)",
    link: "oklch(68.54% 0.1745 32.89)",
    hover: "oklch(78.37% 0.1446971028576553 54.319000725588424)",
    logo: "oklch(68.95% 0.1782 33.37)"
  },
  backgrounds: {
    ...defaultTheme.backgrounds,
    skillbar: {
      type: "color",
      color: "oklch(68.54% 0.1745 32.89)"
    },
    page: {
      url: "https://sky.shiiyu.moe/img/themes/sunrise/bg.avif"
    }
  },
  minecraft: defaultTheme.minecraft,
  metadata: {
    id: "sunrise",
    name: "Sunrise Orange Theme",
    author: "rainbowcraft2",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  }
} satisfies ThemeV3;
