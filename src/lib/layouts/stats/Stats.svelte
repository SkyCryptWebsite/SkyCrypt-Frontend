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
  const statsQuery = $derived(openState && profileUUID && profileId ? getAdditionalStats({ uuid: profileUUID, profileId }) : null);
</script>

<div class="stats flex flex-col">
  <Collapsible.Root bind:open={openState}>
    {#key profile}
      <Collapsible.Content forceMount={true} class="columns-[12.5rem] *:motion-preset-focus *:motion-preset-slide-down *:motion-delay-[calc(sibling-index()*0.01s)]">
        {#snippet child({ props, open })}
          {#if open}
            {#if statsQuery?.error}
              <Notice title="An unexpected error has occurred" type="error" error={statsQuery.error instanceof Error ? statsQuery.error.message : String(statsQuery.error)} />
            {/if}
            {#if statsQuery?.current?.stats}
              <div {...props} transition:slide|global={{ duration: 300, easing: cubicOut, axis: "y" }}>
                {#each Object.entries(statsQuery.current.stats) as [statName, statData], index (index)}
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
      {#if statsQuery?.loading}
        <LoaderCircle class="mx-auto animate-spin text-icon" />
      {:else}
        {openState ? "Hide Stats" : "Show Stats"}
      {/if}
    </Collapsible.Trigger>
  </Collapsible.Root>
</div>
