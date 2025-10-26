import { query } from "$app/server";
import { z } from "zod";

const schema = z.object({
  color: z.string().default("oklch(0 0 0)"),
  invert: z.boolean().default(false).optional()
});

export const getThemeIcons = query.batch(schema, async () => {
  // Return a lookup function that generates the SVG for each logo request
  return (logo) => {
    const background = logo.invert ? "oklch(100 0 0)" : logo.color;
    const foreground = logo.invert ? logo.color : "oklch(100 0 0)";

    const svg = `<svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
    <title>SkyCrypt Logo</title>
    <rect rx="16" height="120" width="120" y="0" x="0" fill="${background}" />
    <g fill="${foreground}">
      <rect rx="4" height="28" width="19" y="69" x="22" />
      <rect rx="4" height="75" width="19" y="22" x="50" />
      <rect rx="4" height="47" width="19" y="50" x="79" />
    </g>
  </svg>`;

    return svg;
  };
});
