<script lang="ts">
  import { getInternalState } from "$ctx";
  import type { ThemeV3 } from "$lib/shared/themes/schema";
  import { getThemeShareURL } from "$lib/shared/themes/sharing";
  import RotateCcw from "@lucide/svelte/icons/rotate-ccw";
  import Save from "@lucide/svelte/icons/save";
  import Share2 from "@lucide/svelte/icons/share-2";
  import X from "@lucide/svelte/icons/x";
  import { Button, Label } from "bits-ui";
  import { toast } from "svelte-sonner";

  let {
    workingTheme = $bindable(),
    onReset,
    onSave,
    handleNameChange,
    handleAuthorChange
  } = $props<{
    workingTheme: ThemeV3;
    onReset: () => void;
    onSave: () => void;
    handleNameChange: (name: string) => void;
    handleAuthorChange: (author: string) => void;
  }>();

  const internalState = getInternalState();

  function handleClose() {
    internalState.themeEditorOpen = false;
  }

  async function handleShare() {
    const url = await getThemeShareURL(workingTheme);
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Theme URL copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error("Failed to copy URL. Check console for details.");
    }
  }
</script>

<div class="flex flex-col gap-4 bg-header p-4">
  <div class="flex items-center justify-between">
    <h2 class="text-xl font-bold text-text">Theme Editor</h2>
    <Button.Root onclick={handleClose} class="rounded-lg bg-background/20 p-2 text-text hover:bg-background/30 focus:ring-2 focus:ring-link focus:ring-offset-2 focus:outline-none">
      <X class="size-5" />
    </Button.Root>
  </div>

  <div class="grid grid-cols-2 gap-4">
    <div class="flex flex-col gap-2">
      <Label.Root for="theme-name" class="text-xs font-bold text-text/60 uppercase">Theme Name</Label.Root>
      <input id="theme-name" type="text" value={(workingTheme as ThemeV3).metadata.name} class="rounded-lg border border-text/10 bg-text/5 px-3 py-2 text-sm text-text placeholder:text-text/40 focus:border-link focus:outline-none" placeholder="My Cool Theme" autocomplete="off" oninput={(e) => handleNameChange((e.target as HTMLInputElement).value)} />
    </div>
    <div class="flex flex-col gap-2">
      <Label.Root for="theme-author" class="text-xs font-bold text-text/60 uppercase">Author</Label.Root>
      <input id="theme-author" type="text" value={(workingTheme as ThemeV3).metadata.author} class="rounded-lg border border-text/10 bg-text/5 px-3 py-2 text-sm text-text placeholder:text-text/40 focus:border-link focus:outline-none" placeholder="Your Name" autocomplete="off" oninput={(e) => handleAuthorChange((e.target as HTMLInputElement).value)} />
    </div>
  </div>

  <div class="flex gap-2">
    <Button.Root onclick={onSave} class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-icon/90 px-4 py-2 font-bold transition-transform hover:bg-icon active:scale-95">
      <Save class="size-4" />
      Save Theme
    </Button.Root>
    <Button.Root onclick={handleShare} title="Copy Share URL" class="flex items-center justify-center rounded-lg bg-text/10 px-3 py-2 text-text transition-transform hover:bg-text/20 active:scale-95 ">
      <Share2 class="size-4" />
    </Button.Root>
    <Button.Root onclick={onReset} title="Reset Changes" class="flex items-center justify-center rounded-lg bg-red-500/10 px-3 py-2 text-red-400 transition-transform hover:bg-red-500/20 active:scale-95">
      <RotateCcw class="size-4" />
    </Button.Root>
  </div>
</div>
