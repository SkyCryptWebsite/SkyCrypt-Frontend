<script lang="ts">
  import { getMiscContext } from "$ctx";
  import { SectionSubtitle } from "$lib/components/sections";
  import { AdditionStat } from "$lib/components/stats";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { titleCase } from "$lib/shared/helper";
  import { format } from "numerable";

  const misc = $derived(getMiscContext().misc);
</script>

{#if misc && misc.pet_milestones != null}
  <SectionSubtitle class="uppercase!">Pet Milestones</SectionSubtitle>
  <Items>
    {#snippet text()}
      {#if misc.pet_milestones}
        <div>
          <AdditionStat text="Sea Creatures Killed" data={format(misc.pet_milestones.sea_creatures_killed.total)} asterisk={true}>
            {#if misc.pet_milestones.sea_creatures_killed.rarity}
              <AdditionStat text="Pet" data={titleCase(misc.pet_milestones.sea_creatures_killed.rarity)} dataRarityColor={misc.pet_milestones.sea_creatures_killed.rarity} />
            {/if}
            {#if misc.pet_milestones.sea_creatures_killed.progress !== null}
              <AdditionStat text="Progress" data={misc.pet_milestones.sea_creatures_killed.progress === 100.0 ? "Maxed!" : `${misc.pet_milestones.sea_creatures_killed.progress}%`} dataMaxed={misc.pet_milestones.sea_creatures_killed.progress === 100.0} />
            {/if}
          </AdditionStat>

          {#if misc.pet_milestones.ores_mined}
            <AdditionStat text="Ores Mined" data={format(misc.pet_milestones.ores_mined.total)} asterisk={true}>
              {#if misc.pet_milestones.ores_mined.rarity}
                <AdditionStat text="Pet" data={titleCase(misc.pet_milestones.ores_mined.rarity)} dataRarityColor={misc.pet_milestones.ores_mined.rarity} />
              {/if}

              {#if misc.pet_milestones.ores_mined.progress !== null}
                <AdditionStat text="Progress" data={misc.pet_milestones.ores_mined.progress === 100.0 ? "Maxed!" : `${misc.pet_milestones.ores_mined.progress}%`} dataMaxed={misc.pet_milestones.ores_mined.progress === 100.0} />
              {/if}
            </AdditionStat>
          {/if}
        </div>
      {/if}
    {/snippet}
  </Items>
{/if}
