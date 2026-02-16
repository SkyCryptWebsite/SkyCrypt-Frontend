<script lang="ts">
  import { hexToOklch, oklchToHex } from "$lib/shared/themes/color-utils";
  import type { ThemeV3 } from "$lib/shared/themes/schema";
  import Check from "@lucide/svelte/icons/check";
  import ImageIcon from "@lucide/svelte/icons/image";
  import Sparkles from "@lucide/svelte/icons/sparkles";
  import { Label, RadioGroup } from "bits-ui";

  let { workingTheme = $bindable(), setBackgroundType } = $props<{
    workingTheme: ThemeV3;
    setBackgroundType: (key: "skillbar" | "maxedbar", type: "color" | "stripes") => void;
  }>();

  const backgroundTypes = [
    { value: "color", label: "Solid Color" },
    { value: "stripes", label: "Stripes" }
  ];
</script>

<div class="flex flex-col gap-8 p-4">
  <div class="flex flex-col gap-4">
    <h3 class="text-sm font-bold tracking-wider text-text/60 uppercase">Skillbar Background</h3>

    <RadioGroup.Root value={workingTheme.backgrounds.skillbar.type} onValueChange={(v) => setBackgroundType("skillbar", v as "color" | "stripes")} class="flex gap-4">
      {#each backgroundTypes as type, index (index)}
        <div class="flex items-center gap-2">
          <RadioGroup.Item value={type.value} id={`skillbar-${type.value}`} class="group flex size-4 items-center justify-center rounded-full border border-text/20 bg-text/5 text-link transition-all hover:bg-text/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-link data-[state=checked]:bg-link data-[state=checked]:text-background">
            <Check class="size-2.5 opacity-0 transition-opacity group-data-[state=checked]:opacity-100" />
          </RadioGroup.Item>
          <Label.Root for={`skillbar-${type.value}`} class="cursor-pointer text-sm font-medium text-text/80">{type.label}</Label.Root>
        </div>
      {/each}
    </RadioGroup.Root>

    {#if workingTheme.backgrounds.skillbar.type === "color"}
      <div class="flex flex-col gap-1.5">
        <Label.Root for="skillbar-color" class="text-xs font-semibold text-text/80">Color</Label.Root>
        <input
          id="skillbar-color"
          type="color"
          value={oklchToHex(workingTheme.backgrounds.skillbar.color)}
          oninput={(e) => {
            workingTheme.backgrounds.skillbar.color = hexToOklch(e.currentTarget.value);
          }}
          class="h-8 w-full cursor-pointer rounded-md border border-text/10 bg-text/5 transition-colors focus:border-link focus:outline-none" />
      </div>
    {:else}
      <div class="grid grid-cols-2 gap-3">
        <div class="flex flex-col gap-1.5">
          <Label.Root for="skillbar-angle" class="text-xs font-semibold text-text/80">Angle</Label.Root>
          <input id="skillbar-angle" type="text" bind:value={workingTheme.backgrounds.skillbar.angle} class="w-full rounded-md border border-text/10 bg-text/5 px-2 py-1.5 font-mono text-xs text-text transition-colors focus:border-link focus:outline-none" />
        </div>
        <div class="flex flex-col gap-1.5">
          <Label.Root for="skillbar-width" class="text-xs font-semibold text-text/80">Width</Label.Root>
          <input id="skillbar-width" type="number" bind:value={workingTheme.backgrounds.skillbar.width} class="w-full rounded-md border border-text/10 bg-text/5 px-2 py-1.5 font-mono text-xs text-text transition-colors focus:border-link focus:outline-none" />
        </div>
        <div class="flex flex-col gap-1.5">
          <Label.Root for="skillbar-color1" class="text-xs font-semibold text-text/80">Color 1</Label.Root>
          <input
            id="skillbar-color1"
            type="color"
            value={oklchToHex(workingTheme.backgrounds.skillbar.colors[0])}
            oninput={(e) => {
              workingTheme.backgrounds.skillbar.colors[0] = hexToOklch(e.currentTarget.value);
            }}
            class="h-8 w-full cursor-pointer rounded-md border border-text/10 bg-text/5 transition-colors focus:border-link focus:outline-none" />
        </div>
        <div class="flex flex-col gap-1.5">
          <Label.Root for="skillbar-color2" class="text-xs font-semibold text-text/80">Color 2</Label.Root>
          <input
            id="skillbar-color2"
            type="color"
            value={oklchToHex(workingTheme.backgrounds.skillbar.colors[1])}
            oninput={(e) => {
              workingTheme.backgrounds.skillbar.colors[1] = hexToOklch(e.currentTarget.value);
            }}
            class="h-8 w-full cursor-pointer rounded-md border border-text/10 bg-text/5 transition-colors focus:border-link focus:outline-none" />
        </div>
      </div>
    {/if}
  </div>

  <div class="flex flex-col gap-4">
    <h3 class="text-sm font-bold tracking-wider text-text/60 uppercase">Maxedbar Background</h3>

    <RadioGroup.Root value={workingTheme.backgrounds.maxedbar.type} onValueChange={(v) => setBackgroundType("maxedbar", v as "color" | "stripes")} class="flex gap-4">
      {#each backgroundTypes as type, index (index)}
        <div class="flex items-center gap-2">
          <RadioGroup.Item value={type.value} id={`maxedbar-${type.value}`} class="group flex size-4 items-center justify-center rounded-full border border-text/20 bg-text/5 text-link transition-all hover:bg-text/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-link data-[state=checked]:bg-link data-[state=checked]:text-background">
            <Check class="size-2.5 opacity-0 transition-opacity group-data-[state=checked]:opacity-100" />
          </RadioGroup.Item>
          <Label.Root for={`maxedbar-${type.value}`} class="cursor-pointer text-sm font-medium text-text/80">{type.label}</Label.Root>
        </div>
      {/each}
    </RadioGroup.Root>

    {#if workingTheme.backgrounds.maxedbar.type === "color"}
      <div class="flex flex-col gap-1.5">
        <Label.Root for="maxedbar-color" class="text-xs font-semibold text-text/80">Color</Label.Root>
        <input
          id="maxedbar-color"
          type="color"
          value={oklchToHex(workingTheme.backgrounds.maxedbar.color)}
          oninput={(e) => {
            workingTheme.backgrounds.maxedbar.color = hexToOklch(e.currentTarget.value);
          }}
          class="h-8 w-full cursor-pointer rounded-md border border-text/10 bg-text/5 transition-colors focus:border-link focus:outline-none" />
      </div>
    {:else}
      <div class="grid grid-cols-2 gap-3">
        <div class="flex flex-col gap-1.5">
          <Label.Root for="maxedbar-angle" class="text-xs font-semibold text-text/80">Angle</Label.Root>
          <input id="maxedbar-angle" type="text" bind:value={workingTheme.backgrounds.maxedbar.angle} class="w-full rounded-md border border-text/10 bg-text/5 px-2 py-1.5 font-mono text-xs text-text transition-colors focus:border-link focus:outline-none" />
        </div>
        <div class="flex flex-col gap-1.5">
          <Label.Root for="maxedbar-width" class="text-xs font-semibold text-text/80">Width</Label.Root>
          <input id="maxedbar-width" type="number" bind:value={workingTheme.backgrounds.maxedbar.width} class="w-full rounded-md border border-text/10 bg-text/5 px-2 py-1.5 font-mono text-xs text-text transition-colors focus:border-link focus:outline-none" />
        </div>
        <div class="flex flex-col gap-1.5">
          <Label.Root for="maxedbar-color1" class="text-xs font-semibold text-text/80">Color 1</Label.Root>
          <input
            id="maxedbar-color1"
            type="color"
            value={oklchToHex(workingTheme.backgrounds.maxedbar.colors[0])}
            oninput={(e) => {
              workingTheme.backgrounds.maxedbar.colors[0] = hexToOklch(e.currentTarget.value);
            }}
            class="h-8 w-full cursor-pointer rounded-md border border-text/10 bg-text/5 transition-colors focus:border-link focus:outline-none" />
        </div>
        <div class="flex flex-col gap-1.5">
          <Label.Root for="maxedbar-color2" class="text-xs font-semibold text-text/80">Color 2</Label.Root>
          <input
            id="maxedbar-color2"
            type="color"
            value={oklchToHex(workingTheme.backgrounds.maxedbar.colors[1])}
            oninput={(e) => {
              workingTheme.backgrounds.maxedbar.colors[1] = hexToOklch(e.currentTarget.value);
            }}
            class="h-8 w-full cursor-pointer rounded-md border border-text/10 bg-text/5 transition-colors focus:border-link focus:outline-none" />
        </div>
      </div>
    {/if}
  </div>

  <div class="flex flex-col gap-4">
    <h3 class="text-sm font-bold tracking-wider text-text/60 uppercase">Page Background</h3>

    <div class="flex flex-col gap-1.5">
      <div class="flex items-center gap-2">
        <ImageIcon class="size-4 text-text/60" />
        <Label.Root for="page-bg-url" class="text-xs font-semibold text-text/80">Image URL</Label.Root>
      </div>
      <p class="text-[10px] text-text/40">Must start with https://</p>
      <input
        id="page-bg-url"
        type="url"
        value={workingTheme.backgrounds.page?.url ?? ""}
        oninput={(e) => {
          const val = e.currentTarget.value;
          if (!val) {
            workingTheme.backgrounds.page = undefined;
          } else {
            workingTheme.backgrounds.page = { url: val };
          }
        }}
        class="w-full rounded-md border border-text/10 bg-text/5 px-2 py-1.5 font-mono text-xs text-text transition-colors user-invalid:border-red-500 user-invalid:text-red-500 focus:border-link focus:outline-none"
        placeholder="https://imgur.com/..."
        pattern="^https://.*" />
    </div>
  </div>

  <div class="flex flex-col gap-4">
    <h3 class="text-sm font-bold tracking-wider text-text/60 uppercase">Enchanted Glint</h3>

    <div class="flex flex-col gap-1.5">
      <div class="flex items-center gap-2">
        <Sparkles class="size-4 text-text/60" />
        <Label.Root for="enchanted-glint-url" class="text-xs font-semibold text-text/80">Glint Texture URL</Label.Root>
      </div>
      <p class="text-[10px] text-text/40">Custom enchanted glint texture. Must start with https://. Leave empty for default.</p>
      <input
        id="enchanted-glint-url"
        type="url"
        value={workingTheme.enchantedGlint ?? ""}
        oninput={(e) => {
          const val = e.currentTarget.value;
          if (!val) {
            workingTheme.enchantedGlint = undefined;
          } else {
            workingTheme.enchantedGlint = val;
          }
        }}
        class="w-full rounded-md border border-text/10 bg-text/5 px-2 py-1.5 font-mono text-xs text-text transition-colors user-invalid:border-red-500 user-invalid:text-red-500 focus:border-link focus:outline-none"
        placeholder="https://example.com/glint.png"
        pattern="^https://.*" />
    </div>
  </div>
</div>
