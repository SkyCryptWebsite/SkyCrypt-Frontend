<script lang="ts">
  import { hexToOklch, oklchToHex } from "$lib/shared/themes/color-utils";
  import { MC_PALETTES, paletteNames } from "$lib/shared/themes/presets";
  import type { ThemeV3 } from "$lib/shared/themes/schema";
  import { flyAndScale } from "$lib/shared/utils";
  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronsDown from "@lucide/svelte/icons/chevrons-down";
  import ChevronsUp from "@lucide/svelte/icons/chevrons-up";
  import ChevronsUpDown from "@lucide/svelte/icons/chevrons-up-down";
  import { Label, Select } from "bits-ui";

  let { workingTheme = $bindable() } = $props<{
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

    <Select.Root type="single" onValueChange={(value) => (workingTheme.minecraft.palette = value)}>
      <Select.Trigger id="mc-palette" class="flex items-center justify-between rounded-lg bg-text/10 p-2 text-left">
        <span>{workingTheme.minecraft.palette || "Select a palette..."}</span>
        <ChevronsUpDown class="size-4 text-text/60" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content forceMount class="focus-override z-50 max-h-(--bits-select-content-available-height) w-(--bits-select-anchor-width) min-w-(--bits-select-anchor-width) rounded-lg bg-background-lore px-1 py-3 outline-hidden select-none data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1" sideOffset={10}>
          {#snippet child({ open, props, wrapperProps })}
            {#if open}
              <div {...wrapperProps}>
                <div {...props} transition:flyAndScale>
                  <Select.ScrollUpButton class="flex w-full items-center justify-center">
                    <ChevronsUp class="size-3" />
                  </Select.ScrollUpButton>

                  <Select.Viewport class="p-1">
                    {#each paletteNames as name, index (index)}
                      <Select.Item class="flex h-10 w-full items-center rounded-lg py-3 pr-1.5 pl-5 text-sm capitalize outline-hidden select-none data-disabled:opacity-50 data-highlighted:bg-background" label={name} value={name}>
                        {#snippet children({ selected })}
                          {name}

                          {#if selected}
                            <div class="ml-auto">
                              <CheckIcon aria-label="check" />
                            </div>
                          {/if}
                        {/snippet}
                      </Select.Item>
                    {/each}
                    <Select.ScrollDownButton />
                  </Select.Viewport>
                  <Select.ScrollDownButton class="flex w-full items-center justify-center">
                    <ChevronsDown class="size-3" />
                  </Select.ScrollDownButton>
                </div>
              </div>
            {/if}
          {/snippet}
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </div>

  <div class="grid grid-cols-4 gap-3 sm:grid-cols-8">
    {#each mcCodes as code, index (index)}
      {@const effectiveColor = getEffectiveColor(code)}
      <div class="flex flex-col gap-1.5">
        <Label.Root for="mc-${code}" class="text-xs font-bold text-text/80">§{code}</Label.Root>

        <input id="mc-${code}" type="color" value={oklchToHex(effectiveColor)} oninput={(e) => setOverride(code, hexToOklch(e.currentTarget.value))} class="h-8 w-full cursor-pointer rounded-md border border-text/10 bg-text/5 transition-colors focus:border-link focus:outline-none" />
      </div>
    {/each}
  </div>
</div>
