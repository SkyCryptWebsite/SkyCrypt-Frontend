<script lang="ts">
  import { changeTheme, getTheme, getInternalState } from "$ctx";
  import { SettingsTab } from "$lib/components/header/types";
  import { getThemeIcons } from "$lib/shared/api/themes.remote";
  import { getThemeShareURL } from "$lib/shared/themes/sharing";
  import { FIRST_PARTY_THEMES } from "$lib/shared/themes/first-party";
  import Check from "@lucide/svelte/icons/check";
  import Edit from "@lucide/svelte/icons/edit-2";
  import Link2 from "@lucide/svelte/icons/link-2";
  import PaintBucket from "@lucide/svelte/icons/paint-bucket";
  import Plus from "@lucide/svelte/icons/plus";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import { Avatar, Button, Dialog, Label, RadioGroup, Tabs } from "bits-ui";
  import { flushSync } from "svelte";

  const themeContext = getTheme();
  const internalState = getInternalState();

  let deleteDialogOpen = $state(false);
  let themeToDelete = $state<string | null>(null);

  function confirmDelete(themeId: string): void {
    themeToDelete = themeId;
    deleteDialogOpen = true;
  }

  function handleDelete(): void {
    if (themeToDelete) {
      themeContext.deleteTheme(themeToDelete);
      deleteDialogOpen = false;
      themeToDelete = null;
    }
  }

  async function shareTheme(themeId: string): Promise<void> {
    const theme = themeContext.allThemes.find((t) => t.id === themeId);
    if (!theme) return;

    const url = await getThemeShareURL(theme);
    try {
      await navigator.clipboard.writeText(url);
      // Toast notification
      alert("Theme URL copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  }

  function openThemeEditor(themeId?: string): void {
    internalState.themeEditorId = themeId || null;
    internalState.themeEditorOpen = true;
    internalState.settingsOpen = false; // Close settings modal
  }
</script>

<Tabs.Content value={SettingsTab.Themes}>
  <div class="flex items-start gap-2 rounded-lg p-2 font-semibold">
    <PaintBucket class="size-5 h-lh shrink-0" />
    <div>
      <h4>Themes</h4>

      <p class="text-text/60">Themes change the colors of SkyCrypt.</p>
    </div>
  </div>

  <Button.Root onclick={() => openThemeEditor()} class="mt-4 rounded-lg bg-icon px-4 py-2 font-semibold text-text transition-colors hover:bg-icon/80">
    <Plus class="size-4" />
    Create Theme
  </Button.Root>

  <RadioGroup.Root
    class="mt-4 flex max-h-96 flex-col gap-4 overflow-x-clip overflow-y-auto"
    bind:value={themeContext.current}
    onValueChange={(v) => {
      if (!document.startViewTransition) changeTheme(v, themeContext);
      document.startViewTransition(() => {
        flushSync(() => changeTheme(v, themeContext));
      });
    }}>
    <h5 class="text-sm font-semibold text-text/60">First Party</h5>
    {#each FIRST_PARTY_THEMES as theme (theme.id)}
      {#await getThemeIcons({ color: theme.colors.logo, invert: theme.light }) then iconSvg}
        {@const iconDataUrl = `data:image/svg+xml;base64,${btoa(iconSvg)}`}
        <Label.Root for={theme.id} class="flex items-center justify-between gap-4 rounded-lg bg-text/5 p-2">
          <div class="flex items-center gap-2">
            <Avatar.Root class="shrink-0 select-none">
              <Avatar.Image loading="lazy" src={iconDataUrl} alt={theme.name} class="pointer-events-none aspect-square size-10 h-full rounded-lg select-none"></Avatar.Image>
              <Avatar.Fallback class="flex items-center rounded-lg text-center font-semibold uppercase">{theme.name.slice(0, 2)}</Avatar.Fallback>
            </Avatar.Root>
            <div class="flex flex-col">
              <h4 class="font-semibold text-text/90">{theme.name}</h4>
              <p class="overflow-hidden font-normal text-ellipsis whitespace-nowrap text-text/60">
                by
                <span class="text-text/80">{theme.author}</span>
              </p>
            </div>
          </div>
          <RadioGroup.Item id={theme.id} value={theme.id} class="group inline-flex h-6 min-h-6 w-10 shrink-0 cursor-pointer items-center rounded-full px-0 transition-colors ease-out">
            <Check class="size-6 text-icon group-data-[state=unchecked]:invisible" />
          </RadioGroup.Item>
        </Label.Root>
      {/await}
    {/each}

    <h5 class="mt-4 text-sm font-semibold text-text/60">My Themes</h5>
    {#if themeContext.userThemes.length === 0}
      <p class="text-text/40 italic">No custom themes yet. Create one!</p>
    {:else}
      {#each themeContext.userThemes as theme (theme.id)}
        {#await getThemeIcons({ color: theme.colors.logo, invert: theme.light }) then iconSvg}
          {@const iconDataUrl = `data:image/svg+xml;base64,${btoa(iconSvg)}`}
          <Label.Root for={theme.id} class="flex items-center justify-between gap-2 rounded-lg bg-text/5 p-2">
            <div class="flex items-center gap-2">
              <Avatar.Root class="shrink-0 select-none">
                <Avatar.Image loading="lazy" src={iconDataUrl} alt={theme.name} class="pointer-events-none aspect-square size-10 h-full rounded-lg select-none"></Avatar.Image>
                <Avatar.Fallback class="flex items-center rounded-lg text-center font-semibold uppercase">{theme.name.slice(0, 2)}</Avatar.Fallback>
              </Avatar.Root>
              <div class="flex flex-col">
                <h4 class="font-semibold text-text/90">{theme.name}</h4>
                <p class="overflow-hidden font-normal text-ellipsis whitespace-nowrap text-text/60">
                  by
                  <span class="text-text/80">{theme.author}</span>
                </p>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <RadioGroup.Item id={theme.id} value={theme.id} class="group inline-flex h-6 min-h-6 w-10 shrink-0 cursor-pointer items-center rounded-full px-0 transition-colors ease-out">
                <Check class="size-6 text-icon group-data-[state=unchecked]:invisible" />
              </RadioGroup.Item>

              <button title="Edit theme" onclick={() => openThemeEditor(theme.id)} class="rounded p-1.5 transition-colors hover:bg-icon/20" aria-label="Edit theme">
                <Edit class="size-4" />
              </button>

              <button title="Share theme" onclick={() => shareTheme(theme.id)} class="rounded p-1.5 transition-colors hover:bg-icon/20" aria-label="Share theme">
                <Link2 class="size-4" />
              </button>

              <button title="Delete theme" onclick={() => confirmDelete(theme.id)} class="rounded p-1.5 transition-colors hover:bg-icon/20" aria-label="Delete theme">
                <Trash2 class="size-4" />
              </button>
            </div>
          </Label.Root>
        {/await}
      {/each}
    {/if}
  </RadioGroup.Root>
</Tabs.Content>

<Dialog.Root bind:open={deleteDialogOpen}>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50" />
    <Dialog.Content class="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-text/10 bg-background p-6 shadow-xl">
      <Dialog.Title class="text-lg font-semibold text-text">Delete Theme?</Dialog.Title>
      <Dialog.Description class="mt-2 text-sm text-text/60">This action cannot be undone. The theme will be permanently removed from your library.</Dialog.Description>

      <div class="mt-6 flex gap-3">
        <Button.Root onclick={() => (deleteDialogOpen = false)} class="flex-1 rounded-lg border border-text/20 bg-text/5 px-4 py-2 font-semibold text-text transition-colors hover:bg-text/10">Cancel</Button.Root>
        <Button.Root onclick={handleDelete} class="flex-1 rounded-lg bg-red-500/20 px-4 py-2 font-semibold text-red-400 transition-colors hover:bg-red-500/30">Delete</Button.Root>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
