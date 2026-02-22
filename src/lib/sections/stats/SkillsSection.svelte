<script lang="ts">
  import { getProfileContext, setSkillsContext, SkillsContext } from "$ctx";
  import { ScrollItems } from "$lib/components/misc";
  import { Section } from "$lib/components/sections";
  import { getSkillsSection } from "$lib/shared/api/skycrypt-api.remote";
  import { type Icon } from "@lucide/svelte";
  import FishIcon from "@lucide/svelte/icons/fish";
  import PickaxeIcon from "@lucide/svelte/icons/pickaxe";
  import SparklesIcon from "@lucide/svelte/icons/sparkles";
  import TreesIcon from "@lucide/svelte/icons/trees";
  import WheatIcon from "@lucide/svelte/icons/wheat";
  import { Tabs } from "bits-ui";
  import type { Component } from "svelte";
  import Enchanting from "./skills/enchanting.svelte";
  import Farming from "./skills/farming.svelte";
  import Fishing from "./skills/fishing.svelte";
  import Foraging from "./skills/foraging.svelte";
  import Mining from "./skills/mining.svelte";

  type SkillTab = {
    name: string;
    component: Component<Record<string, never>>;
    available: boolean | undefined;
    icon: typeof Icon;
  };

  let { order }: { order: number } = $props();

  const profile = $derived(getProfileContext().current);
  const profileUUID = $derived(profile?.uuid);
  const profileId = $derived(profile?.profile_id);

  const skillsContext = new SkillsContext();
  setSkillsContext(skillsContext);

  const skills = $derived(await getSkillsSection({ uuid: profileUUID!, profileId: profileId! }));
  const skillTabs = $derived([
    { name: "Mining", component: Mining, available: !!skills?.mining, icon: PickaxeIcon },
    { name: "Foraging", component: Foraging, available: !!skills?.foraging, icon: TreesIcon },
    { name: "Farming", component: Farming, available: !!skills?.farming, icon: WheatIcon },
    { name: "Fishing", component: Fishing, available: !!skills?.fishing, icon: FishIcon },
    { name: "Enchanting", component: Enchanting, available: !!skills?.enchanting, icon: SparklesIcon }
  ]) satisfies SkillTab[];

  $effect(() => {
    skillsContext.skills = skills;
  });
</script>

<Section id="Skills" {order}>
  {#if skills}
    <Tabs.Root value={skillTabs.find((tab) => tab.available)?.name.toLowerCase()} class="pt-4">
      <ScrollItems>
        <Tabs.List class="relative flex w-fit items-center justify-center gap-1 overflow-clip rounded-md border border-skillbar text-base">
          {#each skillTabs as tab (tab.name)}
            {#if tab.available}
              <Tabs.Trigger value={tab.name.toLowerCase()} class="flex flex-col items-center justify-center rounded-md px-4 py-2 font-semibold text-white first:rounded-l-none last:rounded-r-none data-[state=active]:bg-skillbar">
                <tab.icon class="size-5" />
                {tab.name}
              </Tabs.Trigger>
            {/if}
          {/each}
        </Tabs.List>
      </ScrollItems>
      {#each skillTabs as tab (tab.name)}
        {#if tab.available}
          <Tabs.Content value={tab.name.toLowerCase()} class="pt-4">
            <tab.component />
          </Tabs.Content>
        {/if}
      {/each}
    </Tabs.Root>
  {/if}
</Section>
