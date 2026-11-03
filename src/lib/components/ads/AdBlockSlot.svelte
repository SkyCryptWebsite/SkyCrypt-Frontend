<script lang="ts">
  /* eslint-disable svelte/no-navigation-without-resolve */
  import { PUBLIC_PATREON } from "$app/env/public";
  import { adBlock } from "#lib/shared/ads.svelte";
</script>

{#if adBlock.detected}
  <aside
    aria-label="Ad blocker notice"
    class="flex min-h-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground opacity-60">
    <p class="font-semibold text-pretty">Please consider disabling your ad blocker.</p>
    <p class="text-pretty">
      Ads help to support the development and keep the site running. Please consider disabling your ad blocker or
      <a
        href={PUBLIC_PATREON}
        target="_blank"
        rel="noopener"
        data-umami-event="adblock-patreon-click"
        data-umami-event-source="slot"
        class="underline underline-offset-2 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
        >support us on Patreon</a> to go ad-free.
    </p>
  </aside>
{/if}
