<script lang="ts">
  import { AllStatsContext, setAllStatsContext, setHoverContext } from "$ctx";
  import { initInternalState } from "$ctx/internal.svelte";
  import { Tooltip } from "bits-ui";
  import type { Component, Snippet } from "svelte";
  import type { StatData } from "#lib/shared/api/orval-generated";
  import { MockIsHover } from "./test-wrapper.svelte";

  interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: Component<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentProps?: Record<string, any>;
    hoverEnabled?: boolean;
    withTooltipProvider?: boolean;
    allStats?: StatData[];
    children?: Snippet;
  }

  let {
    component: TestComponent,
    componentProps = {},
    hoverEnabled = true,
    withTooltipProvider = false,
    allStats = [],
    children
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  const mockHover = new MockIsHover(hoverEnabled);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setHoverContext(mockHover as any);
  setAllStatsContext(new AllStatsContext(() => allStats));
  initInternalState();
</script>

{#if withTooltipProvider}
  <Tooltip.Provider>
    <TestComponent {...componentProps}>
      {#if children}
        {@render children()}
      {/if}
    </TestComponent>
  </Tooltip.Provider>
{:else}
  <TestComponent {...componentProps}>
    {#if children}
      {@render children()}
    {/if}
  </TestComponent>
{/if}
