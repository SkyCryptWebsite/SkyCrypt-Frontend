<script lang="ts">
  import { getPreferences } from "$ctx";
  import { cn } from "$lib/shared/utils";

  const preferences = getPreferences();
</script>

<div class={cn("relative flex min-w-0 items-center gap-2 rounded-lg p-5", preferences.performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-60 dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
  <div class="size-16 animate-pulse rounded-lg bg-text/10"></div>
  <div class="flex flex-col gap-1">
    <div class="h-6 w-24 animate-pulse rounded-lg bg-text/10"></div>
    <div class="h-3 w-44 animate-pulse rounded-lg bg-text/10"></div>
  </div>
  <div class="absolute right-3 bottom-3 size-5 animate-pulse rounded-lg bg-text/10"></div>
</div>
