<script lang="ts">
  import { page } from "$app/state";
  import { cn } from "$lib/shared/utils";
  import { performanceMode } from "$lib/stores/preferences";
  import { Button } from "bits-ui";
</script>

<main class="flex h-screen w-full flex-col items-center justify-center">
  <div class={cn("flex w-full max-w-md flex-col items-center justify-center gap-3 rounded-lg p-6", $performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-50")}>
    <h1 class="text-center text-2xl font-semibold">Oops! Something went wrong</h1>
    <p class="text-center">An error occurred while trying to fetch the stats for '{page.params.ign}'</p>
    <p>Try again or contact us if the problem persists.</p>
    <Button.Root href="/" class="bg-icon dark:text-text mx-auto flex w-full max-w-fit items-center justify-center rounded-3xl px-6 py-3 text-base font-bold text-white uppercase transition-all duration-150 [text-shadow:0_0_3px_oklch(0%_0_0_/_50%)] hover:scale-[1.015] disabled:opacity-50">Go home</Button.Root>
  </div>
  <p class="text-text/40 text-xs">{page.status}: {page.error?.message}</p>
</main>
