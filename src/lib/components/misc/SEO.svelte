<script lang="ts">
  import { page } from "$app/state";
  import { getTheme } from "$ctx";
  import type { ModelsEmbedData } from "$lib/shared/api/orval-generated";
  import { getLongDescription, getMetaTitle, getShortDescription } from "$lib/shared/embedGenerator";
  import SvelteSeo from "svelte-seo";

  const { embedData }: { embedData: ModelsEmbedData } = $props();
  const isStatsPage = page.url.pathname.includes("/stats/");
  const themeContext = getTheme();
</script>

<svelte:head>
  <link rel="icon" href={isStatsPage ? `https://nmsr.nickac.dev/face/${embedData.uuid}` : `https://nmsr.nickac.dev/bust/${embedData.uuid}?y=-20`} sizes="32x32" type="image/png" />
</svelte:head>

<SvelteSeo
  title="{embedData.displayName} | SkyCrypt"
  description={isStatsPage ? getShortDescription(embedData) : getLongDescription(embedData)}
  canonical="https://sky.shiiyu.moe/stats/{embedData.uuid}/{embedData.profile_id}"
  openGraph={{
    title: getMetaTitle(embedData),
    description: getLongDescription(embedData),
    type: "profile",
    profile: {
      username: embedData.username
    },
    images: [
      {
        url: `https://nmsr.nickac.dev/bust/${embedData.uuid}?y=-20`,
        width: 512,
        height: 512,
        alt: embedData.displayName
      }
    ],
    site_name: "SkyCrypt"
  }}
  twitter={{
    card: "summary",
    image: `https://nmsr.nickac.dev/bust/${embedData.uuid}?y=-20`,
    imageAlt: embedData.displayName,
    title: getMetaTitle(embedData),
    description: getLongDescription(embedData)
  }}
  themeColor={themeContext.activeTheme?.light ? "#dbdbdb" : "#282828"}
  manifest="/manifest.webmanifest" />
