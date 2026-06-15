<script lang="ts">
  import { getHoverContext } from "$ctx";
  import { env } from "$env/dynamic/public";
  import { PUBLIC_COMMIT_HASH } from "$env/static/public";
  import { flyAndScale } from "$lib/shared/utils";
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import Info from "@lucide/svelte/icons/info";
  import { Button, Popover } from "bits-ui";
  import { Drawer } from "vaul-svelte";

  const isHover = getHoverContext();

  const { PUBLIC_DISCORD_INVITE, PUBLIC_PATREON } = env;
  const packageVersion = __NPM_PACKAGE_VERSION__;
  const commitHash = PUBLIC_COMMIT_HASH;
</script>

{#snippet info()}
  <p class="my-4">SkyCrypt is a free, open-source stats viewer for Hypixel SkyBlock.</p>
  {#if __NPM_PACKAGE_VERSION__ || PUBLIC_COMMIT_HASH}
    <p>
      Currently running version
      <span class="font-semibold">
        {#if packageVersion}<Button.Root class="text-link" rel="noreferrer" href="https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/releases/tag/v{packageVersion}" target="_blank">{packageVersion}</Button.Root>{/if}
        {#if commitHash}
          <span class="opacity-50">
            {#if packageVersion}({/if}<Button.Root class="text-link" rel="noreferrer" href="https://github.com/SkyCryptWebsite/SkyCrypt-Frontend/commit/{commitHash}" target="_blank">{commitHash}</Button.Root>{#if packageVersion}){/if}
          </span>
        {/if}
      </span>
    </p>
  {:else}
    <p>Version information is not available.</p>
  {/if}
  <p class="my-4">
    You can report bugs, suggest features on <Button.Root class="font-semibold text-link" href={PUBLIC_DISCORD_INVITE} target="_blank" rel="noreferrer">Discord</Button.Root>, and/or contribute to the code on <Button.Root class="font-semibold text-link" href="https://github.com/SkyCryptWebsite" target="_blank" rel="noreferrer">GitHub</Button.Root>. It would be much appreciated!
  </p>
  <p class="my-4">
    SkyCrypt Frontend is open source under GNU AGPLv3. View the source on <Button.Root class="font-semibold text-link" href="https://github.com/SkyCryptWebsite/SkyCrypt-Frontend" target="_blank" rel="noreferrer">GitHub</Button.Root>.
  </p>
  <p class="my-4">
    Join our community on <Button.Root class="font-semibold text-link" href={PUBLIC_DISCORD_INVITE} target="_blank" rel="noreferrer">Discord</Button.Root>!
  </p>
  <p class="my-4">
    Help keep SkyCrypt ad free by donating on <Button.Root class="font-semibold text-link" href={PUBLIC_PATREON} target="_blank" rel="noreferrer">Patreon</Button.Root>!
  </p>
  <p class="my-4">
    The original project, <Button.Root class="font-semibold text-link" href="https://sky.lea.moe">sky.lea.moe</Button.Root>, was created by
    <Button.Root class="font-semibold text-link" href="https://github.com/LeaPhant" target="_blank" rel="noreferrer">LeaPhant</Button.Root>. Thanks for all of what you've done Lea!
  </p>
  <Button.Root class="flex items-center-safe gap-1 font-semibold text-link" href="https://github.com/SkyCryptWebsite/SkyCrypt-Frontend#credits" target="_blank">
    Used Resources <ExternalLink class="size-4" />
  </Button.Root>
{/snippet}

{#if isHover.current}
  <Popover.Root>
    <Popover.Trigger class="relative my-3 flex shrink items-center justify-center rounded-full text-sm font-semibold text-background/80 uppercase transition-all duration-100 ease-out @md:bg-text/70 @md:p-1 @md:px-2.5 @md:hover:bg-text/80 @md:hover:text-background">
      <Info class="size-5 fill-text stroke-header @md:hidden" />
      <span class="hidden @md:inline">About</span>
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content forceMount side="bottom" sideOffset={20} align="center" collisionPadding={8} class="z-50 max-w-lg overflow-x-clip overflow-y-auto rounded-lg bg-background-grey/95 px-8 py-4">
        {#snippet child({ wrapperProps, props, open })}
          {#if open}
            <div {...wrapperProps}>
              <div {...props} transition:flyAndScale>
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
    <Drawer.Trigger class="relative my-3 flex shrink items-center justify-center rounded-full text-sm font-semibold text-background/80 uppercase transition-all duration-100 ease-out @md:bg-text/70 @md:p-1 @md:px-2.5 @md:hover:bg-text/80 @md:hover:text-background">
      <Info class="size-5 fill-text stroke-header @md:hidden" />
      <span class="hidden @md:inline">About</span>
    </Drawer.Trigger>
    <Drawer.Portal>
      <Drawer.Overlay class="fixed inset-0 z-40 bg-black/80" />
      <Drawer.Content class="fixed right-0 bottom-0 left-0 z-50 flex max-h-[96%] flex-col rounded-t-[10px] bg-background-lore">
        <div class="mx-auto w-full max-w-md overflow-auto p-6">
          {@render info()}
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
{/if}
