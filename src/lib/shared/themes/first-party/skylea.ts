import type { ThemeV3 } from "../schema";
import { defaultTheme } from "./default";

export const skyleaTheme = {
  schema: 3,
  light: defaultTheme.light,
  colors: {
    icon: "oklch(47.89% 0.1837 357.9)",
    link: "oklch(68.49% 0.2193 353.99)",
    hover: "oklch(77.16% 0.1418 349.6)",
    logo: "oklch(65.1% 0.2264 355.13)"
  },
  backgrounds: {
    skillbar: {
      type: "color",
      color: "oklch(40.82% 0.1556 357.65)"
    },
    page: {
      url: "https://sky.shiiyu.moe/img/themes/skylea/bg.avif"
    }
  },
  minecraft: defaultTheme.minecraft,
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
