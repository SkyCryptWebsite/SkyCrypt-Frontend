<script lang="ts">
  import { getProfileContext } from "$ctx";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import Bonus from "$lib/components/Bonus.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import Section from "$lib/components/Section.svelte";
  import { getSlayerSection } from "$lib/shared/api/skycrypt-api.remote";
  import { calculatePercentage } from "$lib/shared/helper";
  import Image from "@lucide/svelte/icons/image";
  import { Avatar, Progress } from "bits-ui";
  import { format } from "numerable";

  let { order }: { order: number } = $props();

  const profile = $derived(getProfileContext());

  const profileUUID = $derived(profile.uuid);
  const profileId = $derived(profile.profile_id);

  const slayer = $derived(await getSlayerSection({ uuid: profileUUID!, profileId: profileId! }));
</script>

<Section id="Slayer" {order}>
  {#if slayer}
    <div class="space-y-4">
      {#if slayer.totalSlayerExp === 0}
        <p class="space-x-0.5 leading-6">{profile.username} hasn't unlocked Slayers yet.</p>
      {:else}
        <div class="pt-4 pb-1.5">
          <AdditionStat text="Total Slayer XP" data={format(slayer.totalSlayerExp)} />
        </div>
        {#if slayer.data}
          <ScrollItems>
            {#each Object.entries(slayer.data) as [key, value], index (index)}
              {#if value.level && value.level.xp != null && value.level.xp > 0}
                <div class="relative flex min-w-[min(20.625rem,100vw)] flex-col items-center gap-1 space-y-5 overflow-hidden rounded-lg bg-background/30">
                  <div class="flex w-full items-center justify-center gap-1.5 border-b-2 border-icon py-2 text-center font-semibold uppercase">
                    <Avatar.Root>
                      <Avatar.Image loading="lazy" src={value.texture} class="size-8 object-contain [image-rendering:pixelated]" />
                      <Avatar.Fallback>
                        <Image class="size-8" />
                      </Avatar.Fallback>
                    </Avatar.Root>
                    {value.name}
                  </div>
                  {#if value.kills}
                    <div class="flex h-full w-full flex-wrap gap-5 px-5 uppercase">
                      {#each Object.entries(value.kills) as [key, killValue], index (index)}
                        <div class="flex flex-col items-center gap-1 text-sm font-bold text-text/60">
                          <span>
                            {#if !isNaN(Number(key))}
                              Tier {["I", "II", "III", "IV", "V"][Number(key) - 1]}
                            {:else}
                              {key}
                            {/if}
                          </span>
                          <span class="text-text">
                            {format(killValue)}
                          </span>
                        </div>
                      {/each}
                    </div>
                  {/if}
                  <div class="w-full">
                    <p class="mb-2 w-full space-y-5 px-5 text-center font-semibold text-text/60 capitalize">
                      {key} Level {value.level.level}
                    </p>

                    <Progress.Root value={value.level.xp} max={value.level.xpForNext} class="group h-4 w-full overflow-hidden bg-text/30" data-maxed={value.level.maxed}>
                      <div class="absolute z-10 flex h-full w-full justify-center">
                        <div class="text-xs font-semibold shadow-background/50 txt-shadow">
                          {#if value.level.maxed}
                            {format(value.level.xp)}
                          {:else}
                            {format(value.level.xp)} / {format(value.level.xpForNext)}
                          {/if}
                          XP
                        </div>
                      </div>
                      <div class="h-full w-full flex-1 transition-all duration-300 ease-out group-data-[maxed=false]:[background:var(--skillbar)] group-data-[maxed=true]:[background:var(--maxedbar)]" style={`transform: translateX(-${100 - parseFloat(calculatePercentage(value.level.xp ?? 0, value.level.maxed ? (value.level.xp ?? 0) : (value.level.xpForNext ?? 0)))}%)`}></div>
                    </Progress.Root>
                  </div>
                </div>
              {/if}
            {/each}
          </ScrollItems>
        {/if}
        {#if slayer.stats}
          <Bonus title="Bonus:" stats={slayer.stats} />
        {/if}
      {/if}
    </div>
  {/if}
</Section>
