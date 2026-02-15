import type { ThemeV3 } from "../schema";

export const minionahTheme = {
  id: "minionah",
  name: "MinionAH Theme",
  author: "DarthGigi",
  schema: 3,
  light: false,
  colors: {
    icon: "oklch(37.05% 0 0)",
    link: "oklch(92.34% 0 0)",
    hover: "oklch(98.48% 0 0)",
    maxed: "oklch(72.84% 0.1506 75.86)",
    gold: "oklch(72.84% 0.1506 75.86)",
    logo: "oklch(26.97% 0 0)",
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
      color: "oklch(59.82% 0 0)"
    },
    maxedbar: {
      type: "color",
      color: "oklch(69.69% 0.1423 76.74)"
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
