<script lang="ts">
  import { getProfileContext } from "$ctx";
  import AdditionStat from "$lib/components/stats/AdditionStat.svelte";
  import Section from "$lib/components/sections/Section.svelte";
  import Skillbar from "$lib/components/stats/Skillbar.svelte";
  import DungeonCataCard from "$lib/components/stats/DungeonCataCard.svelte";
  import { getDungeonsSection } from "$lib/shared/api/skycrypt-api.remote";
  import { format } from "numerable";

  let { order }: { order: number } = $props();

  const profile = $derived(getProfileContext().current);
  const profileUUID = $derived(profile?.uuid);
  const profileId = $derived(profile?.profile_id);

  const dungeons = $derived(await getDungeonsSection({ uuid: profileUUID!, profileId: profileId! }));
</script>

<Section id="Dungeons" {order}>
  {#if dungeons}
    <div class="space-y-4">
      {#if dungeons.level && dungeons.level.xp === 0}
        <p class="space-x-0.5 leading-6">{profile?.username} hasn't unlocked Dungeons yet.</p>
      {:else if dungeons}
        <div class="flex flex-col flex-wrap justify-start gap-x-4 gap-y-2 pt-4 sm:flex-row">
          {#if dungeons.level}
            <Skillbar class="" skill="Catacombs" skillData={dungeons.level} />
          {/if}
          {#if dungeons.classes && dungeons.classes.classes}
            {#each Object.entries(dungeons.classes.classes) as [className, classData], index (index)}
              <Skillbar class="sm:last:grow sm:last:basis-1/3" skill={className} skillData={classData} />
            {/each}
          {/if}
        </div>
        <div class="pt-2 pb-1">
          {#if dungeons.classes}
            {#if dungeons.classes.selectedClass}
              <AdditionStat text="Selected Class" data={dungeons.classes.selectedClass} />
            {/if}
            {#if dungeons.classes.classAverage != null}
              <AdditionStat text="Class Average" data={format(dungeons.classes.classAverage)} asterisk={true} maxed={dungeons.classes.classAverage >= 50}>
                <div class="max-w-xs space-y-2 font-bold">
                  {#if dungeons.classes.totalClassExp != null}
                    <div>
                      <h3 class="text-text/85">Total Class XP: {format(dungeons.classes.totalClassExp.toFixed(2))}</h3>
                      <p class="font-medium text-text/80 italic">Total Class XP gained in Catacombs.</p>
                    </div>
                  {/if}
                  {#if dungeons.classes.classAverageWithProgress != null}
                    <div>
                      <h3 class="text-text/85">Average Level: {format(dungeons.classes.classAverageWithProgress.toFixed(2))}</h3>
                      <p class="font-medium text-text/80 italic">Average class level, includes progress to next level.</p>
                    </div>
                  {/if}
                  <div>
                    <h3 class="text-text/85">Average Level without progress: {format(dungeons.classes.classAverage.toFixed(2))}</h3>
                    <p class="font-medium text-text/80 italic">Average class level without including partial level progress.</p>
                  </div>
                </div>
              </AdditionStat>
            {/if}
          {/if}
          {#if dungeons.stats}
            {#if dungeons.stats.highestFloorBeatenNormal != null}
              <AdditionStat text="Highest Floor Beaten (Normal)" data={format(dungeons.stats.highestFloorBeatenNormal)} maxed={dungeons.stats.highestFloorBeatenNormal === 7} />
            {/if}
            {#if dungeons.stats.highestFloorBeatenMaster != null}
              <AdditionStat text="Highest Floor Beaten (Master)" data={format(dungeons.stats.highestFloorBeatenMaster)} maxed={dungeons.stats.highestFloorBeatenMaster === 7} />
            {/if}
            <AdditionStat text="Secrets Found" data={format(dungeons.stats?.secrets?.found ?? 0)} subData="({format((dungeons.stats?.secrets?.secretsPerRun ?? 0).toFixed(2))} S/R)" />
          {/if}
        </div>
        <Section id="Catacombs">
          {#snippet subtitle()}
            <h4 class="my-5 text-xl font-semibold text-text/90 capitalize">Catacombs</h4>
          {/snippet}
          <DungeonCataCard catacombs={dungeons.catacombs} />
        </Section>

        <Section id="Master_Catacombs">
          {#snippet subtitle()}
            <h4 class="my-5 text-xl font-semibold text-text/90 capitalize">Master Catacombs</h4>
          {/snippet}
          <DungeonCataCard catacombs={dungeons.master_catacombs} master={true} />
        </Section>
      {/if}
    </div>
  {/if}
</Section>
