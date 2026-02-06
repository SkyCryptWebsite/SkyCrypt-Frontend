<script lang="ts">
  import { getHoverContext, getPreferences } from "$ctx";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import CircleQuestionMark from "@lucide/svelte/icons/circle-question-mark";
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  import { Button, Dialog } from "bits-ui";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import { Drawer } from "vaul-svelte";
  const isHover = getHoverContext();
  const preferences = getPreferences();
  let noticeOpen = $state(false);
</script>

<footer class="fixed -bottom-0.5 left-0 z-30 w-full p-[env(safe-area-inset-top,0)] pr-[max(0.625rem,env(safe-area-inset-right))] pb-[env(safe-area-inset-bottom,0)] pl-[max(0.625rem,env(safe-area-inset-left))] leading-12">
  <div class="relative mx-auto w-fit rounded-t-md border-2 border-yellow-300 bg-yellow-800 px-2.5 text-yellow-300">
    <p class="flex items-center gap-x-1.5"><TriangleAlert class="size-5" />This is the SkyCrypt development site</p>
    <Button.Root class="absolute -top-3 -right-2.5" onpointerdown={() => (noticeOpen = !noticeOpen)}>
      <div class="absolute top-1/2 left-1/2 size-5 -translate-1/2 rounded-full bg-yellow-800"></div>
      <CircleQuestionMark class="relative z-10 size-6" />
    </Button.Root>
  </div>
</footer>

{#if !isHover.current}
  {@render mobileNotice()}
{:else}
  {@render desktopNotice()}
{/if}

{#snippet desktopNotice()}
  <Dialog.Root bind:open={noticeOpen}>
    <Dialog.Portal>
      <Dialog.Overlay forceMount class={cn("fixed inset-0 z-40", preferences.performanceMode ? "bg-background-lore" : "backdrop-blur-lg backdrop-brightness-50")}>
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:fade={{ duration: 150, easing: cubicOut }}></div>
          {/if}
        {/snippet}
      </Dialog.Overlay>
      <Dialog.Content forceMount class={cn("fixed top-[50%] left-[50%] z-50 flex max-h-[calc(96%-3rem)] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg p-4 font-icomoon select-text", preferences.performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-50")}>
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:flyAndScale>
              {@render notice()}
            </div>
          {/if}
        {/snippet}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
{/snippet}

{#snippet mobileNotice()}
  <Drawer.Root bind:open={noticeOpen} shouldScaleBackground={false} setBackgroundColorOnScale={false}>
    <Drawer.Portal>
      <Drawer.Overlay class="fixed inset-0 z-40 bg-black/80" />
      <Drawer.Content class="fixed right-0 bottom-0 left-0 z-50 flex max-h-[96%] flex-col rounded-t-[10px] bg-background-lore">
        <div class="mx-auto w-full max-w-md overflow-auto p-6">
          {@render notice?.()}
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
{/snippet}

{#snippet notice()}
  <h2 class="mb-2 text-lg font-bold">Beta Notice</h2>
  <p class="mb-2">You're currently on the SkyCrypt development site (cupcake) This version contains the latest features and updates, but it may also have bugs or incomplete functionalities.</p>
  <p class="mb-2">
    Please use this site with caution and report any issues you encounter. For the stable version of SkyCrypt (sky), please visit <a href="https://sky.shiiyu.moe" class="text-link underline">sky.shiiyu.moe</a>.
  </p>
{/snippet}
