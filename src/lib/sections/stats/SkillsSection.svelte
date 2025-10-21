<script lang="ts">
  import { getProfileContext, setSkillsContext } from "$ctx";
  import Notice from "$lib/components/Notice.svelte";
  import Section from "$lib/components/Section.svelte";
  import SetContext from "$lib/components/SetContext.svelte";
  import { getSkillsSection } from "$lib/shared/api/skycrypt-api.remote";
  import Enchanting from "./skills/enchanting.svelte";
  import Farming from "./skills/farming.svelte";
  import Fishing from "./skills/fishing.svelte";
  import Mining from "./skills/mining.svelte";

  let { order }: { order: number } = $props();

  const profile = $derived(getProfileContext());
  const profileUUID = $derived(profile.uuid);
  const profileId = $derived(profile.profile_id);

  const skills = $derived(await getSkillsSection({ uuid: profileUUID!, profileId: profileId! }));
</script>

<Section id="Skills" {order}>
  {#if skills}
    <SetContext data={skills} setContextFn={setSkillsContext}>
      <Notice type="info" title="Foraging" class="my-5">
        <p class="text-text/80">Unfortunately, Hypixel has yet to add the new foraging update to their API.<br />Until they do, we can't show any foraging related data, as it simply doesn't exist.</p>
        <p class="text-text/80">We will add foraging as soon as Hypixel adds it to their API.</p>
      </Notice>
      {#if skills.mining}
        <Mining />
      {:else}
        <p class="space-x-0.5 leading-6">{profile.username} doesn't have anything related to mining.</p>
      {/if}
      {#if skills.farming}
        <Farming />
      {:else}
        <p class="space-x-0.5 leading-6">{profile.username} doesn't have anything related to farming.</p>
      {/if}
      {#if skills.fishing}
        <Fishing />
      {:else}
        <p class="space-x-0.5 leading-6">{profile.username} doesn't have anything related to fishing.</p>
      {/if}
      {#if skills.enchanting}
        <Enchanting />
      {:else}
        <p class="space-x-0.5 leading-6">{profile.username} doesn't have anything related to enchanting.</p>
      {/if}
    </SetContext>
  {/if}
</Section>
