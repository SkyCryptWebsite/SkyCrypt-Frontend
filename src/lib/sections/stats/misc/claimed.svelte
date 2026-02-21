<script lang="ts">
  import { getMiscContext } from "$ctx";
  import { SectionSubtitle } from "$lib/components/sections";
  import { AdditionStat } from "$lib/components/stats";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { tz } from "@date-fns/tz";
  import { formatDate, formatDistanceToNowStrict } from "date-fns";

  const misc = $derived(getMiscContext().misc);
</script>

{#if misc && misc.claimed_items != null}
  <SectionSubtitle class="uppercase!">Claimed Items</SectionSubtitle>
  <Items>
    {#snippet text()}
      {#if misc.claimed_items}
        <div>
          {#each Object.entries(misc.claimed_items) as [item, time], index (index)}
            {#if time}
              <AdditionStat
                text={item.replaceAll("_", " ")}
                data={formatDistanceToNowStrict(time, {
                  addSuffix: true,
                  in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                })}
                asterisk={true}>
                {formatDate(time, "'Claimed on' dd MMMM yyyy 'at' HH:mm", { in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone) })}
              </AdditionStat>
            {/if}
          {/each}
        </div>
      {/if}
    {/snippet}
  </Items>
{/if}
