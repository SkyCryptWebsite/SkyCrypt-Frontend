<script lang="ts">
  import { getProfileContext } from "$ctx";
  import { Notice } from "$lib/components/notices";
  import { Stat } from "$lib/components/stats";
  import { getAdditionalStats } from "$lib/shared/api/skycrypt-api.remote";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { Collapsible } from "bits-ui";
  import { cubicOut } from "svelte/easing";
  import { slide } from "svelte/transition";

  let openState = $state(false);
  const profile = $derived(getProfileContext().current);
  const profileUUID = $derived(profile?.uuid);
  const profileId = $derived(profile?.profile_id);

  const stats = $derived(openState && profileUUID && profileId ? getAdditionalStats({ uuid: profileUUID, profileId }) : undefined);
</script>

<div class="stats flex flex-col">
  <Collapsible.Root bind:open={openState}>
    {#key profile}
      <Collapsible.Content forceMount={true} class="columns-[12.5rem] *:motion-preset-focus *:motion-preset-slide-down *:motion-delay-[calc(sibling-index()*0.01s)]">
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
    {/key}
    <Collapsible.Trigger class="mx-auto mt-3.5 w-full rounded-full bg-text/10 p-2.5 text-xs font-semibold uppercase">
      {#if stats?.loading}
        <LoaderCircle class="mx-auto animate-spin text-icon" />
      {:else}
        {openState ? "Hide Stats" : "Show Stats"}
      {/if}
    </Collapsible.Trigger>
  </Collapsible.Root>
</div>
