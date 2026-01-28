<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { getPreferences } from "$ctx";
  import Notice from "$lib/components/Notice.svelte";
  import Main from "$lib/layouts/stats/Main.svelte";
  import type { SectionName } from "$lib/sections/types";
  import { getProfileStats } from "$lib/shared/api/skycrypt-api.remote";
  import { cn } from "$lib/shared/utils";
  import { openCommand, tabValue } from "$lib/stores/internal";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";

  const preferences = getPreferences();

  $effect.pre(() => {
    const hash = page.url.hash;
    if (hash) {
      const sectionName = hash.substring(1) as SectionName;
      if (preferences.sectionOrder.some((section) => section.name === sectionName)) {
        tabValue.set(sectionName);
      }
    }
  });

  afterNavigate(async ({ from, to, willUnload }) => {
    if (!from || !to) return;
    const { params: fromParams } = from;
    const { params: toParams } = to;
    if (!fromParams || !toParams) return;
    if ((fromParams.ign !== toParams.ign || fromParams.profile !== toParams.profile) && !willUnload) {
      openCommand.set(false);
      // console.warn("IGN or Profile changed, reloading page to reflect new profile.");
      // // Hard reload the page if the IGN changes, this ensures the profile context is updated correctly as TanStack Query does not work with Svelte 5 runes/states yet.
      // window.location.reload();
    }
  });
</script>

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
