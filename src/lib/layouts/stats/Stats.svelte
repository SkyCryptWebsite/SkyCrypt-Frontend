<script lang="ts">
  import { getProfileContext } from "$ctx";
  import Notice from "$lib/components/notices/Notice.svelte";
  import Stat from "$lib/components/stats/Stat.svelte";
  import type { ModelsStats } from "$lib/shared/api/orval-generated";
  import { getAdditionalStats } from "$lib/shared/api/skycrypt-api.remote";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import type { RemoteQuery } from "@sveltejs/kit";
  import { Collapsible } from "bits-ui";
  import { cubicOut } from "svelte/easing";
  import { slide } from "svelte/transition";

  let openState = $state(false);
  const profile = $derived(getProfileContext().current);
  const profileUUID = $derived(profile?.uuid);
  const profileId = $derived(profile?.profile_id);

  let stats = $state<RemoteQuery<ModelsStats>>();

  $effect(() => {
    if (openState) {
      stats = getAdditionalStats({ uuid: profileUUID!, profileId: profileId! });
    }
  });
</script>

<div class="stats flex flex-col">
  <Collapsible.Root
    bind:open={openState}
    onOpenChange={(open) => {
      if (open && !stats) {
        stats = getAdditionalStats({ uuid: profileUUID!, profileId: profileId! });
      }
    }}>
    <Collapsible.Content forceMount={true} class="columns-[12.5rem]">
      {#snippet child({ props, open })}
        {#if open}
          {#if stats?.error}
            <Notice title="An unexpected error has occurred" type="error" error={stats.error.message} />
          {/if}
          {#if stats?.current?.stats}
            <div {...props} transition:slide|global={{ duration: 300, easing: cubicOut, axis: "y" }}>
              {#each Object.entries(stats.current.stats) as [statName, statData], index (index)}
                {#if statData.total > 0}
                  <Stat stat={statName} {statData} />
                {/if}
              {/each}
            </div>
          {/if}
        {/if}
      {/snippet}
    </Collapsible.Content>
    <Collapsible.Trigger class="mx-auto mt-3.5 w-full rounded-full bg-text/10 p-2.5 text-xs font-semibold uppercase">
      {#if stats?.loading}
        <LoaderCircle class="mx-auto animate-spin text-icon" />
      {:else}
        {openState ? "Hide Stats" : "Show Stats"}
      {/if}
    </Collapsible.Trigger>
  </Collapsible.Root>
</div>
