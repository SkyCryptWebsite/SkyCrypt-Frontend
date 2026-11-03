<script lang="ts">
  import { dev } from "$app/env";
  import { PUBLIC_PATREON } from "$app/env/public";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { adBlock, detectNitroBlock } from "#lib/shared/ads.svelte";

  // Rails would cover the full-width stats layout; NitroPay's collision check doesn't catch it.
  let { rails = true }: { rails?: boolean } = $props();

  // These formats render without a holder div. NitroPay puts the placement id on the ad and `className` on rail wrappers; both are removed when leaving ad pages.
  const AD_CLASS = "skycrypt-ad";
  const report = { enabled: true, icon: true, wording: "Report Ad", position: "top-right" };
  const railOptions = {
    format: "rail",
    className: AD_CLASS,
    // Pages cap content at 1088px, so a 320px rail plus spacing fits in the gutter from here.
    mediaQuery: "(min-width: 1768px)",
    sizes: [
      [160, 600],
      [300, 600],
      [320, 480],
      [300, 250]
    ],
    // Keep rails below the fixed 3rem header.
    railOffsetTop: 64,
    railStickyTop: 64,
    report
  };
  const placements: [string, Record<string, unknown>][] = [
    [
      "skycrypt-anchor",
      {
        format: "anchor",
        anchor: "bottom",
        anchorClose: true,
        // Without a media query NitroPay only shows the anchor on mobile.
        mediaQuery: "(min-width: 0px)",
        className: AD_CLASS,
        sizes: [
          [728, 90],
          [970, 90],
          [320, 50],
          [320, 100]
        ],
        report
      }
    ],
    ["skycrypt-video", { format: "floating", className: AD_CLASS }]
  ];
  const railPlacements: [string, Record<string, unknown>][] = [
    ["skycrypt-rail-left", { ...railOptions, rail: "left" }],
    ["skycrypt-rail-right", { ...railOptions, rail: "right" }]
  ];
  const BLOCK_NOTICE_KEY = "skycryptAdBlockNoticeShown";

  onMount(() => {
    let destroyed = false;
    const active = rails ? [...placements, ...railPlacements] : placements;
    Promise.all(active.map(([id, options]) => window.nitroAds.createAd(id, { ...options, demo: dev }))).then(() => {
      if (destroyed) removeAds(active);
    });

    detectNitroBlock().then((blocked) => {
      // The layout remounts this on every navigation; report a blocker once per page load.
      if (!blocked || destroyed || adBlock.detected) return;
      adBlock.detected = true;
      if (typeof umami !== "undefined") umami.track("adblock-detected");
      showBlockNotice();
    });

    document.addEventListener("nitroAds.rendered", trackImpression);

    return () => {
      destroyed = true;
      document.removeEventListener("nitroAds.rendered", trackImpression);
      removeAds(active);
    };
  });

  // `adInfo` isn't in NitroPay's API docs; these fields come from their ads script.
  type RenderedEvent = CustomEvent<{
    adInfo?: { adUnitCode?: string; bidder?: string; cpm?: number; width?: number; height?: number };
  }>;

  function trackImpression(event: Event) {
    const info = (event as RenderedEvent).detail?.adInfo;
    if (!info?.cpm || info.bidder === "blank" || typeof umami === "undefined") return;
    umami.track("ad-impression", {
      revenue: info.cpm / 1000,
      currency: "USD",
      placement: info.adUnitCode ?? "unknown",
      bidder: info.bidder ?? "unknown",
      size: `${info.width}x${info.height}`
    });
  }

  // NitroPay frees a placement's resources once its element leaves the DOM.
  function removeAds(active: typeof placements) {
    const selector = [`.${AD_CLASS}`, ...active.map(([id]) => `#${id}`)].join(",");
    for (const el of document.querySelectorAll(selector)) el.remove();
  }

  function showBlockNotice() {
    try {
      if (sessionStorage.getItem(BLOCK_NOTICE_KEY)) return;
      sessionStorage.setItem(BLOCK_NOTICE_KEY, "1");
    } catch {
      // Storage can be unavailable; showing the notice again is harmless.
    }
    toast.info("Ads keep SkyCrypt free", {
      id: "adblock-notice",
      description:
        "SkyCrypt is free and has no paywalls. Please allow ads on sky.shiiyu.moe, or support us on Patreon to remove them.",
      duration: 15000,
      action: {
        label: "Patreon",
        onClick: () => {
          if (typeof umami !== "undefined") umami.track("adblock-patreon-click", { source: "toast" });
          window.open(PUBLIC_PATREON, "_blank", "noopener");
        }
      }
    });
  }
</script>
