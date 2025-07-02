<script lang="ts">
  import { browser } from "$app/environment";
  import { performanceMode } from "$lib/stores/preferences";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";

  const THRESHOLD = 45;
  let fps = 60;
  let rafId: number;

  let frameCount = 0;
  let lastTime = 0;
  let shownToast = $state(false);
  let lowFpsStreak = 0;

  // Start measuring FPS once component mounts
  onMount(() => {
    if (browser) {
      lastTime = performance.now();
      rafId = requestAnimationFrame(measure);
    }
    return () => {
      if (browser && rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  });

  function measure(now: number) {
    frameCount++;
    const delta = now - lastTime;

    if (delta >= 1000) {
      fps = Math.round((frameCount * 1000) / delta);
      frameCount = 0;
      lastTime = now;

      if (fps < THRESHOLD) {
        lowFpsStreak++;
        if (lowFpsStreak >= 2 && !shownToast) {
          activatePerformanceMode();
        }
      } else {
        lowFpsStreak = 0;
      }
    }

    rafId = requestAnimationFrame(measure);
  }

  function activatePerformanceMode() {
    if (shownToast) return; // Prevent multiple toasts
    toast.warning("Low Performance Detected", {
      id: "low-performance",
      description: "We've detected low performance on your device. Would you like to enable Performance Mode?",
      action: {
        label: "Enable",
        onClick: () => {
          performanceMode.set(true);
        }
      },
      duration: Number.POSITIVE_INFINITY
    });
    shownToast = true;
  }

  // Expose FPS for UI or metrics
</script>
