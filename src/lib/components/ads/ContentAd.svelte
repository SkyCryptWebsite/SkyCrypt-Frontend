<script lang="ts">
  import { dev } from "$app/env";
  import { page } from "$app/state";
  import { cn } from "$utils";
  import { AD_REPORT } from "#lib/shared/ads";
  import { getAdFree } from "#lib/shared/ads.remote";

  let { id }: { id: string } = $props();

  // Unfilled and blocked placements fire no render event, so the holder stays collapsed until an ad arrives.
  let filled = $state(false);

  // NitroPay picks from these by the holder's rendered width. Capped at 100px tall to match the stats layout.
  function createAd(node: HTMLElement) {
    filled = false;
    const onRendered = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string; adInfo?: { bidder?: string } }>).detail;
      if (detail?.id === node.id) filled = detail.adInfo?.bidder !== "blank";
    };
    document.addEventListener("nitroAds.rendered", onRendered);
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
    return () => document.removeEventListener("nitroAds.rendered", onRendered);
  }
</script>

<svelte:boundary>
  {#snippet failed()}{/snippet}
  {#if !(await getAdFree())}
    <!-- Recreated per profile, as NitroPay asks of SPAs; params rather than the URL so shallow rewrites don't count. -->
    {#key `${page.route.id}${JSON.stringify(page.params)}`}
      <div
        {id}
        class={cn("flex items-center justify-center", filled ? "min-h-24" : "h-0 min-h-0! overflow-hidden")}
        {@attach createAd}>
      </div>
    {/key}
  {/if}
</svelte:boundary>
