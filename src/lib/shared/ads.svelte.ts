export const AD_REPORT = { enabled: true, icon: true, wording: "Report Ad", position: "top-right" };

// Only written in the browser, after NitroPay's ad-block check.
export const adBlock = $state({ detected: false });

/** NitroPay's documented check: its tracking pixel fails to load three times in a row when blocked. */
export function detectNitroBlock(attempts = 3): Promise<boolean> {
  return new Promise((resolve) => {
    let errors = 0;
    const test = () => {
      const img = new Image();
      img.onload = () => resolve(false);
      img.onerror = () => {
        if (++errors < attempts) setTimeout(test, 250);
        else resolve(true);
      };
      img.src = `https://s.nitropay.com/1.gif?${Math.random()}&adslot=`;
    };
    test();
  });
}
