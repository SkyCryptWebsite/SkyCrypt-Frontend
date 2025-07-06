<script lang="ts">
  import { PUBLIC_DISCORD_INVITE } from "$env/static/public";
  import { cn } from "$lib/shared/utils";
  import { performanceMode } from "$lib/stores/preferences";
  import CircleAlert from "@lucide/svelte/icons/circle-alert";
  import CircleX from "@lucide/svelte/icons/circle-x";
  import Info from "@lucide/svelte/icons/info";
  import { Button } from "bits-ui";
  import type { Snippet } from "svelte";

  type Props = {
    title: string;
    children?: Snippet;
    type: "error" | "warning" | "info";
    class?: string;
  };

  let { title, children, type, class: className }: Props = $props();
</script>

<div class={cn("space-y-5 rounded-lg p-6 data-[type=error]:text-red-200 data-[type=info]:text-blue-200 data-[type=warning]:text-yellow-200 @[75rem]/parent:p-8", $performanceMode ? "data-[type=error]:bg-red-800 data-[type=info]:bg-blue-800 data-[type=warning]:bg-yellow-800" : "backdrop-blur-sm data-[type=error]:bg-red-700/[0.05] data-[type=info]:bg-blue-700/[0.05] data-[type=warning]:bg-yellow-700/[0.05]", className)} data-type={type}>
  <div class="justify-starts flex items-center gap-2">
    {#if type === "error"}
      <CircleX class="size-8" />
    {/if}
    {#if type === "warning"}
      <CircleAlert class="size-8" />
    {/if}
    {#if type === "info"}
      <Info class="size-8" />
    {/if}
    <h3 class="text-2xl font-semibold">{title}</h3>
  </div>

  {@render children?.()}

  {#if type === "error"}
    <p>If applicable, please report this error on our <Button.Root target="_blank" href={PUBLIC_DISCORD_INVITE} class="underline">Discord</Button.Root></p>
  {/if}
</div>
