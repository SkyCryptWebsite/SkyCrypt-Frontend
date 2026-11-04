<script lang="ts">
  import { dev } from "$app/env";
  import { page } from "$app/state";
  import AdBlockSlot from "#lib/components/ads/AdBlockSlot.svelte";
  import { getAdFree } from "#lib/shared/ads.remote";
  import { AD_REPORT, adBlock } from "#lib/shared/ads.svelte";

  let { id }: { id: string } = $props();

  // NitroPay picks from these by the holder's rendered width. Capped at 100px tall to match the ad-block notice.
  function createAd(node: HTMLElement) {
    window.nitroAds.createAd(node.id, {
      sizes: [
        [970, 90],
        [728, 90],
        [320, 100],
        [320, 50]
      ],
      renderVisibleOnly: true,
      report: AD_REPORT,
      demo: dev
    });
  }
</script>

<AdBlockSlot />
{#if !adBlock.detected}
  <svelte:boundary>
    {#snippet failed()}{/snippet}
    {#if !(await getAdFree())}
      <!-- Recreated per profile, as NitroPay asks of SPAs; params rather than the URL so shallow rewrites don't count. -->
      {#key `${page.route.id}${JSON.stringify(page.params)}`}
        <div {id} class="flex min-h-24 items-center justify-center" {@attach createAd}></div>
      {/key}
    {/if}
  </svelte:boundary>
{/if}
