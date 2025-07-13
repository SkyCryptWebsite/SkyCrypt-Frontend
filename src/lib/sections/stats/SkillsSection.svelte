<script lang="ts">
  import { setDynamicCtx } from "$ctx/dynamic.svelte";
  import { getProfileCtx } from "$ctx/profile.svelte";
  import Notice from "$lib/components/Notice.svelte";
  import Section from "$lib/components/Section.svelte";
  import { api, SectionName } from "$lib/shared/api";
  import type { SkillsV2 } from "$types/statsv2";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { createQuery } from "@tanstack/svelte-query";
  import Enchanting from "./skills/enchanting.svelte";
  import Farming from "./skills/farming.svelte";
  import Fishing from "./skills/fishing.svelte";
  import Mining from "./skills/mining.svelte";

  let { order }: { order: number } = $props();

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
  const profileUUID = $derived(profile.uuid);
  const profileId = $derived(profile.profile_id);

  const query = createQuery<SkillsV2>({
    queryKey: [SectionName.SKILLS, profileUUID, profileId],
    queryFn: () => api(fetch).getSection(SectionName.SKILLS, profileUUID, profileId)
  });

  const skills = $derived.by(() => {
    if ($query.isPending || $query.error || !$query.data) return;
    return $query.data;
  });

  setDynamicCtx(SectionName.SKILLS, () => skills);
</script>

<Section id="Skills" {order}>
  {#if $query.isPending}
    <LoaderCircle class="text-icon animate-spin" />
  {/if}
  {#if $query.error}
    <Notice title="An unexpected error has occurred" type="error" error={$query.error} />
  {/if}
  {#if $query.isSuccess && $query.data && skills}
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
  {/if}
</Section>
