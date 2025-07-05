<script lang="ts">
  import Notice from "$lib/components/Notice.svelte";
  import type { SectionName } from "$lib/sections/types";
  import { titleCase } from "$lib/shared/helper";
  import { cn } from "$lib/shared/utils";
  import { tabValue } from "$lib/stores/internal";
  import { performanceMode, sectionOrderPreferences } from "$lib/stores/preferences";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { Tabs } from "bits-ui";

  const COMPONENTS = {
    Gear: () => import("$lib/sections/stats/Gear.svelte"),
    Accessories: () => import("$lib/sections/stats/Accessories.svelte"),
    Pets: () => import("$lib/sections/stats/Pets.svelte"),
    Inventory: () => import("$lib/sections/stats/Inventory.svelte"),
    Skills: () => import("$lib/sections/stats/SkillsSection.svelte"),
    Dungeons: () => import("$lib/sections/stats/Dungeons.svelte"),
    Slayer: () => import("$lib/sections/stats/Slayer.svelte"),
    Minions: () => import("$lib/sections/stats/Minions.svelte"),
    Bestiary: () => import("$lib/sections/stats/Bestiary.svelte"),
    Collections: () => import("$lib/sections/stats/Collections.svelte"),
    Crimson_Isle: () => import("$lib/sections/stats/CrimsonIsle.svelte"),
    Rift: () => import("$lib/sections/stats/Rift.svelte"),
    Misc: () => import("$lib/sections/stats/MiscSection.svelte")
  } satisfies Record<SectionName, () => Promise<{ default: unknown }>>;

  function findIndex(id: SectionName) {
    return $sectionOrderPreferences.findIndex((section) => section.name === id);
  }
</script>

{#key $tabValue}
  {#if $tabValue in COMPONENTS}
    <Tabs.Root value={$tabValue} class="contents" data-section={$tabValue}>
      <Tabs.Content value={$tabValue} class="section">
        {#await COMPONENTS[$tabValue]()}
          <div class={cn("bg-text/[0.05] rounded-lg p-6", $performanceMode ? "bg-background-lore" : "backdrop-blur-sm")}>
            <div class="flex items-center gap-2">
              <LoaderCircle class="text-text/60 size-5 animate-spin" />
              <span class="text-text/80 font-semibold">Loading {titleCase($tabValue)}...</span>
            </div>
          </div>
        {:then { default: Component }}
          <Component order={findIndex($tabValue)} />
        {:catch}
          <Notice type="error" title={`Failed to load section ${$tabValue}`}>
            <p class="text-text/80">This section may not be available or there was an error loading it.</p>
          </Notice>
        {/await}
      </Tabs.Content>
    </Tabs.Root>
  {:else}
    <Notice type="error" title={`Invalid Section: ${$tabValue}`}>
      <p class="text-text/80">This section does not exist or is not implemented.</p>
    </Notice>
  {/if}
{/key}
