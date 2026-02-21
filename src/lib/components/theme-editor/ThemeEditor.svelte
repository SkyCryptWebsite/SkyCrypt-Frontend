<script lang="ts">
  import { getInternalState, getTheme } from "$ctx";
  import { DEFAULT_THEME } from "$lib/shared/themes/defaults";
  import { ThemeEngine } from "$lib/shared/themes/engine";
  import type { ColorBackground, StripesBackground } from "$lib/shared/themes/schema";
  import { partialThemeV3Schema, type ThemeV3 } from "$lib/shared/themes/schema";
  import { flyAndScale } from "$lib/shared/utils";
  import Check from "@lucide/svelte/icons/check";
  import ChevronsDown from "@lucide/svelte/icons/chevrons-down";
  import ChevronsUp from "@lucide/svelte/icons/chevrons-up";
  import ChevronsUpDown from "@lucide/svelte/icons/chevrons-up-down";
  import Moon from "@lucide/svelte/icons/moon";
  import Sun from "@lucide/svelte/icons/sun";
  import { Select, Switch, Tabs } from "bits-ui";
  import * as devalue from "devalue";
  import { untrack } from "svelte";
  import { toast } from "svelte-sonner";
  import BackgroundSection from "./BackgroundSection.svelte";
  import ColorSection from "./ColorSection.svelte";
  import MCColorSection from "./MCColorSection.svelte";
  import ThemeActions from "./ThemeActions.svelte";

  const internalState = getInternalState();
  const themeContext = getTheme();

  let workingTheme = $state<ThemeV3>(getInitialTheme());

  // JSON Editor state
  let jsonString = $state(untrack(() => JSON.stringify(workingTheme, null, 2)));
  let jsonError = $state<string | null>(null);

  /**
   * Ensure a theme has complete colors and backgrounds for editor binding.
   * Fills missing properties from DEFAULT_THEME so all inputs have values.
   */
  function ensureEditorDefaults(theme: ThemeV3): ThemeV3 {
    return {
      ...theme,
      colors: { ...DEFAULT_THEME.colors, ...theme.colors },
      backgrounds: {
        skillbar: theme.backgrounds?.skillbar ?? DEFAULT_THEME.backgrounds!.skillbar!,
        maxedbar: theme.backgrounds?.maxedbar ?? DEFAULT_THEME.backgrounds!.maxedbar!,
        page: theme.backgrounds?.page ?? DEFAULT_THEME.backgrounds?.page
      }
    };
  }

  // Initial state: copy of active theme or default
  function getInitialTheme(): ThemeV3 {
    if (internalState.themeEditorId) {
      const existing = themeContext.allThemes.find((t) => t.metadata.id === internalState.themeEditorId);
      if (existing) {
        return ensureEditorDefaults(devalue.parse(devalue.stringify(existing)));
      }
    }
    // Fallback to active theme if valid, else default
    if (themeContext.activeTheme) {
      return ensureEditorDefaults(devalue.parse(devalue.stringify(themeContext.activeTheme)));
    }
    return ensureEditorDefaults(devalue.parse(devalue.stringify(DEFAULT_THEME)));
  }

  function handleReset() {
    if (themeContext.activeTheme) {
      workingTheme = devalue.parse(devalue.stringify(themeContext.activeTheme));
    } else {
      workingTheme = devalue.parse(devalue.stringify(DEFAULT_THEME));
    }
  }

  function handleSave() {
    // Ensure ID is unique if it's new
    if (themeContext.isFirstParty(workingTheme.metadata.id)) {
      workingTheme.metadata.id = `custom-${Date.now()}`;
    }
    themeContext.saveTheme(workingTheme);
    themeContext.activeThemeId = workingTheme.metadata.id;
    toast.success("Theme saved!");
  }

  function handleJsonChange(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    jsonString = target.value;
    try {
      const parsed = JSON.parse(jsonString);
      const result = partialThemeV3Schema.safeParse(parsed);
      if (result.success) {
        // Merge with existing to keep it valid ThemeV3
        workingTheme = { ...workingTheme, ...parsed };
        jsonError = null;
      } else {
        jsonError = result.error.issues[0].message;
      }
    } catch (err) {
      jsonError = (err as Error).message;
    }
  }

  // Sync JSON when switching tabs to Code
  function onTabChange(value: string) {
    if (value === "code") {
      jsonString = devalue.stringify(workingTheme);
    }
  }

  function handleFork(themeId: string) {
    const base = themeContext.allThemes.find((t) => t.metadata.id === themeId);
    if (base) {
      workingTheme = devalue.parse(devalue.stringify(base));
      workingTheme.metadata.id = `custom-${Date.now()}`;
      workingTheme.metadata.name = `${base.metadata.name} (Copy)`;
      workingTheme.metadata.author = "You";
    }
  }

  function setBackgroundType(key: "skillbar" | "maxedbar", type: "color" | "stripes") {
    if (!workingTheme.backgrounds) {
      workingTheme.backgrounds = {};
    }
    if (type === "color") {
      workingTheme.backgrounds[key] = {
        type: "color",
        color: "oklch(0.5 0.1 250)" // Default purple-ish
      } as ColorBackground;
    } else {
      workingTheme.backgrounds[key] = {
        type: "stripes",
        angle: "45deg",
        colors: ["oklch(0.5 0.1 250)", "oklch(0.4 0.1 250)"],
        width: 10
      } as StripesBackground;
    }
  }

  function handleNameChange(name: string) {
    workingTheme.metadata.name = name;
  }

  function handleAuthorChange(author: string) {
    workingTheme.metadata.author = author;
  }

  // Live preview
  $effect(() => {
    ThemeEngine.applyTheme(workingTheme);
    return () => {
      // On cleanup, revert to active theme or default
      if (themeContext.activeTheme) {
        ThemeEngine.applyTheme(themeContext.activeTheme);
      } else {
        ThemeEngine.applyTheme(DEFAULT_THEME);
      }
    };
  });

  // Cleanup on destroy/close
  $effect(() => {
    if (!internalState.themeEditorOpen) {
      // Apply the active theme again to clear preview state
      if (themeContext.activeTheme) {
        ThemeEngine.applyTheme(themeContext.activeTheme);
      }
    }
    return () => {
      if (themeContext.activeTheme) {
        ThemeEngine.applyTheme(themeContext.activeTheme);
      }
    };
  });
