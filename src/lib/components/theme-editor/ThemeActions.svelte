<script lang="ts">
  import { getInternalState } from "$ctx";
  import type { ThemeV3 } from "$lib/shared/themes/schema";
  import { getThemeShareURL } from "$lib/shared/themes/sharing";
  import RotateCcw from "@lucide/svelte/icons/rotate-ccw";
  import Save from "@lucide/svelte/icons/save";
  import Share2 from "@lucide/svelte/icons/share-2";
  import X from "@lucide/svelte/icons/x";
  import { Button, Label } from "bits-ui";

  let { workingTheme, onReset, onSave } = $props<{
    workingTheme: ThemeV3;
    onReset: () => void;
    onSave: () => void;
  }>();

  const internalState = getInternalState();

  async function handleShare() {
    const url = await getThemeShareURL(workingTheme);
    try {
      await navigator.clipboard.writeText(url);
      alert("Theme URL copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      alert("Failed to copy URL. Check console for details.");
    }
  }

  function handleClose() {
    internalState.themeEditorOpen = false;
  }
</script>

<div class="flex flex-col gap-4 border-b border-text/10 bg-background/50 p-4 backdrop-blur-md">
  <div class="flex items-center justify-between">
    <h2 class="text-xl font-bold text-text">Theme Editor</h2>
    <Button.Root onclick={handleClose} class="rounded-lg p-2 text-text/60 hover:bg-text/5 hover:text-text">
      <X class="size-5" />
    </Button.Root>
  </div>

  <div class="grid grid-cols-2 gap-4">
    <div class="flex flex-col gap-2">
      <Label.Root for="theme-name" class="text-xs font-bold text-text/60 uppercase">Theme Name</Label.Root>
      <input id="theme-name" type="text" bind:value={workingTheme.name} class="rounded-lg border border-text/10 bg-text/5 px-3 py-2 text-sm text-text placeholder:text-text/40 focus:border-link focus:outline-none" placeholder="My Cool Theme" />
    </div>
    <div class="flex flex-col gap-2">
      <Label.Root for="theme-author" class="text-xs font-bold text-text/60 uppercase">Author</Label.Root>
      <input id="theme-author" type="text" bind:value={workingTheme.author} class="rounded-lg border border-text/10 bg-text/5 px-3 py-2 text-sm text-text placeholder:text-text/40 focus:border-link focus:outline-none" placeholder="Your Name" />
    </div>
  </div>

  <div class="flex gap-2">
    <Button.Root onclick={onSave} class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-link px-4 py-2 font-bold text-background transition-transform active:scale-95">
      <Save class="size-4" />
      Save Theme
    </Button.Root>
    <Button.Root onclick={handleShare} title="Copy Share URL" class="flex items-center justify-center rounded-lg bg-text/10 px-3 py-2 text-text transition-colors hover:bg-text/20 active:scale-95">
      <Share2 class="size-4" />
    </Button.Root>
    <Button.Root onclick={onReset} title="Reset Changes" class="flex items-center justify-center rounded-lg bg-red-500/10 px-3 py-2 text-red-400 transition-colors hover:bg-red-500/20 active:scale-95">
      <RotateCcw class="size-4" />
    </Button.Root>
  </div>
</div>
