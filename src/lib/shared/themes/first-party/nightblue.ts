import type { ThemeV3 } from "../schema";
import { defaultTheme } from "./default";

export const nightblueTheme = {
  schema: 3,
  light: defaultTheme.light,
  colors: {
    icon: "oklch(74.84% 0.14695169052401735 238.28643418420637)",
    link: "oklch(90.41% 0.1549417047860022 192.7359326767159)",
    hover: "oklch(69.38% 0.1207 214.05)",
    logo: "oklch(61.34% 0.1543 245.78)"
  },
  backgrounds: {
    skillbar: {
      type: "color",
      color: "oklch(74.84% 0.14695169052401735 238.28643418420637)"
    },
    page: {
      url: "https://sky.shiiyu.moe/img/themes/nightblue/bg.avif"
    }
  },
  minecraft: defaultTheme.minecraft,
  metadata: {
    id: "nightblue",
    name: "Night Blue Theme",
    author: "8KCoffeeWizard",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  }
} satisfies ThemeV3;
