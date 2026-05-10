<script lang="ts">
  import { getInternalState, getPreferences, getProfileContext } from "$ctx";
  import { Notice } from "$lib/components/notices";
  import type { SectionName } from "$lib/sections/types";
  import { getCombined } from "$lib/shared/api/skycrypt-api.remote";
  import { titleCase } from "$lib/shared/helper";
  import { cn } from "$lib/shared/utils";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { Tabs } from "bits-ui";

  const preferences = getPreferences();
  const internalState = getInternalState();
  const profile = $derived(getProfileContext().current);
  const combinedState = $derived.by(() => {
    if (!profile?.uuid || !profile?.profile_id) {
      return { current: null, error: null };
    }

    const query = getCombined({ uuid: profile.uuid, profileId: profile.profile_id });

    return {
      current: query.current,
      error: query.error
    };
  });
  const shouldWaitForCombined = $derived(internalState.tabValue !== "Inventory");

  const COMPONENTS = {
    Overview: () => import("$lib/sections/stats/Overview.svelte"),
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
    return preferences.sectionOrder.findIndex((section) => section.name === id);
  }
</script>

{#key internalState.tabValue}
  {#if internalState.tabValue in COMPONENTS}
    <Tabs.Root value={internalState.tabValue} class="contents" data-section={internalState.tabValue}>
      <Tabs.Content value={internalState.tabValue} class="section">
        {#if shouldWaitForCombined && !combinedState.current}
          {#if combinedState.error}
            <Notice title="An unexpected error has occurred" type="error" error={combinedState.error.message} />
          {:else}
            <div class={cn("rounded-lg bg-text/5 p-6", preferences.performanceMode ? "bg-background-lore" : "backdrop-blur-sm")}>
              <div class="flex items-center gap-2">
                <LoaderCircle class="size-5 animate-spin text-text/60" />
                <span class="font-semibold text-text/80">Loading {titleCase(internalState.tabValue)}...</span>
              </div>
            </div>
          {/if}
        {:else}
          {#await COMPONENTS[internalState.tabValue]()}
            <div class={cn("rounded-lg bg-text/5 p-6", preferences.performanceMode ? "bg-background-lore" : "backdrop-blur-sm")}>
              <div class="flex items-center gap-2">
                <LoaderCircle class="size-5 animate-spin text-text/60" />
                <span class="font-semibold text-text/80">Loading {titleCase(internalState.tabValue)}...</span>
              </div>
            </div>
          {:then { default: Component }}
            <svelte:boundary>
              {#snippet pending()}
                <LoaderCircle class="animate-spin text-icon" />
              {/snippet}
              {#snippet failed(err, reset)}
                <Notice title="An unexpected error has occurred" type="error" error={err} retry={reset} />
              {/snippet}
              <Component order={findIndex(internalState.tabValue)} />
            </svelte:boundary>
          {:catch}
            <Notice type="error" title={`Failed to load section ${internalState.tabValue}`}>
              <p class="text-text/80">This section may not be available or there was an error loading it.</p>
            </Notice>
          {/await}
        {/if}
      </Tabs.Content>
    </Tabs.Root>
  {:else}
    <Notice type="error" title={`Invalid Section: ${internalState.tabValue}`}>
      <p class="text-text/80">This section does not exist or is not implemented.</p>
    </Notice>
  {/if}
{/key}
