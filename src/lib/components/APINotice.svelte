<script lang="ts">
  import { getHoverContext, getProfileContext } from "$ctx";
  import { flyAndScale } from "$lib/shared/utils";
  import X from "@lucide/svelte/icons/x";
  import { Dialog } from "bits-ui";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import { Drawer } from "vaul-svelte";

  const profile = $derived(getProfileContext());

  const apiSettings = $derived(Object.entries(profile.apiSettings ?? {}).filter(([_, value]) => !value));

  const isHover = getHoverContext();
</script>

<div class="mx-auto w-full max-w-lg overflow-clip rounded-lg bg-background/30">
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
  <video preload="metadata" poster="/img/enable-api-thumbnail.avif" muted loop disablepictureinpicture disableremoteplayback controlslist="nodownload noremoteplayback noplaybackrate" controls autoplay playsinline class="data-[is-hover=false]:rounded-t-lg data-[is-hover=true]:rounded-lg" data-is-hover={isHover.current}>
    <!-- Best quality (AV1 in WebM) -->
    <source src="/video/enable-api-av1.webm" type="video/webm; codecs=av01" />

    <!-- AV1 in MP4 (Safari 17+ on new Apple chips) -->
    <source src="/video/enable-api-av1.mp4" type="video/mp4; codecs=av01" />

    <!-- VP9 in WebM (modern fallback) -->
    <source src="/video/enable-api-vp9.webm" type="video/webm; codecs=vp9" />

    <!-- H.264 MP4 (universal fallback) -->
    <source src="/video/enable-api-h264.mp4" type="video/mp4" />

    Your browser does not support the video tag.
  </video>
{/snippet}

{#snippet modal()}
  <Dialog.Root>
    <Dialog.Trigger class="text-link underline">See here</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay forceMount class="fixed inset-0 z-40 bg-black/80">
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:fade={{ duration: 300, easing: cubicOut }}></div>
          {/if}
        {/snippet}
      </Dialog.Overlay>
      <Dialog.Content forceMount class="fixed top-[50%] left-[50%] z-50 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 p-5">
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:flyAndScale>
              {@render video()}
              <Dialog.Close class="absolute top-6 right-6 p-2 text-text/80">
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
