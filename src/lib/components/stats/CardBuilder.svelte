<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { getHoverContext, getPreferences } from "$ctx";
  import { cardPresets, type CardPreset } from "$lib/components/cards";
  import { getDefaults, settingsToParams } from "$lib/components/cards/default/schema";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import ClipboardIcon from "@lucide/svelte/icons/clipboard";
  import CodeXmlIcon from "@lucide/svelte/icons/code-xml";
  import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
  import IdCardIcon from "@lucide/svelte/icons/id-card";
  import LoaderCircleIcon from "@lucide/svelte/icons/loader-circle";
  import RotateCcwIcon from "@lucide/svelte/icons/rotate-ccw";
  import { Avatar, Button, Collapsible, Dialog, Label, Switch, type AvatarImageLoadingStatus } from "bits-ui";
  import { Debounced } from "runed";
  import { toast } from "svelte-sonner";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import { Drawer } from "vaul-svelte";

  type TriggerProps = Record<string, unknown>;

  const preferences = getPreferences();
  const isHover = getHoverContext();

  let selectedPreset = $state<CardPreset>(cardPresets[0]);
  // svelte-ignore state_referenced_locally
  let settings = $state<Record<string, boolean | string | number>>(getDefaults(selectedPreset.schema));

  const imageUrl = $derived.by(() => {
    const base =
      page.url.origin +
      resolve("/stats/[ign]/[[profile]]/card", {
        ign: page.params.ign ?? "",
        profile: page.params.profile ?? ""
      });
    const params = settingsToParams(settings, selectedPreset.schema);
    const search = params.toString();
    return search ? `${base}?${search}` : base;
  });

  const debouncedUrl = new Debounced(() => imageUrl, 2000);
  let loadingStatus: AvatarImageLoadingStatus | undefined = $state("loading");
  const isImagePending = $derived(loadingStatus === "loading" || debouncedUrl.pending);

  function selectPreset(presetId: string) {
    const preset = cardPresets.find((p) => p.id === presetId);
    if (preset) {
      selectedPreset = preset;
      settings = getDefaults(preset.schema);
      loadingStatus = "loading";
    }
  }

  function updateSetting(key: string, value: boolean | string | number) {
    settings[key] = value;
    loadingStatus = "loading";
  }

  function resetToDefaults() {
    settings = getDefaults(selectedPreset.schema);
    loadingStatus = "loading";
  }

  async function copyImageUrl() {
    toast.promise(navigator.clipboard.writeText(imageUrl), {
      loading: "Copying image URL...",
      success: "Image URL copied to clipboard!",
      error: "Failed to copy image URL."
    });
  }

  async function copyBBCode() {
    const profileUrl =
      page.url.origin +
      resolve("/stats/[ign]/[[profile]]", {
        ign: page.params.ign ?? "",
        profile: page.params.profile ?? ""
      });
    const cacheBuster = imageUrl.includes("?") ? `&i=${Date.now()}` : `?i=${Date.now()}`;
    const bbCode = `[URL='${profileUrl}'][IMG]${imageUrl}${cacheBuster}[/IMG][/URL]`;

    toast.promise(navigator.clipboard.writeText(bbCode), {
      loading: "Copying BBCode...",
      success: "BBCode copied to clipboard!",
      error: "Failed to copy BBCode."
    });
  }
</script>

