<script lang="ts">
  import { getDynamicCtx } from "$ctx/dynamic.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { SectionName } from "$lib/shared/api";
  import type { MiscV2 } from "$types/statsv2";
  import { format } from "numerable";

  const ctx = getDynamicCtx<() => MiscV2 | undefined>(SectionName.MISC);
  const misc = $derived(ctx?.data?.());
</script>

{#if misc && misc.effects != null && Object.values(misc.effects).reduce((acc, val) => acc + val.length, 0) > 0}
  <SectionSubtitle class="uppercase!">Potions</SectionSubtitle>
  <Items>
    {#snippet text()}
      <div>
        <AdditionStat text="Disabled Potion Effects" data={format(misc.effects.disabled.length)} asterisk={true}>
          <p class="text-text/85 font-bold">Disabled Potion Effects:</p>
          {#each misc.effects.disabled as effect, index (index)}
            <p class="text-text font-semibold capitalize">{effect.replaceAll("_", " ")}</p>
          {/each}
        </AdditionStat>
      </div>
    {/snippet}
  </Items>
{/if}
