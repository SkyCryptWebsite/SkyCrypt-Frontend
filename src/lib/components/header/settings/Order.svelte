<script lang="ts" module>
  function changeTheme(themeId: Theme["id"]) {
    const theme = themes.find((theme) => theme.id === themeId);
    if (!theme) {
      themeStore.set("default");
      document.documentElement.dataset.theme = "default";
      return;
    }
    if (theme.light) {
      document.documentElement.dataset.mode = "light";
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.dataset.mode = "dark";
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }

    document.documentElement.dataset.theme = theme.id;
  }
  export { changeTheme };
</script>

<script lang="ts">
  import { SettingsTab } from "$lib/components/header/types";
  import { sections } from "$lib/sections/constants";
  import type { Theme } from "$lib/shared/constants/themes";
  import themes from "$lib/shared/constants/themes";
  import { sectionOrderPreferences } from "$lib/stores/preferences";
  import { theme as themeStore } from "$lib/stores/themes";
  import GripVertical from "@lucide/svelte/icons/grip-vertical";
  import ListOrdered from "@lucide/svelte/icons/list-ordered";
  import { Button, Tabs } from "bits-ui";
  import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import { cubicOut } from "svelte/easing";
  import { derived, get } from "svelte/store";
  import { fade } from "svelte/transition";

  const initialSectionOrderPreferences = get(sectionOrderPreferences);
  const defaultSectionOrder = sections;
  const differsFromDefault = derived(sectionOrderPreferences, ($sectionOrderPreferences) => {
    return JSON.stringify($sectionOrderPreferences) !== JSON.stringify(defaultSectionOrder);
  });

  let sectionOrder = $state(initialSectionOrderPreferences);
</script>

<Tabs.Content value={SettingsTab.Order}>
  <div class="flex items-start gap-2 rounded-lg p-2 font-semibold">
    <ListOrdered class="size-5 h-lh shrink-0" />
    <div>
      <h4>Order</h4>

      <p class="text-text/60">Drag and drop the sections to reorder them as you like.</p>
    </div>
  </div>
  <div
    class="mt-4 flex max-h-96 flex-col gap-4 overflow-x-clip overflow-y-auto"
    use:dndzone={{ items: sectionOrder, flipDurationMs: 300, dropTargetStyle: {} }}
    onconsider={(e) => (sectionOrder = e.detail.items)}
    onfinalize={(e) => {
      sectionOrderPreferences.set(e.detail.items);
      sectionOrder = e.detail.items;
    }}>
    {#each sectionOrder as section (section.id)}
      {@const normalizedName = section.name.replaceAll("_", " ")}
      <div animate:flip={{ duration: 300, easing: cubicOut }} class="bg-text/[0.05] relative flex items-center gap-2 rounded-lg p-2 font-semibold">
        <GripVertical class="text-text/60 size-5" />
        {normalizedName}
        {#if SHADOW_ITEM_MARKER_PROPERTY_NAME in section && section[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
          <div in:fade={{ duration: 300, easing: cubicOut }} class="bg-text/[0.05] visible absolute inset-0 flex animate-pulse items-center gap-2 rounded-lg p-2 font-semibold opacity-30">
            <GripVertical class="text-text/60 size-5" />
            {normalizedName}
          </div>
        {/if}
      </div>
    {/each}
  </div>
  {#if $differsFromDefault}
    <Button.Root
      class="bg-text/65 text-background/80 hover:bg-text/80 mt-4 w-full rounded-lg p-1.5 text-sm font-semibold uppercase transition-colors ease-out"
      onclick={() => {
        sectionOrderPreferences.set(defaultSectionOrder);
      }}>
      Reset to default
    </Button.Root>
  {/if}
</Tabs.Content>
