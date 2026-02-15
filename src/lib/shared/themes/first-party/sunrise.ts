import type { ThemeV3 } from "../schema";

export const sunriseTheme = {
  id: "sunrise",
  name: "Sunrise Orange Theme",
  author: "rainbowcraft2",
  schema: 3,
  light: true,
  colors: {
    icon: "oklch(68.54% 0.1745 32.89)",
    link: "oklch(68.54% 0.1745 32.89)",
    hover: "oklch(78.37% 0.1446971028576553 54.319000725588424)",
    maxed: "oklch(72.84% 0.1506 75.86)",
    gold: "oklch(82.84% 0.1548 78.27)",
    logo: "oklch(68.95% 0.1782 33.37)",
    text: "oklch(0 0 0)",
    background: "oklch(0.9 0 0)",
    header: "oklch(0.95 0 0)",
    greyBackground: "oklch(0.85 0 0)",
    loreBackground: "oklch(0.88 0 0 / 0.9)",
    bg: "oklch(0.9 0 0)",
    mctooltipBg: "oklch(0.85 0.02 264.05 / 0.93)"
  },
  backgrounds: {
    skillbar: {
      type: "color",
      color: "oklch(68.54% 0.1745 32.89)"
    },
    maxedbar: {
      type: "color",
      color: "oklch(69.69% 0.1423 76.74)"
    },
    page: {
      url: "https://sky.shiiyu.moe/img/themes/sunrise/bg.avif"
    }
  },
  minecraft: {
    palette: "nice-light",
    overrides: undefined
  },
  meta: {
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  }
} satisfies ThemeV3;
