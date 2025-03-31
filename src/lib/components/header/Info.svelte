<script lang="ts">
  import { PUBLIC_DISCORD_INVITE, PUBLIC_PATREON } from "$env/static/public";
  import type { IsHover } from "$lib/hooks/is-hover.svelte";
  import { flyAndScale } from "$lib/shared/utils";
  import Info from "@lucide/svelte/icons/info";
  import { Button, Popover } from "bits-ui";
  import { getContext } from "svelte";
  import { Drawer } from "vaul-svelte";

  const isHover = getContext<IsHover>("isHover");
</script>

{#snippet info()}
  <p class="my-4">SkyCrypt is a free, open-source stats viewer for Hypixel SkyBlock.</p>
  <p class="my-4">
    You can report bugs, suggest features on <Button.Root class="text-link font-semibold" href={PUBLIC_DISCORD_INVITE} target="_blank" rel="noreferrer">Discord</Button.Root>, and/or contribute to the code on <Button.Root class="text-link font-semibold" href="https://github.com/SkyCryptWebsite/SkyCryptv2" target="_blank" rel="noreferrer">GitHub</Button.Root>. It would be much appreciated!
  </p>
  <p class="my-4">
    Join our community on <Button.Root class="text-link font-semibold" href={PUBLIC_DISCORD_INVITE} target="_blank" rel="noreferrer">Discord</Button.Root>!
  </p>
  <p class="my-4">
    Help keep SkyCrypt ad free by donating on <Button.Root class="text-link font-semibold" href={PUBLIC_PATREON} target="_blank" rel="noreferrer">Patreon</Button.Root>!
  </p>
  <p class="my-4">
    The original project, <Button.Root class="text-link font-semibold" href="https://sky.lea.moe">sky.lea.moe</Button.Root>, was created by
    <Button.Root class="text-link font-semibold" href="https://github.com/LeaPhant" target="_blank" rel="noreferrer">LeaPhant</Button.Root>. Thanks for all of what you've done Lea!
  </p>
  <h4 class="mt-5 mb-4 font-bold">Used Resources:</h4>
  <ul class="list-inside list-disc [&_ul]:mb-2 [&_ul]:list-inside [&_ul]:list-[revert] [&_ul]:pl-5">
    <li>
      Custom Textures:
      <ul>
        <li>
          <Button.Root class="text-link font-semibold" rel="noreferrer" href="https://hypixel.net/threads/4101579" target="_blank">FurfSky Reborn</Button.Root>
          by <span class="text-text/70">The Reborn Team</span>
        </li>
        <li>
          <Button.Root class="text-link font-semibold" rel="noreferrer" href="https://hypixel.net/threads/3470904" target="_blank">RNBW+</Button.Root>
          by <span class="text-text/70">rainbowcraft2</span>
        </li>
        <li>
          <Button.Root class="text-link font-semibold" rel="noreferrer" href="https://hypixel.net/threads/2103515" target="_blank">Hypixel Skyblock Pack</Button.Root>
          by <span class="text-text/70">Packs HQ</span>
        </li>
        <li>
          <Button.Root class="text-link font-semibold" rel="noreferrer" href="https://hypixel.net/threads/4174260" target="_blank">Hypixel Plus</Button.Root>
          by <span class="text-text/70">ic22487</span>
        </li>
        <li>
          <Button.Root class="text-link font-semibold" rel="noreferrer" href="https://hypixel.net/threads/2147652" target="_blank">Vanilla+</Button.Root>
          by <span class="text-text/70">TBlazeWarriorT</span>
        </li>
        <li>
          <Button.Root class="text-link font-semibold" rel="noreferrer" href="https://hypixel.net/threads/3597207" target="_blank">Worlds and Beyond</Button.Root>
          by <span class="text-text/70">Skeletony_</span>
        </li>
        <li>
          <Button.Root class="text-link font-semibold" rel="noreferrer" href="https://www.minecraft.net/" target="_blank">Default Minecraft Textures</Button.Root>
          by <span class="text-text/70">Mojang</span>
        </li>
      </ul>
    </li>
    <li>
      Background Image:
      <ul>
        <li>
          Resource Pack: <Button.Root class="text-link font-semibold" rel="noreferrer" href="https://www.planetminecraft.com/texture_pack/16x132-dandelion-cute-and-swirly/" target="_blank">Dandelion</Button.Root>
          by <span class="text-text/70">Steelfeathers</span>
        </li>
        <li>
          Shaders: <Button.Root class="text-link font-semibold" rel="noreferrer" href="https://sildurs-shaders.github.io/" target="_blank">Sildur's Vibrant Shaders</Button.Root>
          by <span class="text-text/70">Sildur</span>
        </li>
      </ul>
    </li>
    <li>
      3D Skin View: <Button.Root class="text-link font-semibold" rel="noreferrer" href="https://github.com/bs-community/skinview3d/" target="_blank">skinview3d</Button.Root>
      by <span class="text-text/70">BS-Community</span>
    </li>
    <li>
      Farming Weight: <Button.Root class="text-link font-semibold" rel="noreferrer" href="https://elitebot.dev/" target="_blank">Elite</Button.Root>
      by <span class="text-text/70">Kaeso</span>
    </li>
    <li>
      Networth: <Button.Root class="text-link font-semibold" rel="noreferrer" href="https://github.com/Altpapier/SkyHelper-Networth" target="_blank">SkyHelper Networth</Button.Root>
      by <span class="text-text/70">SkyHelper</span>
    </li>
    <li>
      Player Heads: <Button.Root class="text-link font-semibold" rel="noreferrer" href="https://hypixel.net" target="_blank">SkyBlock</Button.Root>
      by <span class="text-text/70">Hypixel</span>
    </li>
    <li>
      Player Data: <Button.Root class="text-link font-semibold" rel="noreferrer" href="https://api.hypixel.net" target="_blank">Hypixel API</Button.Root>
      by <span class="text-text/70">Hypixel</span>
    </li>
    <li>
      Game Data: <Button.Root class="text-link font-semibold" rel="noreferrer" href="https://github.com/NotEnoughUpdates/NotEnoughUpdates-REPO" target="_blank">NotEnoughUpdates-REPO</Button.Root>
      by <span class="text-text/70">NEU</span>
    </li>
  </ul>
{/snippet}

{#if isHover.current}
  <Popover.Root>
    <Popover.Trigger class="text-background/80 @md:bg-text/70 @md:hover:bg-text/80 @md:hover:text-background relative my-3 flex shrink items-center justify-center rounded-full text-sm font-semibold uppercase transition-all duration-100 @md:p-1 @md:px-2.5">
      <Info class="fill-text stroke-header size-5 @md:hidden" />
      <span class="hidden @md:inline">About</span>
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content forceMount side="bottom" sideOffset={8} align="center" collisionPadding={8} class="bg-background-grey/95 z-50 max-h-96 max-w-[32rem] overflow-x-clip overflow-y-auto rounded-lg px-8 py-4">
        {#snippet child({ wrapperProps, props, open })}
          {#if open}
            <div {...wrapperProps}>
              <div {...props} transition:flyAndScale={{ y: 8, duration: 300 }}>
                {@render info()}
              </div>
            </div>
          {/if}
        {/snippet}
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
{:else}
  <Drawer.Root shouldScaleBackground={true} setBackgroundColorOnScale={false}>
    <Drawer.Trigger class="text-background/80 @md:bg-text/70 @md:hover:bg-text/80 @md:hover:text-background relative my-3 flex shrink items-center justify-center rounded-full text-sm font-semibold uppercase transition-all duration-100 @md:p-1 @md:px-2.5">
      <Info class="fill-text stroke-header size-5 @md:hidden" />
      <span class="hidden @md:inline">About</span>
    </Drawer.Trigger>
    <Drawer.Portal>
      <Drawer.Overlay class="fixed inset-0 z-40 bg-black/80" />
      <Drawer.Content class="bg-background-lore fixed right-0 bottom-0 left-0 z-50 flex max-h-[96%] flex-col rounded-t-[10px]">
        <div class="mx-auto w-full max-w-md overflow-auto p-6">
          {@render info()}
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
{/if}
