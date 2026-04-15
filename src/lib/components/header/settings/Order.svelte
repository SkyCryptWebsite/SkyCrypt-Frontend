<script lang="ts">
  import { getPreferences } from "$ctx";
  import { SettingsTab } from "$lib/components/header/types";
  import { sections } from "$lib/sections/constants";
  import { Feedback } from "@dnd-kit/dom";
  import { OptimisticSortingPlugin, SortableKeyboardPlugin } from "@dnd-kit/dom/sortable";
  import { move } from "@dnd-kit/helpers";
  import { DragDropProvider, type DragDropEventHandlers } from "@dnd-kit/svelte";
  import { createSortable } from "@dnd-kit/svelte/sortable";
  import GripVertical from "@lucide/svelte/icons/grip-vertical";
  import ListOrdered from "@lucide/svelte/icons/list-ordered";
  import { Button, Tabs } from "bits-ui";

  const preferences = getPreferences();
  type SectionItem = (typeof preferences.sectionOrder)[number];
  type SortableItem = ReturnType<typeof createSortable>;

  const defaultSectionOrder = sections;
  const differsFromDefault = $derived(JSON.stringify(preferences.sectionOrder) !== JSON.stringify(defaultSectionOrder));

  let sectionOrder = $state([...preferences.sectionOrder]);
  let providerKey = $state(0);

  function onDragEnd(event: Parameters<NonNullable<DragDropEventHandlers["onDragEnd"]>>[0]) {
    sectionOrder = move(sectionOrder, event);
    preferences.sectionOrder = [...sectionOrder];
    providerKey += 1;
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
  <div class="mt-4 flex max-h-96 flex-col gap-4 overflow-x-clip overflow-y-auto">
    {#key providerKey}
      <DragDropProvider {onDragEnd}>
        {#each sectionOrder as section, index (section.id)}
          {@const sortable = createSortable({
            id: section.id,
            get index() {
              return index;
            },
            plugins: [SortableKeyboardPlugin, OptimisticSortingPlugin, Feedback.configure({ feedback: "clone" })]
          })}
          {@render sectionRowContent(section, sortable, true)}
        {/each}
      </DragDropProvider>
    {/key}
  </div>
  {#if differsFromDefault}
    <Button.Root
      class="mt-4 w-full rounded-lg bg-text/65 p-1.5 text-sm font-semibold text-background/80 uppercase transition-colors ease-out hover:bg-text/80"
      onclick={() => {
        sectionOrder = [...defaultSectionOrder];
        preferences.sectionOrder = [...defaultSectionOrder];
        providerKey += 1;
      }}>
      Reset to default
    </Button.Root>
  {/if}
</Tabs.Content>

{#snippet sectionRowContent(section: SectionItem, sortable: SortableItem | null = null, flipEnabled = false)}
  <div {@attach sortable?.attach} class="relative flex items-center gap-2 rounded-lg bg-text/5 p-2 font-semibold data-[dragging=true]:animate-pulse data-[dragging=true]:opacity-30 data-[flip=true]:will-change-transform" data-dragging={sortable?.isDropTarget} data-flip={flipEnabled}>
    <GripVertical class="size-5 shrink-0 text-text/60" />
    {section.name.replaceAll("_", " ")}
  </div>
{/snippet}
