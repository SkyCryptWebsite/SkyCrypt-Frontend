<script lang="ts">
  import { getDynamicCtx } from "$ctx/dynamic.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { SectionName } from "$lib/shared/api";
  import { formatTime } from "$lib/shared/helper";
  import type { MiscV2 } from "$types/statsv2";
  import { format } from "numerable";
  const ctx = getDynamicCtx<() => MiscV2 | undefined>(SectionName.MISC);
  const misc = $derived(ctx?.data?.());

  const dragons = $derived(misc?.dragons);
</script>

{#if misc && dragons}
  <SectionSubtitle class="uppercase!">Dragons</SectionSubtitle>
  <Items>
    {#snippet text()}
      <div>
        {#if dragons.most_damage?.best}
          <AdditionStat text="Most Damage" data={format(dragons.most_damage.best.toFixed(0))} asterisk={true}>
            {#each Object.entries(dragons.most_damage) as [text, data], index (index)}
              {#if text !== "best"}
                <AdditionStat {text} data={format(data.toFixed(0))} />
              {/if}
            {/each}
          </AdditionStat>
        {/if}
        {#if dragons.fastest_kill?.best}
          <AdditionStat text="Fastest Kill" data={formatTime(dragons.fastest_kill.best)} asterisk={true}>
            {#each Object.entries(dragons.fastest_kill) as [text, data], index (index)}
              {#if text !== "best"}
                <AdditionStat {text} data={formatTime(data)} />
              {/if}
            {/each}
          </AdditionStat>
        {/if}
        {#if dragons.last_hits != null}
          <AdditionStat text="Last Hits" data={format(dragons.last_hits.total)} asterisk={true}>
            {#each Object.entries(dragons.last_hits) as [text, data], index (index)}
              {#if text !== "total"}
                <AdditionStat {text} data={format(data)} />
              {/if}
            {/each}
          </AdditionStat>
        {/if}
        {#if dragons.deaths != null}
          <AdditionStat text="Deaths" data={format(dragons.deaths.total)} asterisk={true}>
            {#each Object.entries(dragons.deaths) as [text, data], index (index)}
              {#if text !== "total"}
                <AdditionStat {text} data={format(data)} />
              {/if}
            {/each}
          </AdditionStat>
        {/if}
      </div>
    {/snippet}
  </Items>
{/if}
