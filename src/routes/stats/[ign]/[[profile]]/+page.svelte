<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import Notice from "$lib/components/Notice.svelte";
  import Main from "$lib/layouts/stats/Main.svelte";
  import type { SectionName } from "$lib/sections/types";
  import { cn } from "$lib/shared/utils";
  import { api_token, tabValue } from "$lib/stores/internal";
  import { performanceMode, sectionOrderPreferences } from "$lib/stores/preferences";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { decodeBase64 } from "@oslojs/encoding";
  import type { PageServerData } from "./$types";

  const { data }: { data: PageServerData } = $props();

  // Find the API token by looking for a value that contains keyId matching its key
  // Now with time-based keys, we need to be more robust in our search
  const apiTokenEntry = Object.entries(data).find(([encodedKey, encodedValue]) => {
    try {
      const decodedKey = new TextDecoder().decode(decodeBase64(encodedKey));
      const decodedValue = JSON.parse(new TextDecoder().decode(decodeBase64(encodedValue as string)));

      // Check if this token's keyId matches the current key
      // The keyId should exactly match the decoded key since the server sets it
      return decodedValue.keyId === decodedKey;
    } catch {
      return false;
    }
  });

  if (!apiTokenEntry) {
    throw new Error("API token not found in server data.");
  }

  const decoded = decodeBase64(apiTokenEntry[1] as string);
  if (!decoded) {
    throw new Error("Invalid API token provided.");
  }

  const tokenData = JSON.parse(new TextDecoder().decode(decoded));
  // Remove metadata from token data before setting it
  const { keyId, timeWindow, ...apiTokenData } = tokenData;
  api_token.set(apiTokenData);

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

{#await data.stats}
  <div class="flex h-screen items-center justify-center">
    <div class={cn("bg-text/[0.05] rounded-lg p-6", $performanceMode ? "bg-background-grey" : "backdrop-blur-sm")}>
      <div class="flex items-center gap-2">
        <LoaderCircle class="text-text/60 size-5 animate-spin" />
        <span class="text-text/80 font-semibold">Loading profile...</span>
      </div>
    </div>
  </div>
{:then stats}
  {#if stats}
    <Main data={stats} />
  {/if}
{:catch e}
  <div class="flex h-screen items-center justify-center">
    <Notice title="An unexpected error has occurred" type="error" error={e} />
  </div>
{/await}
