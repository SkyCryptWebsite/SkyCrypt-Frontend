<script lang="ts">
  import { page } from "$app/state";
  import { getPreferences } from "$ctx";
  import { cn } from "$lib/shared/utils";
  import { Button } from "bits-ui";

  const preferences = getPreferences();
</script>

<main class="flex h-[60dvh] w-full flex-col items-center justify-center px-5">
  <div class={cn("flex w-full max-w-md flex-col items-center justify-center gap-3 rounded-lg p-6 text-center", preferences.performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-60 dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
    <p class="text-3xl font-bold text-link">{page.status}</p>
    <h1 class="text-xl font-semibold text-text">
      {page.status === 404 ? "Post not found" : "Something went wrong"}
    </h1>
    {#if page.error?.message}
      <p class="text-sm text-text/75">{page.error.message}</p>
    {/if}
    <Button.Root href="/newsroom" class="mx-auto mt-2 flex w-full max-w-fit items-center justify-center rounded-3xl bg-icon px-6 py-3 text-base font-bold text-white uppercase transition-all duration-150 ease-out text-shadow-[0_0_3px_oklch(0%_0_0/50%)] hover:scale-[1.015] dark:text-text">Back to newsroom</Button.Root>
  </div>
</main>
