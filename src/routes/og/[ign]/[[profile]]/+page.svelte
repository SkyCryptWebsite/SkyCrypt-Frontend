<script lang="ts">
  import { page } from "$app/state";
  import SEO from "$lib/components/SEO.svelte";
  import { cn } from "$lib/shared/utils";
  import { performanceMode } from "$lib/stores/preferences";
  import { Button } from "bits-ui";
  import type { PageServerData } from "./$types";

  const { data }: { data: PageServerData } = $props();
</script>

<SEO embedData={data.embed} />

<main class="flex h-screen w-full flex-col items-center justify-center">
  <div class={cn("flex w-full max-w-md flex-col items-center justify-center gap-3 rounded-lg p-6", performanceMode.current ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-50")}>
    <h1 class="text-center text-2xl font-semibold">Well... that's awkward</h1>
    <p class="text-center">You shouldn't be here 🙃</p>
    <Button.Root href={page.url.href.replace("/og/", "/stats/")} class="mx-auto flex w-full max-w-fit items-center justify-center rounded-3xl bg-icon px-6 py-3 text-base font-bold text-white uppercase transition-all duration-150 ease-out [text-shadow:0_0_3px_oklch(0%_0_0/50%)] hover:scale-[1.015] disabled:opacity-50 dark:text-text">Go Back</Button.Root>
  </div>
</main>
