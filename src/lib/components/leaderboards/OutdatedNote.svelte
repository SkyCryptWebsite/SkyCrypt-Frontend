<script lang="ts">
  import * as Tooltip from "$ui/tooltip";
  import EyeOffIcon from "@lucide/svelte/icons/eye-off";
  import { formatDistanceToNowStrict } from "date-fns";

  let { updatedAt }: { updatedAt?: string | null } = $props();

  const text = $derived(
    updatedAt
      ? `Hidden from the API. Last updated ${formatDistanceToNowStrict(new Date(updatedAt), { addSuffix: true })}.`
      : "Hidden from the API. Showing the last known value."
  );
</script>

<Tooltip.Root>
  <Tooltip.Trigger>
    {#snippet child({ props })}
      <button
        {...props}
        type="button"
        aria-label={text}
        class="inline-flex rounded-sm text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
        <EyeOffIcon class="size-3.5" />
      </button>
    {/snippet}
  </Tooltip.Trigger>
  <Tooltip.Content
    class="z-50 max-w-64 rounded-xl border glass bg-transparent p-3 text-sm glass-bg-popover performance:bg-popover"
    sideOffset={6}
    side="top"
    arrowClasses="hidden">
    {text}
  </Tooltip.Content>
</Tooltip.Root>
