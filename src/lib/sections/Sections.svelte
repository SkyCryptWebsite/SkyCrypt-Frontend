<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";
  import type { SectionName } from "$lib/sections/types";
  import { titleCase } from "$lib/shared/helper";
  import { sectionOrderPreferences } from "$lib/stores/preferences";
  import type { ValidStats } from "$types/global";
  import CircleX from "@lucide/svelte/icons/circle-x";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import type { Component } from "svelte";
  import { onMount } from "svelte";

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);

  function findIndex(id: SectionName) {
    return $sectionOrderPreferences.findIndex((section) => section.name === id);
  }

  const COMPONENTS = {
    Armor: {
      component: () => import("$lib/sections/stats/Armor.svelte"),
      valid: (profile: ValidStats) => profile.items?.armor && profile.items?.equipment && profile.items?.wardrobe
    },
    Weapons: {
      component: () => import("$lib/sections/stats/Weapons.svelte"),
      valid: (profile: ValidStats) => profile.items?.weapons
    },
    Accessories: {
      component: () => import("$lib/sections/stats/Accessories.svelte"),
      valid: (profile: ValidStats) => profile.accessories
    },
    Pets: {
      component: () => import("$lib/sections/stats/Pets.svelte"),
      valid: (profile: ValidStats) => profile.pets
    },
    Inventory: {
      component: () => import("$lib/sections/stats/Inventory.svelte"),
      valid: (profile: ValidStats) => profile.items
    },
    Skills: {
      component: () => import("$lib/sections/stats/SkillsSection.svelte"),
      valid: (profile: ValidStats) => profile.skills
    },
    Dungeons: {
      component: () => import("$lib/sections/stats/Dungeons.svelte"),
      valid: (profile: ValidStats) => profile.dungeons
    },
    Slayer: {
      component: () => import("$lib/sections/stats/Slayer.svelte"),
      valid: (profile: ValidStats) => profile.slayer
    },
    Minions: {
      component: () => import("$lib/sections/stats/Minions.svelte"),
      valid: (profile: ValidStats) => profile.minions
    },
    Bestiary: {
      component: () => import("$lib/sections/stats/Bestiary.svelte"),
      valid: (profile: ValidStats) => profile.bestiary
    },
    Collections: {
      component: () => import("$lib/sections/stats/Collections.svelte"),
      valid: (profile: ValidStats) => profile.collections
    },
    Crimson_Isle: {
      component: () => import("$lib/sections/stats/CrimsonIsle.svelte"),
      valid: (profile: ValidStats) => profile.crimson_isle
    },
    Rift: {
      component: () => import("$lib/sections/stats/Rift.svelte"),
      valid: (profile: ValidStats) => profile.rift
    },
    Misc: {
      component: () => import("$lib/sections/stats/MiscSection.svelte"),
      valid: (profile: ValidStats) => profile.misc
    }
  } as const;

  let renderedComponents = $state(new Map<string, Component>());
  let loadingStates = $state(new Map<string, Promise<Component>>());
  let preloadComplete = $state(false);
  let mounted = $state(false);

  async function loadComponent(name: string) {
    if (renderedComponents.has(name)) {
      return renderedComponents.get(name);
    }

    if (!loadingStates.has(name)) {
      const loadPromise = COMPONENTS[name as keyof typeof COMPONENTS].component().then((module) => {
        renderedComponents = new Map(renderedComponents).set(name, module.default as Component);
        loadingStates = new Map(loadingStates);
        loadingStates.delete(name);
        return module.default;
      });

      loadingStates = new Map(loadingStates).set(name, loadPromise as unknown as Promise<Component>);
      return loadPromise;
    }

    return loadingStates.get(name);
  }

  function setupObserver(elem: HTMLElement) {
    let observer: IntersectionObserver;

    function createObserver() {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const sectionId = entry.target.getAttribute("data-section");
            if (sectionId && entry.isIntersecting) {
              loadComponent(sectionId);
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "200px 0px", threshold: 0 }
      );

      const rect = elem.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        const sectionId = elem.getAttribute("data-section");
        if (sectionId) {
          loadComponent(sectionId);
        }
      } else {
        observer.observe(elem);
      }
    }

    if (mounted) {
      createObserver();
    }

    return {
      destroy: () => observer?.disconnect()
    };
  }

  async function loadRemainingComponents() {
    const remainingComponents = Object.keys(COMPONENTS)
      .filter((id) => findIndex(id as SectionName) !== 0)
      .map((id) => loadComponent(id));

    await Promise.all(remainingComponents);
  }

  async function scrollToSection(hash: string) {
    const sectionId = hash.replace("#", "");

    await loadComponent(sectionId);

    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => setTimeout(resolve, 100));

    const element = document.querySelector(`[data-section="${sectionId}"]`);
    const childElement = document.getElementById(sectionId);
    if (childElement) {
      childElement.scrollIntoView({ behavior: "smooth" });
    } else if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  onMount(() => {
    mounted = true;

    Promise.all(
      Object.keys(COMPONENTS)
        .filter((id) => findIndex(id as SectionName) === 0)
        .map((id) => loadComponent(id))
    ).then(async () => {
      preloadComplete = true;

      await loadRemainingComponents();

      if (window.location.hash) {
        await scrollToSection(window.location.hash);
      }
    });

    return () => {
      mounted = false;
    };
  });
</script>

<div class="space-y-4">
  {#if preloadComplete}
    {#each Object.entries(COMPONENTS).sort(([a], [b]) => findIndex(a as SectionName) - findIndex(b as SectionName)) as [section, { valid }], index (index)}
      <div data-section={section} use:setupObserver>
        {#if valid(profile)}
          {#if renderedComponents.has(section)}
            {#key section}
              {#if renderedComponents.has(section)}
                {@const Component = renderedComponents.get(section)}
                {#if Component}
                  <Component order={findIndex(section as SectionName)} />
                {/if}
              {/if}
            {/key}
          {:else if loadingStates.has(section)}
            <div class="bg-text/[0.05] rounded-lg p-6 backdrop-blur-sm">
              <div class="flex items-center gap-2">
                <LoaderCircle class="text-text/60 size-5 animate-spin" />
                <span class="text-text/80 font-semibold">Loading {titleCase(section)}...</span>
              </div>
            </div>
          {:else}
            <div class="bg-text/[0.05] rounded-lg p-6 backdrop-blur-sm">
              <div class="text-text/60 font-medium">
                {titleCase(section)} will load when visible
              </div>
            </div>
          {/if}
        {:else}
          <CollapsibleSection id={section} order={findIndex(section as SectionName)}>
            <div class="bg-text/[0.05] rounded-lg p-6 backdrop-blur-sm">
              <div class="flex items-center gap-2">
                <CircleX class="text-text/60 size-5" />
                <span class="text-text/80 font-semibold">{titleCase(section)} is not available for this profile</span>
              </div>
            </div>
          </CollapsibleSection>
        {/if}
      </div>
    {/each}
  {/if}
</div>
