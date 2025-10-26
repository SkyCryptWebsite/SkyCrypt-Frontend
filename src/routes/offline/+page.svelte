<script lang="ts">
  import { dev } from "$app/environment";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { cn } from "$lib/shared/utils";
  import { performanceMode } from "$lib/stores/preferences";
  import RefreshCw from "@lucide/svelte/icons/refresh-cw";
  import { Button } from "bits-ui";

  if (navigator.onLine && !dev) {
    goto(resolve("/"));
  }
</script>

<main class="flex h-screen flex-col items-center justify-center">
  <div class={cn("flex max-w-md flex-col items-center justify-center gap-3 rounded-lg p-6 text-center", $performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-50")}>
    <h1 class="text-3xl font-semibold text-text/80">Connection Error!</h1>
    <p class="text-lg text-text/80">
      {#if navigator.onLine}
        It looks like the server is down for maintenance! Try again in a few minutes.
      {:else}
        Please connect to the internet and try again.
      {/if}
    </p>
    <Button.Root class="flex w-fit items-center gap-2 rounded-full bg-link/80 px-5 py-3 font-semibold text-text/80 uppercase transition-all duration-300 ease-out hover:scale-105" onclick={() => location.reload()}>
      <RefreshCw class="size-5" />
      <span class="uppercase">Try again</span>
    </Button.Root>
  </div>
</main>
