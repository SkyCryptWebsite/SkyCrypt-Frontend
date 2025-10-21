<script lang="ts">
  import { page } from "$app/state";
  import type { ModelsEmbedData } from "$lib/shared/api/orval-generated";
  import themes from "$lib/shared/constants/themes";
  import { getLongDescription, getMetaTitle, getShortDescription } from "$lib/shared/embedGenerator";
  import { theme as themeStore } from "$lib/stores/themes";
  import SvelteSeo from "svelte-seo";

  const { embedData }: { embedData: ModelsEmbedData } = $props();
  const isStatsPage = page.url.pathname.includes("/stats/");
</script>

<svelte:head>
  <link rel="icon" href={isStatsPage ? `https://crafatar.com/avatars/${embedData.uuid}?size=32&overlay` : `https://vzge.me/bust/${embedData.uuid}?y=-40`} sizes="32x32" type="image/png" />
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
        url: `https://vzge.me/bust/${embedData.uuid}?y=-40`,
        width: 512,
        height: 512,
        alt: embedData.displayName
      }
    ],
    site_name: "SkyCrypt"
  }}
  twitter={{
    card: "summary",
    image: `https://vzge.me/bust/${embedData.uuid}?y=-40`,
    imageAlt: embedData.displayName,
    title: getMetaTitle(embedData),
    description: getLongDescription(embedData)
  }}
  themeColor={themes.find((theme) => theme.id === $themeStore)?.light ? "#dbdbdb" : "#282828"}
  manifest="/manifest.webmanifest" />
