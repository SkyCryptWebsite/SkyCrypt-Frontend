<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import type { IsHover } from "$lib/hooks/is-hover.svelte";
  import { flyAndScale } from "$lib/shared/utils";
  import X from "@lucide/svelte/icons/x";
  import { Dialog } from "bits-ui";
  import { getContext } from "svelte";
  import { fade } from "svelte/transition";
  import { Drawer } from "vaul-svelte";

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);

  const apiSettings = $derived(Object.entries(profile.apiSettings).filter(([_, value]) => !value));

  const isHover = getContext<IsHover>("isHover");
</script>

<div class="bg-background/30 mx-auto w-full max-w-lg overflow-clip rounded-lg">
  <div class="bg-icon py-1 text-center text-xl font-semibold uppercase">Notice</div>
  <div class="p-5 text-center text-base font-medium text-pretty">
    <p>
      {#each apiSettings as [key, _], index (index)}
        {#if index === apiSettings.length - 1 && index > 0}
          &nbsp;and
        {/if}
        <span class="inline-block whitespace-nowrap capitalize">{key.replaceAll("_", " ")}</span>{#if index < apiSettings.length - 1},{/if}
      {/each}
      {apiSettings.length === 1 ? "is" : "are"} not available for {profile.username} due to limited API access.
    </p>
    <p>
      {#if isHover.current}
        {@render modal()}
      {:else}
        {@render drawer()}
      {/if}
      how to enable full API access.
    </p>
  </div>
</div>

{#snippet video()}
  <video preload="metadata" muted loop disablepictureinpicture disableremoteplayback controlslist="nodownload noremoteplayback noplaybackrate" controls autoplay playsinline class="data-[is-hover=false]:rounded-t-lg data-[is-hover=true]:rounded-lg" data-is-hover={isHover.current}>
    <source type="video/webm" src="/video/enable-api.webm" />
    <source type="video/mp4" src="/video/enable-api.mp4" />
  </video>
{/snippet}

{#snippet modal()}
  <Dialog.Root>
    <Dialog.Trigger class="text-link underline">See here</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay forceMount class="fixed inset-0 z-40 bg-black/80">
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:fade></div>
          {/if}
        {/snippet}
      </Dialog.Overlay>
      <Dialog.Content forceMount class="fixed top-[50%] left-[50%] z-50 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 p-5">
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:flyAndScale>
              {@render video()}
              <Dialog.Close class="text-text/80 absolute top-6 right-6 p-2">
                <X class="size-6" />
              </Dialog.Close>
            </div>
          {/if}
        {/snippet}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
{/snippet}

{#snippet drawer()}
  <Drawer.Root shouldScaleBackground={true} setBackgroundColorOnScale={false}>
    <Drawer.Trigger class="text-link underline">See here</Drawer.Trigger>
    <Drawer.Portal>
      <Drawer.Overlay class="fixed inset-0 z-40 bg-black/80" />
      <Drawer.Content class="fixed right-0 bottom-0 left-0 z-50 max-h-[96%]">
        {@render video()}
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
{/snippet}
