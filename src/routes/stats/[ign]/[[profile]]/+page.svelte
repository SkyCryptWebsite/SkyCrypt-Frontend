<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { getInternalState, getPreferences } from "$ctx";
  import { SEO } from "$lib/components/misc";
  import { Notice } from "$lib/components/notices";
  import TooltipSetup from "$lib/components/tooltip/TooltipSetup.svelte";
  import Main from "$lib/layouts/stats/Main.svelte";
  import type { SectionName } from "$lib/sections/types";
  import { getProfileStats } from "$lib/shared/api/skycrypt-api.remote";
  import { cn } from "$lib/shared/utils";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { type PageServerData } from "./$types";

  const { data }: { data: PageServerData } = $props();

  const preferences = getPreferences();
  const internalState = getInternalState();

  $effect.pre(() => {
    const hash = page.url.hash;
    if (hash) {
      const sectionName = hash.substring(1) as SectionName;
      if (preferences.sectionOrder.some((section) => section.name === sectionName)) {
        internalState.tabValue = sectionName;
      }
    }
  });

  afterNavigate(async ({ from, to, willUnload }) => {
    if (!from || !to) return;
    const { params: fromParams } = from;
    const { params: toParams } = to;
    if (!fromParams || !toParams) return;
    if ((fromParams.ign !== toParams.ign || fromParams.profile !== toParams.profile) && !willUnload) {
      internalState.openCommand = false;
    }
  });
</script>

{#if data.embed}
  <SEO embedData={data.embed} />
{/if}

{#key page.params.ign || page.params.profile}
  <svelte:boundary>
    {#snippet pending()}
      <div class="flex h-screen items-center justify-center">
        <div class={cn("rounded-lg bg-text/5 p-6", preferences.performanceMode ? "bg-background-grey" : "backdrop-blur-sm")}>
          <div class="flex items-center gap-2">
            <LoaderCircle class="size-5 animate-spin text-text/60" />
            <span class="font-semibold text-text/80">Loading profile...</span>
          </div>
        </div>
      </div>
    {/snippet}

    <Main data={await getProfileStats({ uuid: page.params.ign || "", profileId: page.params.profile || "" })} />

    {#snippet failed(err, reset)}
      <div class="flex h-screen items-center justify-center">
        <Notice title="An unexpected error has occurred" type="error" error={err} retry={reset} />
      </div>
    {/snippet}
  </svelte:boundary>
{/key}

<TooltipSetup />
