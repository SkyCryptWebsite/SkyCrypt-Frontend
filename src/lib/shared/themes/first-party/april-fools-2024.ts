import type { ThemeV3 } from "../schema";
import { defaultTheme } from "./default";

export const aprilFools2024Theme = {
  schema: 3,
  light: defaultTheme.light,
  colors: {
    icon: "oklch(68.5% 0.2336 351.46)",
    link: "oklch(68.5% 0.2336 351.46)",
    hover: "oklch(68.5% 0.2336 351.46)",
    maxed: "oklch(66.55% 0.1962 10.02)",
    gold: "oklch(56.4% 0.095 238.43)",
    logo: "oklch(68.5% 0.2336 351.46)"
  },
  backgrounds: {
    skillbar: {
      type: "stripes",
      angle: "45deg",
      colors: ["oklch(68.5% 0.2336 351.46)", "oklch(79.28% 0.1275 345.78)"],
      width: 10
    },
    maxedbar: {
      type: "stripes",
      angle: "45deg",
      colors: ["oklch(76.55% 0.1571 348.17)", "oklch(66.55% 0.1962 10.02)"],
      width: 10
    },
    page: {
      url: "https://sky.shiiyu.moe/img/themes/april-fools-2024/bg.avif"
    }
  },
  minecraft: defaultTheme.minecraft,
  metadata: {
    id: "april-fools-2024",
    name: "April Fools 2024 Theme",
    author: "DuckySoLucky",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  }
} satisfies ThemeV3;
