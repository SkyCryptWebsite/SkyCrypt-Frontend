<script lang="ts">
  import { afterNavigate, replaceState } from "$app/navigation";
  import { page } from "$app/state";
  import { setProfileCtx } from "$ctx/profile.svelte";
  import Error from "$lib/components/Error.svelte";
  import Main from "$lib/layouts/stats/Main.svelte";
  import type { SectionName } from "$lib/sections/types";
  import { api } from "$lib/shared/api";
  import { cn } from "$lib/shared/utils";
  import { tabValue } from "$lib/stores/internal";
  import { performanceMode, sectionOrderPreferences } from "$lib/stores/preferences";
  import type { StatsV2 } from "$types/statsv2";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { createQuery } from "@tanstack/svelte-query";
  import { tick, untrack } from "svelte";
  let { ign, profile } = page.params;

  const query = createQuery<StatsV2>({
    queryKey: ["profile", ign, profile],
    queryFn: () => api(fetch).getProfile(ign, profile)
  });

  // Initialize the profile context
  setProfileCtx($query.data!);

  $effect.pre(() => {
    const hash = page.url.hash;
    if (hash) {
      const sectionName = hash.substring(1) as SectionName;
      const validSectionNames = $sectionOrderPreferences.map((section) => section.name);
      if (validSectionNames.includes(sectionName)) {
        tabValue.set(sectionName);
      }
    }
  });

  // Update the profile context when the data changes
  $effect(() => {
    const abortController = new AbortController();
    setProfileCtx($query.data!);

    untrack(() => {
      if (!$query.data) return;

      const { username, profile_cute_name } = $query.data;
      if (!username) return;

      const current = page.url.pathname;
      const wanted = `/stats/${username}/${profile_cute_name || ""}`;

      // Update the URL to match the username and cute name
      if (current !== wanted) {
        const newUrl = page.url.toString().replace(current, wanted);

        // Only proceed if not aborted
        if (!abortController.signal.aborted) {
          tick()
            .then(() => {
              if (!abortController.signal.aborted) {
                replaceState(newUrl, page.state);
              }
            })
            .catch(() => {});
        }
      }
    });

    return () => {
      abortController.abort();
    };
  });

  afterNavigate(async ({ from, to, willUnload }) => {
    if (!from || !to) return;
    const { params: fromParams } = from;
    const { params: toParams } = to;
    if (!fromParams || !toParams) return;
    if ((fromParams.ign !== toParams.ign || fromParams.profile !== toParams.profile) && !willUnload) {
      console.warn("IGN or Profile changed, reloading page to reflect new profile.");
      // Hard reload the page if the IGN changes, this ensures the profile context is updated correctly as TanStack Query does not work with Svelte 5 runes/states yet.
      window.location.reload();
    }
  });
</script>

{#if $query.isPending || $query.error}
  <div class="flex h-screen items-center justify-center">
    {#if $query.isPending}
      <div class={cn("bg-text/[0.05] rounded-lg p-6", $performanceMode ? "bg-background-grey" : "backdrop-blur-sm")}>
        <div class="flex items-center gap-2">
          <LoaderCircle class="text-text/60 size-5 animate-spin" />
          <span class="text-text/80 font-semibold">Loading profile...</span>
        </div>
      </div>
    {/if}
    {#if $query.error}
      <Error />
    {/if}
  </div>
{/if}
{#if $query.isSuccess}
  {#if $query.data}
    <Main />
  {/if}
{/if}