</script>

<div class="flex h-full w-full flex-col">
  <ThemeActions {workingTheme} onReset={handleReset} onSave={handleSave} {handleNameChange} {handleAuthorChange} />

  <div class="flex-1 overflow-y-auto">
    <div class="p-4">
      <div class="mb-4 flex flex-col gap-2">
        <label for="fork-select" class="text-xs font-bold text-text/60 uppercase">Start From</label>

        <Select.Root type="single" onValueChange={(value) => handleFork(value)}>
          <Select.Trigger id="fork-select" class="flex items-center justify-between rounded-lg bg-text/10 p-2 text-left">
            <span>{workingTheme.metadata.name || "Select a theme..."}</span>
            <ChevronsUpDown class="size-4 text-text/60" />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content forceMount class="focus-override z-50 max-h-(--bits-select-content-available-height) w-(--bits-select-anchor-width) min-w-(--bits-select-anchor-width) rounded-lg bg-background-lore px-1 py-3 outline-hidden select-none data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1" sideOffset={10}>
              {#snippet child({ open, props, wrapperProps })}
                {#if open}
                  <div {...wrapperProps}>
                    <div {...props} transition:flyAndScale>
                      <Select.ScrollUpButton class="flex w-full items-center justify-center">
                        <ChevronsUp class="size-3" />
                      </Select.ScrollUpButton>

                      <Select.Viewport class="p-1">
                        {#each themeContext.allThemes as theme, index (index)}
                          <Select.Item class="flex h-10 w-full items-center rounded-lg py-3 pr-1.5 pl-5 text-sm capitalize outline-hidden select-none data-disabled:opacity-50 data-highlighted:bg-background" label={theme.metadata.name} value={theme.metadata.id}>
                            {#snippet children({ selected })}
                              {theme.metadata.name}

                              {#if selected}
                                <div class="ml-auto">
                                  <Check aria-label="check" />
                                </div>
                              {/if}
                            {/snippet}
                          </Select.Item>
                        {/each}
                        <Select.ScrollDownButton />
                      </Select.Viewport>
                      <Select.ScrollDownButton class="flex w-full items-center justify-center">
                        <ChevronsDown class="size-3" />
                      </Select.ScrollDownButton>
                    </div>
                  </div>
                {/if}
              {/snippet}
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <Tabs.Root value="visual" onValueChange={onTabChange} class="w-full">
        <Tabs.List class="grid w-full grid-cols-2 rounded-lg bg-text/5 p-1">
          <Tabs.Trigger value="visual" class="rounded-md py-2 text-sm font-medium transition-all data-[state=active]:bg-text/10 data-[state=active]:text-text data-[state=active]:shadow-sm">Visual</Tabs.Trigger>
          <Tabs.Trigger value="code" class="rounded-md py-2 text-sm font-medium transition-all data-[state=active]:bg-text/10 data-[state=active]:text-text data-[state=active]:shadow-sm">Code (JSON)</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="visual" class="mt-4 flex flex-col gap-4">
          <div class="flex items-center justify-between rounded-lg bg-text/5 p-4">
            <div class="flex items-center gap-3">
              {#if workingTheme.light}
                <Sun class="size-5" />
              {:else}
                <Moon class="size-5" />
              {/if}
              <div class="flex flex-col">
                <span class="text-sm font-bold text-text">{workingTheme.light ? "Light Mode" : "Dark Mode"}</span>
                <span class="text-xs text-text/50">Toggle between light and dark base mode</span>
              </div>
            </div>
            <Switch.Root bind:checked={workingTheme.light} class="inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-text/20 transition-colors focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:outline-none data-[state=checked]:bg-link">
              <Switch.Thumb class="pointer-events-none block size-5 rounded-full bg-text shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
            </Switch.Root>
          </div>

          <ColorSection bind:workingTheme />
          <BackgroundSection bind:workingTheme {setBackgroundType} />
          <MCColorSection bind:workingTheme />
        </Tabs.Content>

        <Tabs.Content value="code" class="mt-4 flex flex-col gap-2">
          <textarea value={jsonString} oninput={handleJsonChange} class="h-125 w-full rounded-lg border border-text/10 bg-text/5 p-4 font-mono text-xs text-text focus:border-link focus:outline-none" spellcheck="false"></textarea>
          {#if jsonError}
            <div class="rounded-lg bg-red-500/10 p-3 text-xs text-red-400">
              Error: {jsonError}
            </div>
          {/if}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  </div>
</div>
