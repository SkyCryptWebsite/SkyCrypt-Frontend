<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import Error from "$lib/components/Error.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import Section from "$lib/components/Section.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Skillbar from "$lib/components/Skillbar.svelte";
  import { api, SectionName } from "$lib/shared/api";
  import { formatNumber } from "$lib/shared/helper";
  import type { CatacombsData } from "$types/stats";
  import type { DungeonsV2 } from "$types/statsv2";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import Image from "@lucide/svelte/icons/image";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { createQuery } from "@tanstack/svelte-query";
  import { Avatar, Collapsible } from "bits-ui";
  import { formatDate, formatDistanceToNowStrict, formatDuration as formatDurationDateFns, intervalToDuration } from "date-fns";
  import { format } from "numerable";

  let { order }: { order: number } = $props();

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
  const profileUUID = $derived(profile.uuid);
  const profileId = $derived(profile.profile_id);

  const query = createQuery<DungeonsV2>({
    queryKey: [SectionName.DUNGEONS, profileUUID, profileId],
    queryFn: () => api(fetch).getSection(SectionName.DUNGEONS, profileUUID, profileId)
  });

  const dungeons = $derived.by(() => {
    if ($query.isPending || $query.error || !$query.data) return;
    return $query.data;
  });

  function formatDuration(end: number) {
    const duration = formatDurationDateFns(intervalToDuration({ start: 0, end }), {
      format: ["minutes", "seconds"],
      delimiter: ":",
      zero: true,
      locale: {
        formatDistance: (_token, count) => String(count).padStart(2, "0")
      }
    });
    if (duration === "") return "-";
    return duration;
  }
</script>

