<script lang="ts">
  import { page } from "$app/state";
  import themes from "$lib/shared/constants/themes";
  import { getLongDescription, getMetaTitle, getShortDescription } from "$lib/shared/embedGenerator";
  import { theme as themeStore } from "$lib/stores/themes";
  import type { EmbedV2 } from "$types/statsv2";
  import SvelteSeo from "svelte-seo";

  const { embedData }: { embedData: EmbedV2 } = $props();
  const isStatsPage = page.url.pathname.includes("/stats/");

  const showembed = $state(false);
</script>

<svelte:head>
  <link rel="icon" href={isStatsPage ? `https://crafatar.com/avatars/${embedData.uuid}?size=32&overlay` : `https://visage.surgeplay.com/bust/${embedData.uuid}?y=-40`} sizes="32x32" type="image/png" />
</svelte:head>

{#if showembed}
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
          url: `https://visage.surgeplay.com/bust/${embedData.uuid}?y=-40`,
          width: 512,
          height: 512,
          alt: embedData.displayName
        }
      ],
      site_name: "SkyCrypt"
    }}
    twitter={{
      card: "summary_large_image",
      image: `https://visage.surgeplay.com/bust/${embedData.uuid}?y=-40`,
      imageAlt: embedData.displayName,
      title: getMetaTitle(embedData),
      description: getLongDescription(embedData)
    }}
    themeColor={themes.find((theme) => theme.id === $themeStore)?.light ? "#dbdbdb" : "#282828"}
    manifest="/manifest.webmanifest" />
{/if}
