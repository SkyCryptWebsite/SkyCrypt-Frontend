<script lang="ts">
  import { getPreferences, getInternalState } from "$ctx";
  import { SettingsTab } from "$lib/components/header/types";
  import { cn } from "$lib/shared/utils";
  import BookOpenText from "@lucide/svelte/icons/book-open-text";
  import Fan from "@lucide/svelte/icons/fan";
  import Keyboard from "@lucide/svelte/icons/keyboard";
  import ListOrdered from "@lucide/svelte/icons/list-ordered";
  import PackageOpen from "@lucide/svelte/icons/package-open";
  import PaintBucket from "@lucide/svelte/icons/paint-bucket";
  import Pickaxe from "@lucide/svelte/icons/pickaxe";
  import Sparkle from "@lucide/svelte/icons/sparkle";
  import { Command } from "bits-ui";

  const { closeCommand }: { closeCommand: () => void } = $props();

  const preferences = getPreferences();
  const internalState = getInternalState();

  function handleSettingTab(tab: SettingsTab) {
    internalState.settingsTab = tab;
    closeCommand();
    internalState.settingsOpen = true;
  }
</script>

<Command.Group>
  <Command.GroupHeading class="text-muted-foreground px-3 pt-4 pb-2 text-xs">Settings</Command.GroupHeading>
  <Command.GroupItems>
    <Command.Item value="packs" class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", preferences.performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")} keywords={["packs", "change", "settings"]} onSelect={() => handleSettingTab(SettingsTab.Packs)}>
      <div class="rounded-lg bg-icon/80 p-1">
        <PackageOpen class="size-4" />
      </div>
      Change Packs
    </Command.Item>
    <Command.Item value="themes" class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", preferences.performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")} keywords={["themes", "change", "settings"]} onSelect={() => handleSettingTab(SettingsTab.Themes)}>
      <div class="rounded-lg bg-icon/80 p-1">
        <PaintBucket class="size-4" />
      </div>
      Change Theme
    </Command.Item>
    <Command.Item value="section-order" class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", preferences.performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")} keywords={["order", "change", "section", "settings"]} onSelect={() => handleSettingTab(SettingsTab.Order)}>
      <div class="rounded-lg bg-icon/80 p-1">
        <ListOrdered class="size-4" />
      </div>
      Change Section Order
    </Command.Item>
    <Command.Item value="wiki-order" class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", preferences.performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")} keywords={["order", "misc", "change", "wiki", "settings"]} onSelect={() => handleSettingTab(SettingsTab.Misc)}>
      <div class="rounded-lg bg-icon/80 p-1">
        <BookOpenText class="size-4" />
      </div>
      Change Wiki Order
    </Command.Item>
    <Command.Item value="keybind" class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", preferences.performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")} keywords={["keybind", "misc", "change", "command", "settings"]} onSelect={() => handleSettingTab(SettingsTab.Misc)}>
      <div class="rounded-lg bg-icon/80 p-1">
        <Keyboard class="size-4" />
      </div>
      Change Command Keybind
    </Command.Item>
    <Command.Item
      value="performance-mode"
      class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", preferences.performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")}
      keywords={["performance", "mode", "toggle", "settings"]}
      onSelect={() => {
        preferences.performanceMode = !preferences.performanceMode;
        closeCommand();
      }}>
      <div class="rounded-lg bg-icon/80 p-1">
        <Fan class="size-4 will-change-transform data-[performance=false]:animate-spin-slow data-[performance=true]:animate-spin" data-performance={preferences.performanceMode} />
      </div>
      Toggle Performance Mode
    </Command.Item>
    <Command.Item
      value="glint"
      class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", preferences.performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")}
      keywords={["glint", "toggle", "settings"]}
      onSelect={() => {
        preferences.showGlint = !preferences.showGlint;
        closeCommand();
      }}>
      <div class="rounded-lg bg-icon/80 p-1">
        <Sparkle class="size-4" />
      </div>
      Toggle Glint
    </Command.Item>
    <Command.Item
      value="mctooltip"
      class={cn("flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none", preferences.performanceMode ? "data-selected:bg-background-lore" : "data-selected:bg-background-grey")}
      keywords={["mctooltip", "minecraft", "tooltip", "toggle", "settings"]}
      onSelect={() => {
        preferences.mctooltip = !preferences.mctooltip;
        closeCommand();
      }}>
      <div class="rounded-lg bg-icon/80 p-1">
        <Pickaxe class="size-4" />
      </div>
      Toggle Minecraft-style Tooltips
    </Command.Item>
  </Command.GroupItems>
</Command.Group>
