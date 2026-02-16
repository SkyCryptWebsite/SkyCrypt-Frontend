<script lang="ts">
  import { hexToOklch, oklchToHex } from "$lib/shared/themes/color-utils";
  import type { ThemeV3 } from "$lib/shared/themes/schema";
  import { Label } from "bits-ui";

  let { workingTheme = $bindable() } = $props<{
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
            <Label.Root for={`color-${key}`} class="text-xs font-semibold text-text/80">{formatKey(key)}</Label.Root>
            <input
              id={`color-${key}`}
              type="color"
              value={oklchToHex(workingTheme.colors[key])}
              oninput={(e) => {
                workingTheme.colors[key] = hexToOklch(e.currentTarget.value);
              }}
              class="h-8 w-full cursor-pointer rounded-md border border-text/10 bg-text/5 transition-colors focus:border-link focus:outline-none" />
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>
