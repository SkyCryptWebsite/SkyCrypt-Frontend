<script lang="ts">
  import { getTheme, getInternalState } from "$ctx";
  import { ThemeEngine } from "$lib/shared/themes/engine";
  import { DEFAULT_THEME } from "$lib/shared/themes/defaults";
  import { partialThemeV3Schema, type ThemeV3 } from "$lib/shared/themes/schema";
  import { Tabs } from "bits-ui";
  import ColorSection from "./ColorSection.svelte";
  import BackgroundSection from "./BackgroundSection.svelte";
  import MCColorSection from "./MCColorSection.svelte";
  import ThemeActions from "./ThemeActions.svelte";

  import { untrack } from "svelte";

  const internalState = getInternalState();
  const themeContext = getTheme();

  // Initial state: copy of active theme or default
  function getInitialTheme(): ThemeV3 {
    if (internalState.themeEditorId) {
      const existing = themeContext.allThemes.find((t) => t.id === internalState.themeEditorId);
      if (existing) {
        return JSON.parse(JSON.stringify(existing));
      }
    }
    // Fallback to active theme if valid, else default
    if (themeContext.activeTheme) {
      return JSON.parse(JSON.stringify(themeContext.activeTheme));
    }
    return JSON.parse(JSON.stringify(DEFAULT_THEME));
  }

  let workingTheme = $state<ThemeV3>(getInitialTheme());

  // Live preview
  $effect(() => {
    ThemeEngine.applyTheme(workingTheme);
  });

  // Cleanup on destroy/close
  $effect(() => {
    if (!internalState.themeEditorOpen) {
      // Apply the active theme again to clear preview state
      if (themeContext.activeTheme) {
        ThemeEngine.applyTheme(themeContext.activeTheme);
      }
    }
  });

  function handleReset() {
    if (themeContext.activeTheme) {
      workingTheme = JSON.parse(JSON.stringify(themeContext.activeTheme));
    } else {
      workingTheme = JSON.parse(JSON.stringify(DEFAULT_THEME));
    }
  }

  function handleSave() {
    // Ensure ID is unique if it's new
    if (themeContext.isFirstParty(workingTheme.id)) {
      workingTheme.id = `custom-${Date.now()}`;
    }
    themeContext.saveTheme(workingTheme);
    themeContext.activeThemeId = workingTheme.id;
    alert("Theme saved!");
  }

  // JSON Editor state
  let jsonString = $state(untrack(() => JSON.stringify(workingTheme, null, 2)));
  let jsonError = $state<string | null>(null);

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
      jsonString = JSON.stringify(workingTheme, null, 2);
    }
  }

  function handleFork(themeId: string) {
    const base = themeContext.allThemes.find((t) => t.id === themeId);
    if (base) {
      workingTheme = JSON.parse(JSON.stringify(base));
      workingTheme.id = `custom-${Date.now()}`;
      workingTheme.name = `${base.name} (Copy)`;
      workingTheme.author = "You";
    }
  }
</script>

<div class="flex h-full w-full flex-col bg-background/80 backdrop-blur-xl">
  <ThemeActions {workingTheme} onReset={handleReset} onSave={handleSave} />

  <div class="flex-1 overflow-y-auto">
    <div class="p-4">
      <div class="mb-4 flex flex-col gap-2">
        <label for="fork-select" class="text-xs font-bold text-text/60 uppercase">Start From</label>
        <select id="fork-select" onchange={(e) => handleFork(e.currentTarget.value)} class="flex h-10 w-full items-center justify-between rounded-lg border border-text/10 bg-text/5 px-3 py-2 text-sm text-text transition-colors hover:bg-text/10 focus:ring-2 focus:ring-link focus:ring-offset-2 focus:outline-none">
          <option value="" disabled selected>Select a theme...</option>
          {#each themeContext.allThemes as theme}
            <option value={theme.id}>{theme.name}</option>
          {/each}
        </select>
      </div>

      <Tabs.Root value="visual" onValueChange={onTabChange} class="w-full">
        <Tabs.List class="grid w-full grid-cols-2 rounded-lg bg-text/5 p-1">
          <Tabs.Trigger value="visual" class="rounded-md py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-text data-[state=active]:shadow-sm">Visual</Tabs.Trigger>
          <Tabs.Trigger value="code" class="rounded-md py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-text data-[state=active]:shadow-sm">Code (JSON)</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="visual" class="mt-4 flex flex-col gap-8">
          <ColorSection {workingTheme} />
          <BackgroundSection {workingTheme} />
          <MCColorSection {workingTheme} />
        </Tabs.Content>

        <Tabs.Content value="code" class="mt-4 flex flex-col gap-2">
          <textarea value={jsonString} oninput={handleJsonChange} class="h-[500px] w-full rounded-lg border border-text/10 bg-text/5 p-4 font-mono text-xs text-text focus:border-link focus:outline-none" spellcheck="false"></textarea>
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
