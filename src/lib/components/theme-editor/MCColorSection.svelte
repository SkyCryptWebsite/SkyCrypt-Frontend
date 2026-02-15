<script lang="ts">
  import type { ThemeV3 } from "$lib/shared/themes/schema";
  import { MC_PALETTES, paletteNames } from "$lib/shared/themes/presets";
  import { Label } from "bits-ui";

  let { workingTheme } = $props<{
    workingTheme: ThemeV3;
  }>();

  // Helper to get effective color for display
  function getEffectiveColor(code: string) {
    const palette = workingTheme.minecraft.palette;
    const overrides = workingTheme.minecraft.overrides || {};
    if (overrides[code]) return overrides[code];

    const paletteColors = MC_PALETTES[palette as keyof typeof MC_PALETTES];
    return paletteColors[`§${code}` as keyof typeof paletteColors];
  }

  // Helper to set override
  function setOverride(code: string, color: string) {
    if (!workingTheme.minecraft.overrides) {
      workingTheme.minecraft.overrides = {};
    }
    workingTheme.minecraft.overrides[code] = color;
  }

  const mcCodes = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
</script>

<div class="flex flex-col gap-6 p-4">
  <div class="flex flex-col gap-2">
    <Label.Root for="mc-palette" class="text-sm font-bold tracking-wider text-text/60 uppercase">Palette Preset</Label.Root>
    <select
      id="mc-palette"
      value={workingTheme.minecraft.palette}
      onchange={(e) => {
        const val = e.currentTarget.value;
        if (val) workingTheme.minecraft.palette = val as any;
      }}
      class="flex h-10 w-full items-center justify-between rounded-lg border border-text/10 bg-text/5 px-3 py-2 text-sm text-text transition-colors hover:bg-text/10 focus:ring-2 focus:ring-link focus:ring-offset-2 focus:outline-none">
      {#each paletteNames as name}
        <option value={name}>{name}</option>
      {/each}
    </select>
  </div>

  <div class="grid grid-cols-4 gap-3 sm:grid-cols-8">
    {#each mcCodes as code}
      {@const effectiveColor = getEffectiveColor(code)}
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <Label.Root for={`mc-${code}`} class="text-xs font-bold text-text/80">§{code}</Label.Root>
          <div class="size-4 rounded border border-text/10 shadow-sm" style:background-color={effectiveColor}></div>
        </div>
        <input id={`mc-${code}`} type="text" value={effectiveColor} oninput={(e) => setOverride(code, e.currentTarget.value)} class="w-full rounded-md border border-text/10 bg-text/5 px-1 py-1 font-mono text-[10px] text-text transition-colors focus:border-link focus:bg-text/10 focus:outline-none" />
      </div>
    {/each}
  </div>
</div>
