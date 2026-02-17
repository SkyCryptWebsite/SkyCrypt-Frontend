import type { ThemeV3 } from "../schema";
import { defaultTheme } from "./default";

export const draconicTheme = {
  schema: 3,
  light: defaultTheme.light,
  colors: {
    icon: "oklch(64.46% 0.1986 315.35)",
    link: "oklch(52.22% 0.1464 298.72)",
    hover: "oklch(64.46% 0.1986 315.35)",
    logo: "oklch(59.96% 0.1826 315.91)"
  },
  backgrounds: {
    skillbar: {
      type: "color",
      color: "oklch(64.46% 0.1986 315.35)"
    },
    page: {
      url: "https://sky.shiiyu.moe/img/themes/draconic/bg.avif"
    }
  },
  minecraft: defaultTheme.minecraft,
  metadata: {
    id: "draconic",
    name: "Draconic Purple Theme",
    author: "rainbowcraft2",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  }
} satisfies ThemeV3;
