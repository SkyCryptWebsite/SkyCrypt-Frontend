<script lang="ts">
  import type { ThemeV3 } from "$lib/shared/themes/schema";
  import { Label } from "bits-ui";

  let { workingTheme } = $props<{
    workingTheme: ThemeV3;
  }>();

  const GROUPS = [
    {
      name: "Theme Colors",
      keys: ["icon", "link", "hover", "maxed", "gold", "logo"] as const
    },
    {
      name: "Text & Backgrounds",
      keys: ["text", "background", "header", "greyBackground", "loreBackground", "bg", "mctooltipBg"] as const
    }
  ];

  function formatKey(key: string) {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
  }
</script>

<div class="flex flex-col gap-6 p-4">
  {#each GROUPS as group, index (index)}
    <div class="flex flex-col gap-3">
      <h3 class="text-sm font-bold tracking-wider text-text/60 uppercase">{group.name}</h3>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {#each group.keys as key, index (index)}
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <Label.Root for={`color-${key}`} class="text-xs font-semibold text-text/80">{formatKey(key)}</Label.Root>
              <div class="size-4 rounded border border-text/10 shadow-sm" style:background-color={workingTheme.colors[key]}></div>
            </div>
            <input id={`color-${key}`} type="text" bind:value={workingTheme.colors[key]} class="w-full rounded-md border border-text/10 bg-text/5 px-2 py-1.5 font-mono text-xs text-text transition-colors focus:border-link focus:bg-text/10 focus:outline-none" placeholder="oklch(L C H)" />
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>
