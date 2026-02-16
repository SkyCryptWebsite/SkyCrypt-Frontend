import type { ThemeV3 } from "../schema";

export const skyleaTheme = {
  schema: 3,
  light: false,
  colors: {
    icon: "oklch(47.89% 0.1837 357.9)",
    link: "oklch(68.49% 0.2193 353.99)",
    hover: "oklch(77.16% 0.1418 349.6)",
    maxed: "oklch(72.84% 0.1506 75.86)",
    gold: "oklch(82.84% 0.1548 78.27)",
    logo: "oklch(65.1% 0.2264 355.13)",
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
      color: "oklch(40.82% 0.1556 357.65)"
    },
    maxedbar: {
      type: "color",
      color: "oklch(69.69% 0.1423 76.74)"
    },
    page: {
      url: "https://sky.shiiyu.moe/img/themes/skylea/bg.avif"
    }
  },
  minecraft: {
    palette: "nice-dark",
    overrides: undefined
  },
  enchantedGlint: "https://sky.shiiyu.moe/img/enchanted-glint-legacy.avif",
  metadata: {
    id: "skylea",
    name: "sky.lea.moe",
    author: "LeaPhant",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  }
} satisfies ThemeV3;
