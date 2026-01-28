<script lang="ts" module>
  function toggleRainbow() {
    const show = rainbowEnchantments.current;
    if (show) {
      document.documentElement.dataset.rainbow = "true";
    } else {
      document.documentElement.dataset.rainbow = "false";
    }
  }
  export { toggleRainbow };
</script>

<script lang="ts">
  import { SettingsTab } from "$lib/components/header/types";
  import { sections } from "$lib/sections/constants";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { keybind, performanceMode, rainbowEnchantments, sectionOrderPreferences, showGlint } from "$lib/stores/preferences";
  import { wikiOrderPreferences } from "$lib/stores/wiki";
  import BookOpenText from "@lucide/svelte/icons/book-open-text";
  import CircleQuestionMark from "@lucide/svelte/icons/circle-question-mark";
  import Fan from "@lucide/svelte/icons/fan";
  import GripVertical from "@lucide/svelte/icons/grip-vertical";
  import Keyboard from "@lucide/svelte/icons/keyboard";
  import Rainbow from "@lucide/svelte/icons/rainbow";
  import Settings2 from "@lucide/svelte/icons/settings-2";
  import Sparkle from "@lucide/svelte/icons/sparkle";
  import { Button, Label, Separator, Switch, Tabs, Tooltip } from "bits-ui";
  import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import { cubicOut } from "svelte/easing";
  import { get } from "svelte/store";
  import { fade } from "svelte/transition";

  const initialWikiOrderPreferences = get(wikiOrderPreferences);

  let isListening = $state(false);
  let wikiOrder = $state(initialWikiOrderPreferences);

  const defaultSectionOrder = sections;
  const differsFromDefault = $derived(JSON.stringify(sectionOrderPreferences.connected) !== JSON.stringify(defaultSectionOrder));

  function handleKeybindKeydown(e: KeyboardEvent) {
    if (isListening) {
      e.preventDefault();
      e.stopPropagation();
      const key = e.key;
      if (key.length === 1 && key.match(/[a-zA-Z0-9/\\.,;'"`~!@#$%^&*()_+\-=[\]{}|:<>?]/)) {
        keybind.current = key;
        isListening = false;
      } else if (key === "Escape") {
        isListening = false;
        keybind.current = keybind.current || "/";
      }
    }
  }

  function handleKeybindClick() {
    isListening = true;
    setTimeout(() => {
      if (isListening) {
        isListening = false;
      }
    }, 5000);
  }
</script>

<Tabs.Content value={SettingsTab.Misc} class="space-y-6">
  <div class="flex max-h-96 flex-col gap-4 overflow-x-clip overflow-y-auto">
    <div class="space-y-4 rounded-lg bg-text/5 p-4">
      <div class="flex items-start gap-2 rounded-lg p-2 font-semibold">
        <Settings2 class="size-5 h-lh shrink-0" />
        <div>
          <h4>Misc Settings</h4>
          <div class="space-y-2">
            <p class="text-text/60">These settings affect various parts of SkyCrypt.</p>
            <p class="text-text/60">They are saved in your browser and will persist across sessions.</p>
          </div>
        </div>
      </div>
      <Label.Root for="performance" class="flex items-center justify-between gap-4 rounded-lg bg-text/5 p-2">
        <div class="flex items-start gap-2">
          <Fan class="size-6 h-lh shrink-0 will-change-transform data-[performance=false]:animate-spin-slow data-[performance=true]:animate-spin" data-performance={performanceMode.current} />
          <div class="flex flex-col">
            <Tooltip.Provider delayDuration={0}>
              <Tooltip.Root>
                <Tooltip.Trigger class="flex items-center gap-1">
                  <h4 class="font-semibold text-text/90">Performance Mode</h4>
                  <CircleQuestionMark class="size-4 h-lh text-text/60" />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content forceMount class={cn("z-50 flex w-full max-w-lg flex-col space-y-2 overflow-hidden rounded-lg p-4 select-text", performanceMode.current ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-50")}>
                    {#snippet child({ wrapperProps, props, open })}
                      {#if open}
                        <div {...wrapperProps}>
                          <div {...props} transition:flyAndScale>
                            <p>You might not need this! We've noticed that often the reason for low performance is due to Graphics Acceleration being disabled in the browser settings.</p>
                            <p>Harware Acceleration gives the browsers access to your GPU for rendering, which can significantly improve performance; especially with opacity and blur effects.</p>
                            <p>
                              Enable <a href="https://www.google.com/search?q=enable+graphics+acceleration+in+%5Bbrowser%5D" target="_blank" rel="noopener noreferrer" class="text-icon underline">Graphics Acceleration</a> in your browser settings first, and if you still experience performance issues, then consider enabling Performance Mode.
                            </p>
                            <Tooltip.Arrow />
                          </div>
                        </div>
                      {/if}
                    {/snippet}
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
            <p class="text-text/60">Disables blur, transparency and backdrop effects for better performance on low-end devices.</p>
          </div>
        </div>
        <Switch.Root id="performance" checked={performanceMode.current} class="peer inline-flex h-6 min-h-6 w-10 shrink-0 cursor-pointer items-center rounded-full px-0 transition-colors ease-out data-[state=checked]:bg-icon data-[state=unchecked]:bg-text/30" onCheckedChange={() => (performanceMode.current = !performanceMode.current)}>
          <Switch.Thumb class="pointer-events-none block size-4 shrink-0 rounded-full bg-text transition-transform ease-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-1" />
        </Switch.Root>
      </Label.Root>

      <Label.Root for="glint" class="flex items-center justify-between gap-4 rounded-lg bg-text/5 p-2">
        <div class="flex items-start gap-2">
          <Sparkle class="size-6 h-lh shrink-0" />
          <div class="flex flex-col">
            <h4 class="font-semibold text-text/90">Show Glint</h4>
            <p class="text-text/60">Show the enchantment glint effect on enchanted items.</p>
          </div>
        </div>
        <Switch.Root id="glint" checked={showGlint.current} class="peer inline-flex h-6 min-h-6 w-10 shrink-0 cursor-pointer items-center rounded-full px-0 transition-colors ease-out data-[state=checked]:bg-icon data-[state=unchecked]:bg-text/30" onCheckedChange={() => (showGlint.current = !showGlint.current)}>
          <Switch.Thumb class="pointer-events-none block size-4 shrink-0 rounded-full bg-text transition-transform ease-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-1" />
        </Switch.Root>
      </Label.Root>

      <Label.Root for="rainbow" class="flex items-center justify-between gap-4 rounded-lg bg-text/5 p-2">
        <div class="flex items-start gap-2">
          <Rainbow class="size-6 h-lh shrink-0" />
          <div class="flex flex-col">
            <h4 class="font-semibold text-text/90 group-data-[rainbow=true]/html:chroma-gradient">Rainbow Colors</h4>
            <p class="text-text/60">Enable rainbow colors animation for maxed enchants on items.</p>
          </div>
        </div>
        <Switch.Root
          id="rainbow"
          checked={rainbowEnchantments.current}
          class="peer inline-flex h-6 min-h-6 w-10 shrink-0 cursor-pointer items-center rounded-full px-0 transition-colors ease-out data-[state=checked]:bg-icon data-[state=unchecked]:bg-text/30"
          onCheckedChange={() => {
            rainbowEnchantments.current = !rainbowEnchantments.current;
            toggleRainbow();
          }}>
          <Switch.Thumb class="pointer-events-none block size-4 shrink-0 rounded-full bg-text transition-transform ease-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-1" />
        </Switch.Root>
      </Label.Root>

      <div class="flex items-center justify-between gap-4 rounded-lg bg-text/5 p-2">
        <div class="flex items-start gap-2">
          <Keyboard class="size-6 h-lh shrink-0" />
          <div class="flex flex-col">
            <h4 class="font-semibold text-text/90">Keybind</h4>
            <p class="text-text/60">Set the keybind to open the command menu</p>
          </div>
        </div>
        <Button.Root class="flex h-8 min-w-8 items-center justify-center rounded-md border border-text/20 bg-text/10 px-2 py-1 font-mono text-sm font-semibold text-text/90 transition-colors ease-out hover:bg-text/20 focus:ring-2 focus:ring-icon/50 focus:outline-none" onclick={handleKeybindClick} onkeydown={handleKeybindKeydown} tabindex={0}>
          {#if isListening}
            <span class="animate-pulse text-icon">Press a key</span>
          {:else}
            <span class="min-w-2 text-center">{keybind.current}</span>
          {/if}
        </Button.Root>
      </div>
    </div>
    <Separator.Root class="shrink-0 bg-icon/30 data-[orientation=horizontal]:h-0.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-0.5" />
    <div class="space-y-4 rounded-lg bg-text/5 p-4">
      <div class="flex items-start gap-2 rounded-lg p-2 font-semibold">
        <BookOpenText class="size-5 h-lh shrink-0" />
        <div class="">
          <h4>Wiki Order</h4>
          <div class="space-y-2">
            <p class="text-text/60">Drag and drop the wiki sources to reorder them as you like.</p>
            <p class="text-text/60">If the wiki source isn't available, the next one in the list will be used.</p>
          </div>
        </div>
      </div>
      <div
        class="flex max-h-96 flex-col gap-4 overflow-x-clip overflow-y-auto"
        use:dndzone={{ items: wikiOrder, flipDurationMs: 300, dropTargetStyle: {} }}
        onconsider={(e) => (wikiOrder = e.detail.items)}
        onfinalize={(e) => {
          wikiOrderPreferences.set(e.detail.items);
          wikiOrder = e.detail.items;
        }}>
        {#each wikiOrder as wiki (wiki.id)}
          {@const normalizedName = wiki.name.replaceAll("_", " ")}
          <div animate:flip={{ duration: 300, easing: cubicOut }} class="relative flex items-center gap-2 rounded-lg bg-text/5 p-2 font-semibold">
            <GripVertical class="size-5 shrink-0 text-text/60" />
            <div class="flex flex-col">
              {normalizedName}
              <Button.Root href={wiki.link} target="_blank" class="text-link/60 underline">{new URL(wiki.link).hostname}</Button.Root>
            </div>
            {#if SHADOW_ITEM_MARKER_PROPERTY_NAME in wiki && wiki[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
              <div in:fade={{ duration: 300, easing: cubicOut }} class="visible absolute inset-0 flex animate-pulse items-center gap-2 rounded-lg bg-text/5 p-2 font-semibold opacity-30">
                <GripVertical class="size-5 shrink-0 text-text/60" />
                <div class="flex flex-col">
                  {normalizedName}
                  <Button.Root href={wiki.link} target="_blank" class="text-link/60 underline">{new URL(wiki.link).hostname}</Button.Root>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
      {#if differsFromDefault}
        <Button.Root
          class="mt-4 w-full rounded-lg bg-text/65 p-1.5 text-sm font-semibold text-background/80 uppercase transition-colors ease-out hover:bg-text/80"
          onclick={() => {
            sectionOrderPreferences.current = defaultSectionOrder;
          }}>
          Reset to default
        </Button.Root>
      {/if}
    </div>
  </div>
</Tabs.Content>
