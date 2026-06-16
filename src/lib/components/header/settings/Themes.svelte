<script lang="ts">
  import { getInternalState, getTheme } from "$ctx";
  import { SettingsTab } from "$lib/components/header/types";
  import { getThemeIcons } from "$lib/shared/api/themes.remote";
  import { FIRST_PARTY_THEMES } from "$lib/shared/themes/first-party";
  import { getThemeShareURL } from "$lib/shared/themes/sharing";
  import { flyAndScale } from "$lib/shared/utils";
  import Check from "@lucide/svelte/icons/check";
  import Edit from "@lucide/svelte/icons/edit-2";
  import Link2 from "@lucide/svelte/icons/link-2";
  import PaintBucket from "@lucide/svelte/icons/paint-bucket";
  import Plus from "@lucide/svelte/icons/plus";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import { Avatar, Button, Dialog, Label, RadioGroup, Tabs } from "bits-ui";
  import { toast } from "svelte-sonner";

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
    const theme = themeContext.allThemes.find((t) => t.metadata.id === themeId);
    if (!theme) return;

    const url = await getThemeShareURL(theme);
    try {
      await navigator.clipboard.writeText(url);
      // Toast notification
      toast.success("Theme URL copied to clipboard!");
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
    <div class="flex items-start gap-2 rounded-lg p-2 font-semibold">
      <PaintBucket class="size-5 h-lh shrink-0" />
      <div>
        <h4>Themes</h4>
        <p class="text-text/60">Themes change the colors of SkyCrypt.</p>
      </div>
    </div>
  </div>

  <RadioGroup.Root class="mt-4 flex max-h-96 flex-col gap-4 overflow-x-clip overflow-y-auto" bind:value={themeContext.current}>
    <h5 class="text-sm font-semibold text-text/60">Official Themes</h5>
    {#each FIRST_PARTY_THEMES as theme (theme.metadata.id)}
      {#await getThemeIcons({ color: theme.colors.logo, invert: theme.light }) then iconSvg}
        {const iconDataUrl = `data:image/svg+xml;base64,${btoa(iconSvg)}`}
        <Label.Root for={theme.metadata.id} class="flex items-center justify-between gap-4 rounded-lg bg-text/5 p-2">
          <div class="flex items-center gap-2">
            <Avatar.Root class="shrink-0 select-none">
              <Avatar.Image loading="lazy" src={iconDataUrl} alt={theme.metadata.name} class="pointer-events-none aspect-square size-10 h-full rounded-lg select-none"></Avatar.Image>
              <Avatar.Fallback class="flex items-center rounded-lg text-center font-semibold uppercase">{theme.metadata.name.slice(0, 2)}</Avatar.Fallback>
            </Avatar.Root>
            <div class="flex flex-col">
              <h4 class="font-semibold text-text/90">{theme.metadata.name}</h4>
              <p class="overflow-hidden font-normal text-ellipsis whitespace-nowrap text-text/60">
                by
                <span class="text-text/80">{theme.metadata.author}</span>
              </p>
            </div>
          </div>
          <RadioGroup.Item id={theme.metadata.id} value={theme.metadata.id} class="group inline-flex h-6 min-h-6 w-10 shrink-0 cursor-pointer items-center rounded-full px-0 transition-colors ease-out">
            <Check class="size-6 text-icon group-data-[state=unchecked]:invisible" />
          </RadioGroup.Item>
        </Label.Root>
      {/await}
    {/each}

    <Button.Root onclick={() => openThemeEditor()} class="group mt-4 flex items-center gap-1 rounded-lg text-sm font-semibold text-text/60 transition-colors">
      <h5>My Themes</h5>
      <Plus class="size-5 rounded-md bg-text/10 p-0.5 transition-colors group-hover:bg-icon/80" />
    </Button.Root>

    {#if themeContext.userThemes.length === 0}
      <p class="text-text/40 italic">No custom themes yet. Create your own theme or import one from the community!</p>
    {:else}
      {#each themeContext.userThemes as theme (theme.metadata.id)}
        {#await getThemeIcons({ color: theme.colors?.logo, invert: theme.light }) then iconSvg}
          {const iconDataUrl = `data:image/svg+xml;base64,${btoa(iconSvg)}`}
          <Label.Root for={theme.metadata.id} class="flex items-center justify-between gap-2 rounded-lg bg-text/5 p-2">
            <div class="flex items-center gap-2">
              <Avatar.Root class="shrink-0 select-none">
                <Avatar.Image loading="lazy" src={iconDataUrl} alt={theme.metadata.name} class="pointer-events-none aspect-square size-10 h-full rounded-lg select-none"></Avatar.Image>
                <Avatar.Fallback class="flex items-center rounded-lg text-center font-semibold uppercase">{theme.metadata.name.slice(0, 2)}</Avatar.Fallback>
              </Avatar.Root>
              <div class="flex flex-col">
                <h4 class="font-semibold text-text/90">{theme.metadata.name}</h4>
                <p class="overflow-hidden font-normal text-ellipsis whitespace-nowrap text-text/60">
                  by
                  <span class="text-text/80">{theme.metadata.author}</span>
                </p>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <RadioGroup.Item id={theme.metadata.id} value={theme.metadata.id} class="group inline-flex h-6 min-h-6 w-10 shrink-0 cursor-pointer items-center rounded-full px-0 transition-colors ease-out">
                <Check class="size-6 text-icon group-data-[state=unchecked]:invisible" />
              </RadioGroup.Item>

              <Button.Root title="Edit theme" onclick={() => openThemeEditor(theme.metadata.id)} class="rounded p-1.5 transition-colors hover:bg-text/10" aria-label="Edit theme">
                <Edit class="size-4" />
              </Button.Root>

              <Button.Root title="Share theme" onclick={() => shareTheme(theme.metadata.id)} class="rounded p-1.5 transition-colors hover:bg-text/10" aria-label="Share theme">
                <Link2 class="size-4" />
              </Button.Root>

              <Button.Root title="Delete theme" onclick={() => confirmDelete(theme.metadata.id)} class="rounded p-1.5 transition-colors hover:bg-text/10" aria-label="Delete theme">
                <Trash2 class="size-4" />
              </Button.Root>
            </div>
          </Label.Root>
        {/await}
      {/each}
    {/if}
  </RadioGroup.Root>
</Tabs.Content>

<Dialog.Root bind:open={deleteDialogOpen}>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-50 bg-background-lore" />
    <Dialog.Content forceMount class="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background-grey p-6 shadow-xl">
      {#snippet child({ open, props })}
        {#if open}
          <div {...props} transition:flyAndScale>
            <Dialog.Title class="text-lg font-semibold text-text">Delete Theme?</Dialog.Title>
            <Dialog.Description class="mt-2 text-sm text-text/60">This action cannot be undone. The theme will be permanently removed from your library.</Dialog.Description>

            <div class="mt-6 flex gap-3">
              <Button.Root onclick={() => (deleteDialogOpen = false)} class="flex-1 rounded-lg bg-text/10 px-4 py-2 font-semibold text-text transition-colors hover:bg-text/5">Cancel</Button.Root>
              <Button.Root onclick={handleDelete} class="flex-1 rounded-lg bg-red-500/20 px-4 py-2 font-semibold text-red-400 transition-colors hover:bg-red-500/30">Delete</Button.Root>
            </div>
          </div>
        {/if}
      {/snippet}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
