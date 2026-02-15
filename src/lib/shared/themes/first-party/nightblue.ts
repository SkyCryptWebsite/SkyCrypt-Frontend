import type { ThemeV3 } from "../schema";

export const nightblueTheme = {
  id: "nightblue",
  name: "Night Blue Theme",
  author: "8KCoffeeWizard",
  schema: 3,
  light: false,
  colors: {
    icon: "oklch(74.84% 0.14695169052401735 238.28643418420637)",
    link: "oklch(90.41% 0.1549417047860022 192.7359326767159)",
    hover: "oklch(69.38% 0.1207 214.05)",
    maxed: "oklch(72.84% 0.1506 75.86)",
    gold: "oklch(82.84% 0.1548 78.27)",
    logo: "oklch(61.34% 0.1543 245.78)",
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
      color: "oklch(74.84% 0.14695169052401735 238.28643418420637)"
    },
    maxedbar: {
      type: "color",
      color: "oklch(69.69% 0.1423 76.74)"
    },
    page: {
      url: "https://sky.shiiyu.moe/img/themes/nightblue/bg.avif"
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