{#snippet triggerButton(props: TriggerProps)}
  <Button.Root {...props} class="flex items-center justify-center gap-1.5 rounded-full bg-icon/90 px-2 py-1 font-semibold transition-opacity duration-150 ease-out hover:bg-icon">
    <IdCardIcon class="size-4" />
    Card
  </Button.Root>
{/snippet}

{#snippet presetCards()}
  <div class="flex flex-col gap-1.5">
    <Label.Root class="text-xs font-bold tracking-wider text-text/60 uppercase">Preset</Label.Root>
    <div class="flex gap-2">
      {#each cardPresets as preset (preset.id)}
        <Button.Root onclick={() => selectPreset(preset.id)} class={cn("flex flex-col gap-1.5 rounded-lg border-2 p-2 transition-all", selectedPreset.id === preset.id ? "border-icon bg-icon/10" : "border-text/10 bg-text/5 hover:border-text/20 hover:bg-text/10")}>
          <div class="flex h-10 w-28 items-stretch gap-1 rounded bg-text/5 p-1">
            <div class="w-1/4 rounded-sm bg-text/15"></div>
            <div class="flex flex-1 flex-col justify-between gap-px">
              <div class="h-1 w-3/4 rounded-full bg-text/20"></div>
              <div class="flex gap-0.5">
                <div class="h-1 flex-1 rounded-full bg-icon/30"></div>
                <div class="h-1 flex-1 rounded-full bg-icon/20"></div>
              </div>
              <div class="h-px w-full bg-text/10"></div>
              <div class="flex gap-px">
                {#each Array(5) as _, i (i)}
                  <div class="h-1 flex-1 rounded-full bg-icon/25"></div>
                {/each}
              </div>
              <div class="flex gap-px">
                {#each Array(2) as _, i (i)}
                  <div class="h-1 flex-1 rounded-full bg-icon/25"></div>
                {/each}
                {#each Array(3) as _, i (i)}
                  <div class="h-1 flex-1 rounded-full bg-icon/15"></div>
                {/each}
              </div>
              <div class="h-px w-full bg-text/10"></div>
              <div class="flex gap-px">
                {#each Array(5) as _, i (i)}
                  <div class="h-1 flex-1 rounded-full bg-icon/20"></div>
                {/each}
              </div>
              <div class="h-0.5 w-full rounded-full bg-text/10"></div>
            </div>
          </div>
          <span class="text-xs font-semibold text-text/70">{preset.name}</span>
        </Button.Root>
      {/each}
    </div>
  </div>
{/snippet}

{#snippet optionGroups()}
  {#each selectedPreset.schema as group (group.groupName)}
    <Collapsible.Root>
      <Collapsible.Trigger class="group flex w-full cursor-pointer items-center gap-1 py-1">
        <ChevronDown class="size-4 text-text/60 transition-transform duration-200 ease-out group-data-[state=open]:-rotate-180" />
        <h3 class="text-xs font-bold tracking-wider text-text/60 uppercase">{group.groupName}</h3>
      </Collapsible.Trigger>
      <Collapsible.Content class="flex flex-col gap-1.5 pt-1.5">
        {#each group.options as option (option.key)}
          {#if option.type === "checkbox"}
            <Label.Root for={option.key} class="flex cursor-pointer items-center justify-between rounded-lg bg-text/5 p-2.5">
              <span class="text-sm font-semibold text-text/90">{option.label}</span>
              <Switch.Root id={option.key} checked={settings[option.key] as boolean} class="peer inline-flex h-6 min-h-6 w-10 shrink-0 cursor-pointer items-center rounded-full px-0 transition-colors ease-out data-[state=checked]:bg-icon data-[state=unchecked]:bg-text/30" onCheckedChange={(checked) => updateSetting(option.key, checked)}>
                <Switch.Thumb class="pointer-events-none block size-4 shrink-0 rounded-full bg-text transition-transform ease-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-1" />
              </Switch.Root>
            </Label.Root>
          {:else if option.type === "color"}
            <Label.Root for={option.key} class="flex cursor-pointer items-center justify-between rounded-lg bg-text/5 p-2.5">
              <span class="text-sm font-semibold text-text/90">{option.label}</span>
              <input type="color" id={option.key} value={settings[option.key] as string} oninput={(e) => updateSetting(option.key, e.currentTarget.value)} class="size-8 cursor-pointer rounded-md border border-text/10 bg-transparent p-0.5" />
            </Label.Root>
          {:else if option.type === "text"}
            <Label.Root for={option.key} class="flex cursor-pointer items-center justify-between gap-4 rounded-lg bg-text/5 p-2.5">
              <span class="shrink-0 text-sm font-semibold text-text/90">{option.label}</span>
              <input type="text" id={option.key} value={settings[option.key] as string} oninput={(e) => updateSetting(option.key, e.currentTarget.value)} class="w-full max-w-40 rounded-md border border-text/10 bg-text/5 px-2 py-1 text-sm text-text focus:border-icon focus:outline-none" />
            </Label.Root>
          {:else if option.type === "number"}
            <Label.Root for={option.key} class="flex cursor-pointer items-center justify-between gap-4 rounded-lg bg-text/5 p-2.5">
              <span class="shrink-0 text-sm font-semibold text-text/90">{option.label}</span>
              <input type="number" id={option.key} value={settings[option.key] as number} oninput={(e) => updateSetting(option.key, Number(e.currentTarget.value))} class="w-full max-w-24 rounded-md border border-text/10 bg-text/5 px-2 py-1 text-sm text-text focus:border-icon focus:outline-none" />
            </Label.Root>
          {/if}
        {/each}
      </Collapsible.Content>
    </Collapsible.Root>
  {/each}
{/snippet}

{#snippet resetButton()}
  <button onclick={resetToDefaults} class="flex items-center justify-center gap-1.5 rounded-lg bg-text/10 p-2 text-sm font-semibold text-text/60 transition-colors hover:bg-text/20 hover:text-text/80">
    <RotateCcwIcon class="size-3.5" />
    Reset to Defaults
  </button>
{/snippet}

{#snippet imagePreview()}
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-bold tracking-wider text-text/60 uppercase">Preview</h3>
      <div class="flex items-center gap-1">
        <Button.Root onclick={copyImageUrl} class="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-text/60 transition-colors hover:bg-text/10 hover:text-text/80" title="Copy Image URL">
          <ClipboardIcon class="size-3" />
          URL
        </Button.Root>
        <Button.Root onclick={copyBBCode} class="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-text/60 transition-colors hover:bg-text/10 hover:text-text/80" title="Copy BBCode for Forums">
          <CodeXmlIcon class="size-3" />
          BBCode
        </Button.Root>
        <Button.Root href={resolve("/stats/[ign]/[[profile]]/card", { ign: page.params.ign ?? "", profile: page.params.profile ?? "" })} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-text/60 transition-colors hover:bg-text/10 hover:text-text/80" title="Open Image in New Tab">
          <ExternalLinkIcon class="size-3" />
          Image
        </Button.Root>
      </div>
    </div>
    <Avatar.Root class="relative w-full overflow-hidden rounded-lg bg-text/5" bind:loadingStatus>
      {#if isImagePending}
        <div class="absolute inset-0 z-10 flex items-center justify-center">
          <LoaderCircleIcon class="size-8 animate-spin text-text/40" />
        </div>
      {/if}
      <Avatar.Image src={debouncedUrl.current} class="w-full object-contain" />
      <Avatar.Fallback class="flex aspect-75/17 w-full items-center justify-center text-sm text-text/40">Card Preview</Avatar.Fallback>
    </Avatar.Root>
  </div>
{/snippet}

{#if isHover.current}
  <Dialog.Root>
    <Dialog.Trigger>
      {#snippet child({ props })}
        {@render triggerButton(props)}
      {/snippet}
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay forceMount class={cn("fixed inset-0 z-40", preferences.performanceMode ? "bg-background-lore" : "backdrop-blur-lg backdrop-brightness-50")}>
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:fade={{ duration: 150, easing: cubicOut }}></div>
          {/if}
        {/snippet}
      </Dialog.Overlay>
      <Dialog.Content forceMount class={cn("fixed top-[50%] left-[50%] z-50 flex max-h-[calc(96%-3rem)] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg p-6 font-icomoon select-text", preferences.performanceMode ? "bg-background-grey/95" : "bg-background-grey/30 backdrop-blur-lg backdrop-brightness-50")}>
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:flyAndScale>
              <div class="flex flex-col gap-4 overflow-y-auto">
                {@render presetCards()}
                {@render optionGroups()}
                {@render resetButton()}
                {@render imagePreview()}
              </div>
            </div>
          {/if}
        {/snippet}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
{:else}
  <Drawer.Root shouldScaleBackground={true} setBackgroundColorOnScale={false}>
    <Drawer.Trigger>
      {#snippet child({ props })}
        {@render triggerButton(props)}
      {/snippet}
    </Drawer.Trigger>
    <Drawer.Portal>
      <Drawer.Overlay class="fixed inset-0 z-40 bg-black/80" />
      <Drawer.Content class="fixed right-0 bottom-0 left-0 z-50 flex max-h-[96%] flex-col rounded-t-[10px] bg-background-lore">
        <div class="mx-auto w-full max-w-md overflow-auto p-6">
          <div class="flex flex-col gap-4">
            {@render presetCards()}
            {@render optionGroups()}
            {@render resetButton()}
            {@render imagePreview()}
          </div>
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
{/if}
