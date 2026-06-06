<script lang="ts">
  import { page } from "$app/state";
  import { Button } from "bits-ui";
</script>

<main class="flex h-screen w-full flex-col items-center justify-center">
  <div class="flex w-full max-w-md flex-col items-center justify-center gap-3 rounded-lg p-6 glass">
    <h1 class="text-center text-2xl font-semibold">Oops! Something went wrong</h1>
    <p>Try again or contact us if the problem persists.</p>
    <Button.Root href="/" class="mx-auto flex w-full max-w-fit items-center justify-center rounded-3xl bg-icon px-6 py-3 text-base font-bold text-white uppercase transition-all duration-150 ease-out [text-shadow:0_0_3px_oklch(0%_0_0/50%)] hover:scale-[1.015] disabled:opacity-50 dark:text-text">Go home</Button.Root>
  </div>
  <p class="text-xs text-text/40">{page.status}: {page.error?.message}</p>
</main>
