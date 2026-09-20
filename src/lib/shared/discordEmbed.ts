import type { ModelsEmbedData } from "$lib/shared/api/orval-generated";
import { getLongDescription } from "$lib/shared/embedGenerator";
import type { APIContainerComponent } from "discord-api-types/v10";

export function createDiscordEmbed(data: ModelsEmbedData) {
  const username = encodeURIComponent(data.username || "");
  const profile = encodeURIComponent(data.profile_cute_name || "");
  const profileUrl = `https://sky.shiiyu.moe/stats/${username}/${profile}`;
  const title = `${data.displayName || data.username || "SkyCrypt"} (${data.profile_cute_name || "Selected profile"})`
    .replace(/[\\[\]*_`<>]/g, "\\$&")
    .replace(/[\r\n]/g, " ");
  const summary = {
    type: 10 as const,
    content: `### [${title}](${profileUrl})\n${getLongDescription(data).trim()}`
  };

  return {
    component: {
      type: 17,
      accent_color: 1957930,
      components: [
        data.uuid
          ? {
              type: 9,
              components: [summary],
              accessory: {
                type: 11,
                media: { url: `https://nmsr.nickac.dev/bust/${encodeURIComponent(data.uuid)}?y=-20` }
              }
            }
          : summary,
        { type: 14, divider: true, spacing: 1 },
        {
          type: 1,
          components: [
            { type: 2, style: 5, label: "SkyCrypt", url: profileUrl },
            { type: 2, style: 5, label: "Plancke", url: `https://plancke.io/hypixel/player/stats/${username}` },
            { type: 2, style: 5, label: "Elite", url: `https://eliteskyblock.com/@${username}/${profile}` }
          ]
        },
        { type: 10, content: `-# SkyCrypt • v${__NPM_PACKAGE_VERSION__}` }
      ]
    }
  } satisfies { component: APIContainerComponent };
}

export function serializeDiscordEmbed(embed: { component: APIContainerComponent }): string {
  return JSON.stringify(embed).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}
