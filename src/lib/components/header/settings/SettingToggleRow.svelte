<script lang="ts">
  import { cn } from "$lib/shared/utils";
  import { Label, Switch } from "bits-ui";
  import type { Snippet } from "svelte";

  let {
    icon,
    title,
    description,
    checked,
    id,
    onCheckedChange,
    children,
    titleClass = ""
  }: {
    icon: Snippet;
    title: string;
    description: string;
    checked: boolean;
    id: string;
    onCheckedChange: () => void;
    children?: Snippet;
    titleClass?: string;
  } = $props();
</script>

<Label.Root for={id} class="flex items-center justify-between gap-4 rounded-lg bg-text/5 p-2">
  <div class="flex items-start gap-2">
    {@render icon()}
    <div class="flex flex-col">
      {#if children}
        <div class="flex items-center gap-1">
          <h4 class={cn("font-semibold text-text/90", titleClass)}>{title}</h4>
          {@render children()}
        </div>
      {:else}
        <h4 class={cn("font-semibold text-text/90", titleClass)}>{title}</h4>
      {/if}
      <p class="text-text/60">{description}</p>
    </div>
  </div>
  <Switch.Root {id} {checked} class="peer inline-flex h-6 min-h-6 w-10 shrink-0 cursor-pointer items-center rounded-full px-0 transition-colors ease-out data-[state=checked]:bg-icon data-[state=unchecked]:bg-text/30" {onCheckedChange}>
    <Switch.Thumb class="pointer-events-none block size-4 shrink-0 rounded-full bg-text transition-transform ease-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-1" />
  </Switch.Root>
</Label.Root>
