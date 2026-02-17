import type { ThemeV3 } from "../schema";
import { defaultTheme } from "./default";

export const burningCinnabarTheme = {
  schema: 3,
  light: defaultTheme.light,
  colors: {
    icon: "oklch(56.79% 0.1979 28.72)",
    link: "oklch(56.79% 0.1979 28.72)",
    hover: "oklch(61.45% 0.1933 27.92)",
    logo: "oklch(49.37% 0.1887 21.44)"
  },
  backgrounds: {
    skillbar: {
      type: "color",
      color: "oklch(61.45% 0.1933 27.92)"
    },
    page: {
      url: "https://sky.shiiyu.moe/img/themes/burning-cinnabar/bg.avif"
    }
  },
  minecraft: defaultTheme.minecraft,
  metadata: {
    id: "burning-cinnabar",
    name: "Burning Cinnabar Theme",
    author: "rainbowcraft2",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  }
} satisfies ThemeV3;
