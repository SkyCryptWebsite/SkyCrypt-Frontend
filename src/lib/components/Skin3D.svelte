<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import { cn } from "$lib/shared/utils";
  import ky from "ky";
  import * as skinview3d from "skinview3d";
  import { onDestroy } from "svelte";

  const ctx = getProfileCtx();
  const uuid = $derived(ctx.profile.uuid);

  let { class: className }: { class: string | undefined } = $props();
  let viewer = $state<skinview3d.SkinViewer>();
  let minecraftAvatar = $state<HTMLCanvasElement>();
  let canvasIsLoading = $state<boolean>(true);
  let loadedUuid = "";

  const FIXED_WIDTH = 500;
  const FIXED_HEIGHT = 1000;

  function updateViewerSize() {
    if (minecraftAvatar && minecraftAvatar.parentElement && viewer) {
      viewer.setSize(minecraftAvatar.parentElement.clientWidth, window.innerHeight);
    }
  }

  const updateSkinViewer = async (uuid: string) => {
    if (loadedUuid === uuid) return;
    canvasIsLoading = true;

    const cape = await ky.head(`https://crafatar.com/capes/${uuid}`).catch(() => ({ ok: false }));

    if (!viewer) {
      viewer = new skinview3d.SkinViewer({
        canvas: minecraftAvatar,
        width: FIXED_WIDTH,
        height: FIXED_HEIGHT,
        animation: new skinview3d.IdleAnimation(),
        preserveDrawingBuffer: true
      });
    }

    await viewer.loadSkin(`https://crafatar.com/skins/${uuid}`);
    if (cape.ok) {
      await viewer.loadCape(`https://crafatar.com/capes/${uuid}`);
    } else {
      viewer.resetCape();
    }

    viewer.camera.position.set(-18, -3, 78);
    viewer.controls.enableZoom = false;
    viewer.controls.enablePan = true;
    viewer.controls.enableRotate = true;
    viewer.canvas.removeAttribute("tabindex");

    canvasIsLoading = false;
  };

  $effect.pre(() => {
    updateSkinViewer(uuid);
    updateViewerSize();
    return () => viewer?.dispose();
  });

  onDestroy(() => {
    viewer?.dispose();
  });
</script>

<svelte:window onresize={updateViewerSize} />

<canvas bind:this={minecraftAvatar} class={cn("size-full transform-gpu overflow-hidden opacity-0 transition-opacity duration-[3s] data-[loading=false]:opacity-100 data-[loading=true]:opacity-0", className)} data-loading={canvasIsLoading}></canvas>
