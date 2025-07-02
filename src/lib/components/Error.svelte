<script lang="ts">
  import { PUBLIC_DISCORD_INVITE } from "$env/static/public";
  import { cn } from "$lib/shared/utils";
  import { performanceMode } from "$lib/stores/preferences";
  import CircleX from "@lucide/svelte/icons/circle-x";
  import { Button } from "bits-ui";

  type Props = {
    title?: string;
    subtitle?: string;
  };

  let { title = "An unexpected error has occurred", subtitle }: Props = $props();
</script>

<div class={cn("space-y-5 rounded-lg p-6 text-red-200 @[75rem]/parent:p-8", $performanceMode ? "bg-red-800" : "bg-red-700/[0.05] backdrop-blur-sm")}>
  <div class="justify-starts flex items-center gap-2">
    <CircleX class="size-8" />
    <h3 class="text-2xl font-semibold">{title}</h3>
  </div>

  {#if subtitle}
    <p class="text-text/80">{subtitle}</p>
  {/if}
  <p>If applicable, please report this error on our <Button.Root target="_blank" href={PUBLIC_DISCORD_INVITE} class="underline">Discord</Button.Root></p>
</div>
