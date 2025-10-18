<script lang="ts" module>
  function changeTheme(themeId: Theme["id"]) {
    const theme = themes.find((theme) => theme.id === themeId);
    if (!theme) {
      themeStore.set("default");
      document.documentElement.dataset.theme = "default";
      return;
    }
    if (theme.light) {
      document.documentElement.dataset.mode = "light";
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.dataset.mode = "dark";
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }

    document.documentElement.dataset.theme = theme.id;
  }
  export { changeTheme };
</script>

<script lang="ts">
  import { SettingsTab } from "$lib/components/header/types";
  import type { Theme } from "$lib/shared/constants/themes";
  import themes from "$lib/shared/constants/themes";
  import { theme as themeStore } from "$lib/stores/themes";
  import Check from "@lucide/svelte/icons/check";
  import PaintBucket from "@lucide/svelte/icons/paint-bucket";
  import { Avatar, Label, RadioGroup, Tabs } from "bits-ui";
</script>

<Tabs.Content value={SettingsTab.Themes}>
  <div class="flex items-start gap-2 rounded-lg p-2 font-semibold">
    <PaintBucket class="size-5 h-lh shrink-0" />
    <div>
      <h4>Themes</h4>

      <p class="text-text/60">Themes change the colors of SkyCrypt.</p>
    </div>
  </div>
  <RadioGroup.Root class="mt-4 flex max-h-96 flex-col gap-4 overflow-x-clip overflow-y-auto" bind:value={$themeStore} onValueChange={changeTheme}>
    {#each themes as theme (theme.id)}
      <Label.Root for={theme.id} class="bg-text/[0.05] flex items-center justify-between gap-4 rounded-lg p-2">
        <div class="flex items-center gap-2">
          <Avatar.Root class="shrink-0 select-none">
            <Avatar.Image loading="lazy" src={`/api/themes/${btoa(theme["colors"]!.logo)}${theme.light ? "/true" : ""}/logo.svg`} alt={theme.name} class="pointer-events-none aspect-square size-10 h-full rounded-lg select-none"></Avatar.Image>
            <Avatar.Fallback class="flex items-center rounded-lg text-center font-semibold uppercase">{theme.name.slice(0, 2)}</Avatar.Fallback>
          </Avatar.Root>
          <div class="flex flex-col">
            <h4 class="text-text/90 font-semibold">{theme.name}</h4>
            <p class="text-text/60 overflow-hidden font-normal text-ellipsis whitespace-nowrap">
              by
              <span class="text-text/80">{theme.author}</span>
            </p>
          </div>
        </div>
        <RadioGroup.Item id={theme.id} value={theme.id} class="group inline-flex h-6 min-h-6 w-10 shrink-0 cursor-pointer items-center rounded-full px-0 transition-colors ease-out">
          <Check class="text-icon size-6 group-data-[state=unchecked]:invisible" />
        </RadioGroup.Item>
      </Label.Root>
    {/each}
  </RadioGroup.Root>
</Tabs.Content>
