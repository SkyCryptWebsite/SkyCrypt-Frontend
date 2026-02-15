import type { ThemeV3 } from "../schema";

export const draconicTheme = {
  id: "draconic",
  name: "Draconic Purple Theme",
  author: "rainbowcraft2",
  schema: 3,
  light: false,
  colors: {
    icon: "oklch(64.46% 0.1986 315.35)",
    link: "oklch(52.22% 0.1464 298.72)",
    hover: "oklch(64.46% 0.1986 315.35)",
    maxed: "oklch(72.84% 0.1506 75.86)",
    gold: "oklch(82.84% 0.1548 78.27)",
    logo: "oklch(59.96% 0.1826 315.91)",
    text: "oklch(1 0 0)",
    background: "oklch(0 0 0)",
    header: "oklch(0.28 0 0)",
    greyBackground: "oklch(0.24 0 0)",
    loreBackground: "oklch(0.17 0 0 / 0.9)",
    bg: "oklch(0.18 0 0)",
    mctooltipBg: "oklch(12.142% 0.05582 328.352 / 0.93)"
  },
  backgrounds: {
    skillbar: {
      type: "color",
      color: "oklch(64.46% 0.1986 315.35)"
    },
    maxedbar: {
      type: "color",
      color: "oklch(69.69% 0.1423 76.74)"
    },
    page: {
      url: "https://sky.shiiyu.moe/img/themes/draconic/bg.avif"
    }
  },
  minecraft: {
    palette: "nice-dark",
    overrides: undefined
  },
  meta: {
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  }
} satisfies ThemeV3;
