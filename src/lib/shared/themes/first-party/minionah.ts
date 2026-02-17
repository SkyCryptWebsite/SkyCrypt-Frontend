import type { ThemeV3 } from "../schema";
import { defaultTheme } from "./default";

export const minionahTheme = {
  schema: 3,
  light: defaultTheme.light,
  colors: {
    icon: "oklch(37.05% 0 0)",
    link: "oklch(92.34% 0 0)",
    hover: "oklch(98.48% 0 0)",
    maxed: "oklch(72.84% 0.1506 75.86)",
    gold: "oklch(72.84% 0.1506 75.86)",
    logo: "oklch(26.97% 0 0)"
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
  minecraft: defaultTheme.minecraft,
  metadata: {
    id: "minionah",
    name: "MinionAH Theme",
    author: "DarthGigi",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1
  }
} satisfies ThemeV3;
