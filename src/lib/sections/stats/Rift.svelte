<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import Bonus from "$lib/components/Bonus.svelte";
  import Chip from "$lib/components/Chip.svelte";
  import Error from "$lib/components/Error.svelte";
  import Item from "$lib/components/Item.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import Section from "$lib/components/Section.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { api, SectionName } from "$lib/shared/api";
  import { cn } from "$lib/shared/utils";
  import type { RiftV2 } from "$types/statsv2";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { createQuery } from "@tanstack/svelte-query";
  import { formatDate, formatDistanceToNowStrict } from "date-fns";
  import { format } from "numerable";

  let { order }: { order: number } = $props();

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);

  const profileUUID = $derived(profile.uuid);
  const profileId = $derived(profile.profile_id);

  const query = createQuery<RiftV2>({
    queryKey: [SectionName.RIFT, profileUUID, profileId],
    queryFn: () => api(fetch).getSection(SectionName.RIFT, profileUUID, profileId)
  });

  const rift = $derived.by(() => {
    if ($query.isPending || $query.error || !$query.data) return;
    return $query.data;
  });

  const equipment = $derived(rift?.equipment);
  const armor = $derived(rift?.armor);
</script>

<Section id="Rift" {order}>
  {#if $query.isPending}
    <LoaderCircle class="text-icon animate-spin" />
  {/if}
  {#if $query.error}
    <Error />
  {/if}
  {#if $query.isSuccess && $query.data && rift}
    <Items class="flex-col">
      {#snippet text()}
        <div>
          <AdditionStat text="Visits" data={format(rift.visits)} />
          <AdditionStat text="Motes" data={format(rift.motes.purse)} asterisk={true}>
            <div class="flex flex-col gap-4">
              <div class="text-sm font-bold">
                <span class="text-text/85">Lifetime Motes:</span>
                <span class="text-text">
                  {format(rift.motes.lifetime)}
                </span>
                <span class="block font-normal">Total Motes earned in Rift.</span>
              </div>
              <div class="text-sm font-bold">
                <span class="text-text/85">Motes Orbs:</span>
                <span class="text-text">
                  {rift.motes.orbs}
                </span>
                <span class="block font-normal">Amount of Mote Orbs player has picked up inside of the Rift.</span>
              </div>
            </div>
          </AdditionStat>
          <AdditionStat text="Enigma Souls" data="{rift.enigma.souls} / {rift.enigma.totalSouls}" maxed={rift.enigma.souls === rift.enigma.totalSouls} asterisk={true}>
            <div class="text-sm font-bold">
              <span class="text-text/85">Progress:</span>
              <span class="text-text">
                {((rift.enigma.souls / rift.enigma.totalSouls) * 100).toFixed(2)}%
              </span>
              <span class="block font-normal"> Percentage of Enigma Souls found. </span>
            </div>
          </AdditionStat>
          <AdditionStat text="McGrubber's Burgers" data="{rift.castle.grubberStacks} / {rift.castle.maxBurgers}" maxed={rift.castle.grubberStacks === rift.castle.maxBurgers} />

          <Items subtitle="Armor">
            {#if armor && armor.armor.length > 0}
              {#each armor.armor.filter((piece) => piece.texture_path) as piece, index (index)}
                <Item {piece} />
              {/each}
            {:else}
              <p class="space-x-0.5 leading-6">{profile.username} has no armor equipped</p>
            {/if}
            {#snippet info()}
              {#if armor}
                <Bonus stats={armor.stats} />
              {/if}
            {/snippet}
          </Items>

          <Items subtitle="Equipment">
            {#if equipment && equipment.equipment.length > 0}
              {#each equipment.equipment.filter((piece) => piece.texture_path) as piece, index (index)}
                <Item {piece} />
              {/each}
            {:else}
              <p class="space-x-0.5 leading-6">{profile.username} has no equipment equipped</p>
            {/if}
            {#snippet info()}
              {#if equipment}
                <Bonus stats={equipment.stats} />
              {/if}
            {/snippet}
          </Items>
        </div>
      {/snippet}

      <div class="space-y-4">
        <SectionSubtitle class="my-0">Porthals</SectionSubtitle>
        <AdditionStat text="Porthals Unlocked" data={rift.porhtal.porhtalsFound} maxed={rift.porhtal.porhtalsFound === 7} />
      </div>

      <ScrollItems>
        {#each rift.porhtal.porhtals as porhtal, index (index)}
          {@const hasUnlocked = porhtal.unlocked}
          <Chip image={{ src: porhtal.texture }} class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })}>
            <div class={cn("flex flex-col")}>
              <div class="font-bold whitespace-nowrap">
                <span class="opacity-60">{porhtal.name}</span>
              </div>
            </div>
          </Chip>
        {/each}
      </ScrollItems>
      <div class="space-y-4">
        <SectionSubtitle class="my-0">Timecharms</SectionSubtitle>
        <AdditionStat text="Timecharms Obtained" data={rift.timecharms.timecharmsFound} maxed={rift.timecharms.timecharmsFound === 8} />
      </div>
      <ScrollItems>
        {#each rift.timecharms.timecharms as timecharm, index (index)}
          {@const hasUnlocked = timecharm.unlocked}

          <Chip image={{ src: timecharm.texture }} class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked }, "whitespace-nowrap")} tooltip={hasUnlocked ? tooltip : undefined}>
            <div class={cn("flex flex-col")}>
              <div class="font-bold whitespace-nowrap">
                <span class="opacity-60">{timecharm.name}</span>
                <div class="text-sm">
                  {#if hasUnlocked}
                    <span class="opacity-60">
                      Obtained {formatDistanceToNowStrict(timecharm.unlockedAt, {
                        addSuffix: true
                      })}
                    </span>
                  {:else}
                    <span class="opacity-60">Not Obtained</span>
                  {/if}
                </div>
              </div>
            </div>
          </Chip>

          {#snippet tooltip()}
            <div class="text-sm font-bold">
              <div>
                <span class="opacity-85">Obtained:</span>
                <span class="text-text">
                  {#if hasUnlocked}
                    {formatDate(timecharm.unlockedAt, "dd MMMM yyyy 'at' HH:mm")}
                  {/if}
                </span>
              </div>
            </div>
          {/snippet}
        {/each}
      </ScrollItems>
    </Items>
  {/if}
</Section>
