<script lang="ts">
  import { getDisabledPacks, getPacksContext } from "$ctx";
  import { SettingsTab } from "$lib/components/header/types";
  import PackageOpen from "@lucide/svelte/icons/package-open";
  import { Avatar, Button, Label, Switch, Tabs } from "bits-ui";

  const disabledPacks = getDisabledPacks();
  const initialPackConfig = disabledPacks.current;
  const hasPackConfigChanged = $derived(JSON.stringify(disabledPacks.current.toSorted()) !== JSON.stringify(initialPackConfig.toSorted()));
  const packsContext = $derived(getPacksContext());
  const packs = $derived(packsContext.packs);
</script>

<Tabs.Content value={SettingsTab.Packs}>
  <div class="flex items-start gap-2 rounded-lg p-2 font-semibold">
    <PackageOpen class="size-5 h-lh shrink-0" />
    <div>
      <h4>Packs</h4>
      <div class="space-y-2">
        <p class="text-text/60">Resource packs change the textures of items, mobs and other elements in SkyCrypt.</p>
        <p class="text-text/60">You can enable or disable as many packs as you want, but their preference order can't be changed.</p>
      </div>
    </div>
  </div>
  {#if packs.length > 0}
    <div class="mt-4 flex max-h-96 flex-col gap-4 overflow-x-clip overflow-y-auto">
      {#each packs as pack (pack.id)}
        <Label.Root for={pack.id} class="flex items-center justify-between gap-4 rounded-lg bg-text/5 p-2">
          <div class="flex items-center gap-2">
            <Avatar.Root class="shrink-0 select-none">
              <Avatar.Image loading="lazy" src={pack.icon} alt={pack.name} class="pointer-events-none aspect-square size-10 h-full rounded-lg select-none [image-rendering:pixelated]" />
              <Avatar.Fallback class="flex items-center rounded-lg text-center font-semibold uppercase">{pack.name?.slice(0, 2)}</Avatar.Fallback>
            </Avatar.Root>
            <div class="flex flex-col">
              <h4 class="font-semibold text-text/90"><Button.Root href={pack.url} target="_blank" rel="noopener noreferrer" class="text-link hover:underline">{pack.name}</Button.Root> <small>{pack.version}</small></h4>
              <p class="overflow-hidden font-normal text-ellipsis whitespace-nowrap text-text/60">
                by
                <span class="text-text/80">{pack.author}</span>
              </p>
            </div>
          </div>
          {#if pack.id}
            <Switch.Root id={pack.id} checked={!disabledPacks.current.includes(pack.id)} class="peer inline-flex h-6 min-h-6 w-10 shrink-0 cursor-pointer items-center rounded-full px-0 transition-colors ease-out data-[state=checked]:bg-icon data-[state=unchecked]:bg-text/30" onCheckedChange={() => (disabledPacks.current = !disabledPacks.current.includes(pack.id ?? "") ? [...new Set([...disabledPacks.current, pack.id ?? ""])] : disabledPacks.current.filter((id) => id !== (pack.id ?? "")))}>
              <Switch.Thumb class="pointer-events-none block size-4 shrink-0 rounded-full bg-text transition-transform ease-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-1" />
            </Switch.Root>
          {/if}
        </Label.Root>
      {/each}
    </div>
  {:else}
    <p class="mt-4 text-center text-sm text-text/60">No packs available.</p>
  {/if}
  {#if hasPackConfigChanged}
    <Button.Root
      class="mt-4 w-full rounded-lg bg-text/65 p-1.5 text-sm font-semibold text-background/80 uppercase transition-colors ease-out hover:bg-text/80"
      onclick={() => {
        document.cookie = `disabledPacks=${JSON.stringify(disabledPacks.current)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
        window.location.reload();
      }}>
      Reload to apply changes
    </Button.Root>
  {/if}
</Tabs.Content>