<Section id="Dungeons" {order}>
  {#if $query.isPending}
    <LoaderCircle class="text-icon animate-spin" />
  {/if}
  {#if $query.error}
    <Error />
  {/if}
  {#if $query.isSuccess && $query.data && dungeons}
    <div class="space-y-4">
      {#if dungeons.unlocked === false}
        <p class="space-x-0.5 leading-6">{profile.username} hasn't unlocked Dungeons yet.</p>
      {:else if dungeons}
        <div class="flex flex-col flex-wrap justify-start gap-x-4 gap-y-2 pt-4 sm:flex-row">
          <Skillbar class="" skill="Catacombs" skillData={dungeons.level} />
          {#each Object.entries(dungeons.classes.classes) as [className, classData], index (index)}
            <Skillbar class="sm:last:grow sm:last:basis-1/3" skill={className} skillData={classData} />
          {/each}
        </div>
        <div class="pt-2 pb-1">
          <AdditionStat text="Selected Class" data={dungeons.classes.selectedClass} />
          <AdditionStat text="Class Average" data={format(dungeons.classes.classAverage)} asterisk={true} maxed={dungeons.classes.classAverage >= 50}>
            <div class="max-w-xs space-y-2 font-bold">
              <div>
                <h3 class="text-text/85">Total Class XP: {format(dungeons.classes.totalClassExp.toFixed(2))}</h3>
                <p class="text-text/80 font-medium italic">Total Class XP gained in Catacombs.</p>
              </div>
              <div>
                <h3 class="text-text/85">Average Level: {format(dungeons.classes.classAverageWithProgress.toFixed(2))}</h3>
                <p class="text-text/80 font-medium italic">Average class level, includes progress to next level.</p>
              </div>
              <div>
                <h3 class="text-text/85">Average Level without progress: {format(dungeons.classes.classAverage.toFixed(2))}</h3>
                <p class="text-text/80 font-medium italic">Average class level without including partial level progress.</p>
              </div>
            </div>
          </AdditionStat>
          <AdditionStat text="Highest Floor Beaten (Normal)" data={format(dungeons.stats.highestFloorBeatenNormal)} maxed={dungeons.stats.highestFloorBeatenNormal === 7} />
          <AdditionStat text="Highest Floor Beaten (Master)" data={format(dungeons.stats.highestFloorBeatenMaster)} maxed={dungeons.stats.highestFloorBeatenMaster === 7} />
          <AdditionStat text="Secrets Found" data={format(dungeons.stats?.secrets?.found ?? 0)} subData="({format((dungeons.stats?.secrets?.secretsPerRun ?? 0).toFixed(2))} S/R)" />
        </div>
        <Section id="Catacombs">
          {#snippet subtitle()}
            <h4 class="text-text/90 my-5 text-xl font-semibold capitalize">Catacombs</h4>
          {/snippet}
          {@render cataCard(dungeons.catacombs)}
        </Section>

        <Section id="Master_Catacombs">
          {#snippet subtitle()}
            <h4 class="text-text/90 my-5 text-xl font-semibold capitalize">Master Catacombs</h4>
          {/snippet}
          {@render cataCard(dungeons.master_catacombs, true)}
        </Section>
      {/if}
    </div>
  {/if}
</Section>

{#snippet cataCard(catacombs: CatacombsData[] | null, master: boolean = false)}
  {#if catacombs}
    <ScrollItems>
      {#each catacombs as catacomb, index (index)}
        {#if catacomb.stats.tier_completions > 0}
          <div class="bg-background/30 flex min-w-80 basis-[calc((100%/3)-1.25rem)] flex-col gap-1 rounded-lg">
            <div class="border-icon flex w-full items-center justify-center gap-1.5 border-b-2 py-2 text-center font-semibold uppercase">
              <Avatar.Root>
                <Avatar.Image loading="lazy" src={catacomb.texture} class="size-8 object-contain" />
                <Avatar.Fallback>
                  <Image class="size-8" />
                </Avatar.Fallback>
              </Avatar.Root>
              {catacomb.name}
            </div>

            <Collapsible.Root class="p-5">
              <Collapsible.Trigger class="group flex items-center gap-0.5">
                <ChevronDown class="size-5 transition-all duration-300 group-data-[state=open]:-rotate-180" />
                <SectionSubtitle class="my-0">Floor Stats</SectionSubtitle>
              </Collapsible.Trigger>
              <Collapsible.Content>
                {#each Object.entries(catacomb.stats) as [key, value], index (index)}
                  {#if typeof value === "object"}
                    <AdditionStat class="capitalize" text={key.toLowerCase().replaceAll("_", " ")} data={formatNumber(value.damage)} subData="({value.type})" />
                  {:else if key.includes("time") && key !== "times_played"}
                    <AdditionStat class="capitalize" text={key.toLowerCase().replaceAll("_", " ")} data={formatDuration(value)} />
                  {:else}
                    <AdditionStat class="capitalize" text={key.toLowerCase().replaceAll("_", " ")} data={formatNumber(value)} />
                  {/if}
                {/each}
              </Collapsible.Content>
            </Collapsible.Root>

            {#if catacomb.best_run}
              <Collapsible.Root class="px-5 pb-[2.5rem]">
                <Collapsible.Trigger class="group flex items-center gap-0.5">
                  <ChevronDown class="size-5 transition-all duration-300 group-data-[state=open]:-rotate-180" />
                  <SectionSubtitle class="my-0">Best run</SectionSubtitle>
                </Collapsible.Trigger>
                <Collapsible.Content>
                  {#each Object.entries(catacomb.best_run) as [key, value], index (index)}
                    {#if typeof value === "number"}
                      {#if key === "timestamp"}
                        <AdditionStat class="capitalize" text={key.toLowerCase().replaceAll("_", " ")} data={formatDistanceToNowStrict(value, { addSuffix: true })} asterisk={true}>
                          {formatDate(value, "dd MMMM yyyy 'at' HH:mm")}
                        </AdditionStat>
                      {:else if key.includes("time")}
                        <AdditionStat class="capitalize" text={key.toLowerCase().replaceAll("_", " ")} data={formatDuration(value)} />
                      {:else}
                        <AdditionStat class="capitalize" text={key.toLowerCase().replaceAll("_", " ")} data={formatNumber(value)} />
                      {/if}
                    {:else}
                      <AdditionStat class="capitalize" text={key.toLowerCase().replaceAll("_", " ")} data={value} />
                    {/if}
                  {/each}
                </Collapsible.Content>
              </Collapsible.Root>
            {:else}
              <div class="p-5 text-center">This player has not completed this floor.</div>
            {/if}
          </div>
        {/if}
      {/each}
    </ScrollItems>
  {:else}
    This player has not played any {master ? "Master Catacombs" : "Catacombs"}.
  {/if}
{/snippet}
