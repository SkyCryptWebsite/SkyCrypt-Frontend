<script lang="ts">
  import { AdditionStat } from "$lib/components/stats";
  import { ScrollItems } from "$lib/components/misc";
  import { SectionSubtitle } from "$lib/components/sections";
  import { type ModelsFormattedDungeonFloor } from "$lib/shared/api/orval-generated";
  import { formatNumber } from "$lib/shared/helper";
  import { tz } from "@date-fns/tz";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import Image from "@lucide/svelte/icons/image";
  import { Avatar, Collapsible } from "bits-ui";
  import { formatDate, formatDistanceToNowStrict, formatDuration as formatDurationDateFns, intervalToDuration } from "date-fns";

  let { catacombs, master = false }: { catacombs: ModelsFormattedDungeonFloor[] | undefined; master?: boolean } = $props();

  function formatDuration(end: number) {
    const interval = intervalToDuration({ start: 0, end }, { in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone) });

    // Always extract and format both minutes and seconds
    const minutes = interval.minutes ?? 0;
    const seconds = interval.seconds ?? 0;

    const duration = formatDurationDateFns(
      { minutes, seconds },
      {
        format: ["minutes", "seconds"],
        delimiter: ":",
        zero: true,
        locale: {
          formatDistance: (_token, count) => String(count).padStart(2, "0")
        }
      }
    );

    if (duration === "") return "-";
    return duration;
  }
</script>

{#if catacombs}
  <ScrollItems>
    {#each catacombs as catacomb, index (index)}
      {#if catacomb.stats}
        {#if catacomb.stats.tier_completions != null && catacomb.stats.tier_completions > 0}
          <div class="flex min-w-80 basis-[calc((100%/3)-1.25rem)] flex-col gap-1 rounded-lg bg-background/30">
            <div class="flex w-full items-center justify-center gap-1.5 border-b-2 border-icon py-2 text-center font-semibold uppercase">
              <Avatar.Root>
                <Avatar.Image loading="lazy" src={catacomb.texture} class="size-8 object-contain [image-rendering:pixelated]" />
                <Avatar.Fallback>
                  <Image class="size-8" />
                </Avatar.Fallback>
              </Avatar.Root>
              {catacomb.name}
            </div>

            <Collapsible.Root class="p-5">
              <Collapsible.Trigger class="group flex items-center gap-0.5">
                <ChevronDown class="size-5 transition-all duration-300 ease-out group-data-[state=open]:-rotate-180" />
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
              <Collapsible.Root class="px-5 pb-10">
                <Collapsible.Trigger class="group flex items-center gap-0.5">
                  <ChevronDown class="size-5 transition-all duration-300 ease-out group-data-[state=open]:-rotate-180" />
                  <SectionSubtitle class="my-0">Best run</SectionSubtitle>
                </Collapsible.Trigger>
                <Collapsible.Content>
                  {#each Object.entries(catacomb.best_run) as [key, value], index (index)}
                    {#if typeof value === "number"}
                      {#if key === "timestamp"}
                        <AdditionStat class="capitalize" text={key.toLowerCase().replaceAll("_", " ")} data={formatDistanceToNowStrict(value, { addSuffix: true, in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone) })} asterisk={true}>
                          {formatDate(value, "dd MMMM yyyy 'at' HH:mm", { in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone) })}
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
      {/if}
    {/each}
  </ScrollItems>
{:else}
  This player has not played any {master ? "Master Catacombs" : "Catacombs"}.
{/if}
