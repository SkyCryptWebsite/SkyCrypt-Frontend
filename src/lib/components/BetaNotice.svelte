<script lang="ts">
  import { flyAndScale } from "$lib/shared/utils";
  import CircleQuestionMark from "@lucide/svelte/icons/circle-question-mark";
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  import { Popover } from "bits-ui";
</script>

<footer class="fixed -bottom-0.5 left-0 z-30 w-full p-[env(safe-area-inset-top,0)] pr-[max(0.625rem,env(safe-area-inset-right))] pb-[env(safe-area-inset-bottom,0)] pl-[max(0.625rem,env(safe-area-inset-left))] leading-[3rem]">
  <div class="relative mx-auto w-fit rounded-t-md border-2 border-yellow-300 bg-yellow-800 px-2.5 text-yellow-300">
    <p class="flex items-center gap-x-1.5"><TriangleAlert class="size-5" />This is the SkyCrypt development site</p>
    <Popover.Root>
      <Popover.Trigger class="absolute -top-3 -right-2.5 ">
        <div class="absolute top-1/2 left-1/2 size-5 -translate-1/2 rounded-full bg-yellow-800"></div>
        <CircleQuestionMark class="relative z-10 size-6" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content forceMount side="bottom" sideOffset={8} align="center" collisionPadding={8} class="bg-background-grey/95 z-50 max-h-96 max-w-[32rem] overflow-x-clip overflow-y-auto rounded-lg px-8 py-4 ">
          {#snippet child({ wrapperProps, props, open })}
            {#if open}
              <div {...wrapperProps}>
                <div {...props} transition:flyAndScale>
                  <h2 class="mb-2 text-lg font-bold">Beta Notice</h2>
                  <p class="mb-2">You're currently on the SkyCrypt development site (cupcake) This version contains the latest features and updates, but it may also have bugs or incomplete functionalities.</p>
                  <p class="mb-2">
                    Please use this site with caution and report any issues you encounter. For the stable version of SkyCrypt (sky), please visit <a href="https://skycrypt.com" class="text-link underline">sky.shiiyu.com</a>.
                  </p>
                </div>
              </div>
            {/if}
          {/snippet}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  </div>
</footer>
