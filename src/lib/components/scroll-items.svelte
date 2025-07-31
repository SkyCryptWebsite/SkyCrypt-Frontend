<script lang="ts">
  import { ScrollArea } from "bits-ui";
  import type { Snippet } from "svelte";

  type Props = {
    children?: Snippet;
  };
  let { children }: Props = $props();
</script>

<ScrollArea.Root class="relative max-w-full" type="scroll">
  <ScrollArea.Viewport class="max-md:pb-4">
    <div class="flex! flex-nowrap gap-4 md:flex-wrap">
      {@render children?.()}
    </div>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="horizontal" class="flex h-2.5 w-full touch-none rounded-full transition-all ease-out select-none md:hidden">
    <ScrollArea.Thumb class="bg-icon flex rounded-full" />
  </ScrollArea.Scrollbar>
  <ScrollArea.Corner />
</ScrollArea.Root>
