<script lang="ts">
  import { getProfileContext, setSkillsContext, SkillsContext } from "$ctx";
  import { Section } from "$lib/components/sections";
  import { getSkillsSection } from "$lib/shared/api/skycrypt-api.remote";
  import Enchanting from "./skills/enchanting.svelte";
  import Farming from "./skills/farming.svelte";
  import Fishing from "./skills/fishing.svelte";
  import Foraging from "./skills/foraging.svelte";
  import Mining from "./skills/mining.svelte";

  let { order }: { order: number } = $props();

  const profile = $derived(getProfileContext().current);
  const profileUUID = $derived(profile?.uuid);
  const profileId = $derived(profile?.profile_id);

  const skillsContext = new SkillsContext();
  setSkillsContext(skillsContext);

  const skills = $derived(await getSkillsSection({ uuid: profileUUID!, profileId: profileId! }));

  $effect(() => {
    skillsContext.skills = skills;
  });
</script>

<Section id="Skills" {order}>
  {#if skills}
    {#if skills.mining}
      <Mining />
    {:else}
      <p class="space-x-0.5 leading-6">{profile?.username} doesn't have anything related to mining.</p>
    {/if}
    {#if skills.foraging}
      <Foraging />
    {:else}
      <p class="space-x-0.5 leading-6">{profile?.username} doesn't have anything related to foraging.</p>
    {/if}
    {#if skills.farming}
      <Farming />
    {:else}
      <p class="space-x-0.5 leading-6">{profile?.username} doesn't have anything related to farming.</p>
    {/if}
    {#if skills.fishing}
      <Fishing />
    {:else}
      <p class="space-x-0.5 leading-6">{profile?.username} doesn't have anything related to fishing.</p>
    {/if}
    {#if skills.enchanting}
      <Enchanting />
    {:else}
      <p class="space-x-0.5 leading-6">{profile?.username} doesn't have anything related to enchanting.</p>
    {/if}
  {/if}
</Section>
