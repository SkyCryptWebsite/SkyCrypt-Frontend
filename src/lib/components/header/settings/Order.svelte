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
  import { getPreferences } from "$ctx";
  import { SettingsTab } from "$lib/components/header/types";
  import { sections } from "$lib/sections/constants";
  import type { SectionID } from "$lib/sections/types";
  import type { Theme } from "$lib/shared/constants/themes";
  import themes from "$lib/shared/constants/themes";
  import { theme as themeStore } from "$lib/stores/themes";
  import GripVertical from "@lucide/svelte/icons/grip-vertical";
  import ListOrdered from "@lucide/svelte/icons/list-ordered";
  import { Button, Tabs } from "bits-ui";
  import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME, type DndEvent } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  const preferences = getPreferences();

  const defaultSectionOrder = sections;
  const differsFromDefault = $derived(JSON.stringify(preferences.sectionOrder) !== JSON.stringify(defaultSectionOrder));

  let sectionOrder = $derived(preferences.sectionOrder);

  function onconsider(e: CustomEvent<DndEvent<SectionID>>) {
    sectionOrder = e.detail.items;
  }

  function onfinalize(e: CustomEvent<DndEvent<SectionID>>) {
    sectionOrder = e.detail.items;
    preferences.sectionOrder = e.detail.items;
  }
</script>

<Tabs.Content value={SettingsTab.Order}>
  <div class="flex items-start gap-2 rounded-lg p-2 font-semibold">
    <ListOrdered class="size-5 h-lh shrink-0" />
    <div>
      <h4>Order</h4>

      <p class="text-text/60">Drag and drop the sections to reorder them as you like.</p>
    </div>
  </div>
  <div class="mt-4 flex max-h-96 flex-col gap-4 overflow-x-clip overflow-y-auto" use:dndzone={{ items: sectionOrder, flipDurationMs: 300, dropTargetStyle: {} }} {onconsider} {onfinalize}>
    {#each sectionOrder as section (section.id)}
      {@const normalizedName = section.name.replaceAll("_", " ")}
      <div animate:flip={{ duration: 300, easing: cubicOut }} class="relative flex items-center gap-2 rounded-lg bg-text/5 p-2 font-semibold">
        <GripVertical class="size-5 text-text/60" />
        {normalizedName}
        {#if SHADOW_ITEM_MARKER_PROPERTY_NAME in section && section[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
          <div in:fade={{ duration: 300, easing: cubicOut }} class="visible absolute inset-0 flex animate-pulse items-center gap-2 rounded-lg bg-text/5 p-2 font-semibold opacity-30">
            <GripVertical class="size-5 text-text/60" />
            {normalizedName}
          </div>
        {/if}
      </div>
    {/each}
  </div>
  {#if differsFromDefault}
    <Button.Root
      class="mt-4 w-full rounded-lg bg-text/65 p-1.5 text-sm font-semibold text-background/80 uppercase transition-colors ease-out hover:bg-text/80"
      onclick={() => {
        preferences.sectionOrder = defaultSectionOrder;
      }}>
      Reset to default
    </Button.Root>
  {/if}
</Tabs.Content>
