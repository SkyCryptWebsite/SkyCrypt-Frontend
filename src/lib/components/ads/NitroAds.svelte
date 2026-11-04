<script lang="ts" module>
  // The layout remounts this on every navigation; report a blocker once per page load.
  let blockReported = false;
</script>

<script lang="ts">
  import { dev } from "$app/env";
  import { onMount } from "svelte";
  import { AD_REPORT as report, detectNitroBlock } from "#lib/shared/ads";

  // Rails would cover the full-width stats layout; NitroPay's collision check doesn't catch it.
  let { rails = true }: { rails?: boolean } = $props();

  // These formats render without a holder div. NitroPay puts the placement id on the ad and `className` on rail wrappers; both are removed when leaving ad pages.
  const AD_CLASS = "skycrypt-ad";
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
    // Bottom-right is the default, where it covers toasts. `floating` isn't in NitroPay's docs; it comes from their ads script, which only applies its default 178x100 mobile size when `floating` is omitted.
    [
      "skycrypt-video",
      { format: "floating", className: AD_CLASS, floating: { position: "bottom-left", reduceMobileSize: true } }
    ]
  ];
  const railPlacements: [string, Record<string, unknown>][] = [
    ["skycrypt-rail-right", { ...railOptions, rail: "right" }]
  ];

  onMount(() => {
    let destroyed = false;
    const active = rails ? [...placements, ...railPlacements] : placements;
    Promise.all(active.map(([id, options]) => window.nitroAds.createAd(id, { ...options, demo: dev }))).then(() => {
      if (destroyed) removeAds(active);
    });

    detectNitroBlock().then((blocked) => {
      if (!blocked || destroyed || blockReported) return;
      blockReported = true;
      if (typeof umami !== "undefined") umami.track("adblock-detected");
    });

    document.addEventListener("nitroAds.rendered", trackImpression);
    document.addEventListener("nitroAds.anchorVisibility", reserveAnchorSpace);

    return () => {
      destroyed = true;
      document.removeEventListener("nitroAds.rendered", trackImpression);
      document.removeEventListener("nitroAds.anchorVisibility", reserveAnchorSpace);
      document.documentElement.style.removeProperty("--anchor-height");
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

  // NitroPay makes room for top anchors but lets bottom ones cover the footer. The event fires as the anchor
  // slides in or out (0.15s) and a closed anchor is removed 150ms later, so measure once that has settled.
  function reserveAnchorSpace() {
    setTimeout(() => {
      const anchor = document.getElementById("skycrypt-anchor");
      const covered = anchor?.isConnected ? Math.max(0, window.innerHeight - anchor.getBoundingClientRect().top) : 0;
      document.documentElement.style.setProperty("--anchor-height", `${covered}px`);
    }, 200);
  }

  // NitroPay frees a placement's resources once its element leaves the DOM.
  function removeAds(active: typeof placements) {
    const selector = [`.${AD_CLASS}`, ...active.map(([id]) => `#${id}`)].join(",");
    for (const el of document.querySelectorAll(selector)) el.remove();
  }
</script>
