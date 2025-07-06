<script lang="ts">
  import { browser } from "$app/environment";
  import { performanceMode } from "$lib/stores/preferences";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";

  const THRESHOLD = 45;
  const MIN_SAMPLES = 5; // Require more samples before triggering
  const SMOOTHING_FACTOR = 0.2; // For exponential moving average
  const INITIALIZATION_DELAY = 3000; // Wait 3 seconds after mount before detecting

  let fps = 60;
  let smoothedFps = 60;
  let rafId: number;
  let startTime = 0;

  let frameCount = 0;
  let lastTime = 0;
  let shownToast = $state(false);
  let lowFpsStreak = 0;
  let fpsHistory: number[] = [];

  // Start measuring FPS once component mounts
  onMount(() => {
    if (browser) {
      startTime = performance.now();
      lastTime = startTime;
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

      // Apply exponential moving average for smoothing
      smoothedFps = smoothedFps * (1 - SMOOTHING_FACTOR) + fps * SMOOTHING_FACTOR;

      // Add to history for trend analysis
      fpsHistory.push(fps);
      if (fpsHistory.length > 10) {
        fpsHistory.shift(); // Keep only last 10 samples
      }

      // Only start detecting after initialization period
      const timeSinceStart = now - startTime;
      if (timeSinceStart > INITIALIZATION_DELAY && fpsHistory.length >= MIN_SAMPLES) {
        checkPerformance();
      }
    }

    rafId = requestAnimationFrame(measure);
  }

  function checkPerformance() {
    // Calculate average of recent samples
    const recentAverage = fpsHistory.reduce((sum, fps) => sum + fps, 0) / fpsHistory.length;

    // Check if both current and smoothed FPS are consistently low
    const isConsistentlyLow = recentAverage < THRESHOLD && smoothedFps < THRESHOLD;

    // Count how many recent samples are below threshold
    const lowSamples = fpsHistory.filter((fps) => fps < THRESHOLD).length;
    const lowPercentage = lowSamples / fpsHistory.length;

    if (isConsistentlyLow && lowPercentage > 0.6) {
      // 60% of samples are low
      lowFpsStreak++;
      if (lowFpsStreak >= 3 && !shownToast) {
        // Require 3 consecutive low periods
        activatePerformanceMode();
      }
    } else {
      lowFpsStreak = 0; // Reset streak if performance improves
    }
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
