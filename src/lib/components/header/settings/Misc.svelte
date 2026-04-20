<script lang="ts">
  import { getPreferences } from "$ctx";
  import { SettingsTab } from "$lib/components/header/types";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import CircleQuestionMark from "@lucide/svelte/icons/circle-question-mark";
  import Fan from "@lucide/svelte/icons/fan";
  import Keyboard from "@lucide/svelte/icons/keyboard";
  import Pickaxe from "@lucide/svelte/icons/pickaxe";
  import Rainbow from "@lucide/svelte/icons/rainbow";
  import Settings2 from "@lucide/svelte/icons/settings-2";
  import Sparkle from "@lucide/svelte/icons/sparkle";
  import { Button, Tabs, Tooltip } from "bits-ui";
  import SettingToggleRow from "./SettingToggleRow.svelte";

  const preferences = getPreferences();

  let isListening = $state(false);

  function handleKeybindKeydown(e: KeyboardEvent) {
    if (isListening) {
      e.preventDefault();
      e.stopPropagation();
      const key = e.key;
      if (key.length === 1 && key.match(/[a-zA-Z0-9/\\.,;'"`~!@#$%^&*()_+\-=[\]{}|:<>?]/)) {
        preferences.keybind = key;
        isListening = false;
      } else if (key === "Escape") {
        isListening = false;
        preferences.keybind = preferences.keybind || "/";
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
      <SettingToggleRow id="performance" title="Performance Mode" description="Disables blur, transparency and backdrop effects for better performance on low-end devices." checked={preferences.performanceMode} onCheckedChange={() => (preferences.performanceMode = !preferences.performanceMode)}>
        {#snippet icon()}
          <Fan class="size-6 h-lh shrink-0 will-change-transform data-[performance=false]:animate-spin-slow data-[performance=true]:animate-spin" data-performance={preferences.performanceMode} />
        {/snippet}
        <Tooltip.Provider delayDuration={0}>
          <Tooltip.Root>
            <Tooltip.Trigger class="flex items-center gap-1">
              <CircleQuestionMark class="size-4 h-lh text-text/60" />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content forceMount class={cn("z-50 flex w-full max-w-lg flex-col space-y-2 overflow-hidden rounded-lg p-4 select-text", preferences.performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-50")}>
                {#snippet child({ wrapperProps, props, open })}
                  {#if open}
                    <div {...wrapperProps}>
                      <div {...props} transition:flyAndScale>
                        <p>You might not need this! We've noticed that often the reason for low performance is due to Graphics Acceleration being disabled in the browser settings.</p>
                        <p>Graphics Acceleration gives the browsers access to your GPU for rendering, which can significantly improve performance; especially with opacity and blur effects.</p>
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
      </SettingToggleRow>

      <SettingToggleRow id="glint" title="Show Glint" description="Show the enchantment glint effect on enchanted items." checked={preferences.showGlint} onCheckedChange={() => (preferences.showGlint = !preferences.showGlint)}>
        {#snippet icon()}
          <Sparkle class="size-6 h-lh shrink-0" />
        {/snippet}
      </SettingToggleRow>

      <SettingToggleRow id="mctooltip" title="Minecraft Styled Tooltips" description="Enable Minecraft styled tooltips for items." checked={preferences.mctooltip} onCheckedChange={() => (preferences.mctooltip = !preferences.mctooltip)}>
        {#snippet icon()}
          <Pickaxe class="size-6 h-lh shrink-0" />
        {/snippet}
      </SettingToggleRow>

      <SettingToggleRow id="rainbow" title="Rainbow Colors" titleClass="group-data-[rainbow=true]/html:chroma-gradient" description="Enable rainbow colors animation for maxed enchants on items." checked={preferences.rainbowEnchantments} onCheckedChange={() => (preferences.rainbowEnchantments = !preferences.rainbowEnchantments)}>
        {#snippet icon()}
          <Rainbow class="size-6 h-lh shrink-0" />
        {/snippet}
      </SettingToggleRow>

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
            <span class="min-w-2 text-center">{preferences.keybind}</span>
          {/if}
        </Button.Root>
      </div>
    </div>
  </div>
</Tabs.Content>
