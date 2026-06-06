<script lang="ts">
  import { getCombinedContext, getProfileContext } from "$ctx";
  import { Item } from "$lib/components/item";
  import { Chip, ScrollItems } from "$lib/components/misc";
  import { Section, SectionSubtitle } from "$lib/components/sections";
  import { AdditionStat, Bonus } from "$lib/components/stats";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { cn } from "$lib/shared/utils";
  import { tz } from "@date-fns/tz";
  import { formatDate, formatDistanceToNowStrict } from "date-fns";
  import { format } from "numerable";

  let { order }: { order: number } = $props();

  const profile = $derived(getProfileContext().current);

  const rift = $derived(getCombinedContext().current?.rift);

  const equipment = $derived(rift?.equipment);
  const armor = $derived(rift?.armor);
</script>

<Section id="Rift" {order}>
  {#if rift}
    <Items class="flex-col">
      {#snippet text()}
        <div>
          <AdditionStat text="Visits" data={format(rift.visits)} />
          {#if rift.motes}
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
          {/if}
          {#if rift.enigma}
            <AdditionStat text="Enigma Souls" data="{rift.enigma.souls} / {rift.enigma.totalSouls}" maxed={rift.enigma.souls === rift.enigma.totalSouls} asterisk={true}>
              <div class="text-sm font-bold">
                <span class="text-text/85">Progress:</span>
                <span class="text-text">
                  {(((rift.enigma.souls ?? 0) / (rift.enigma.totalSouls ?? 0)) * 100).toFixed(2)}%
                </span>
                <span class="block font-normal"> Percentage of Enigma Souls found. </span>
              </div>
            </AdditionStat>
          {/if}
          {#if rift.castle}
            <AdditionStat text="McGrubber's Burgers" data="{rift.castle.grubberStacks} / {rift.castle.maxBurgers}" maxed={rift.castle.grubberStacks === rift.castle.maxBurgers} />
          {/if}

          <Items subtitle="Armor">
            {#if armor && armor.armor && armor.armor.length > 0}
              {#each armor.armor.filter((piece) => piece.texture_path) as piece, index (index)}
                <Item {piece} />
              {/each}
            {:else}
              <p class="space-x-0.5 leading-6">{profile?.username} has no armor equipped</p>
            {/if}
            {#snippet info()}
              {#if armor && armor.stats}
                <Bonus stats={armor.stats} />
              {/if}
            {/snippet}
          </Items>

          <Items subtitle="Equipment">
            {#if equipment && equipment.equipment && equipment.equipment.length > 0}
              {#each equipment.equipment.filter((piece) => piece.texture_path) as piece, index (index)}
                <Item {piece} />
              {/each}
            {:else}
              <p class="space-x-0.5 leading-6">{profile?.username} has no equipment equipped</p>
            {/if}
            {#snippet info()}
              {#if equipment && equipment.stats}
                <Bonus stats={equipment.stats} />
              {/if}
            {/snippet}
          </Items>
        </div>
      {/snippet}

      <div class="space-y-4">
        <SectionSubtitle class="my-0">Porthals</SectionSubtitle>
        {#if rift.porhtal}
          <AdditionStat text="Porthals Unlocked" data={rift.porhtal.porhtalsFound ?? 0} maxed={rift.porhtal.porhtalsFound === 7} />
        {/if}
      </div>

      {#if rift.porhtal}
        <ScrollItems>
          {#each rift.porhtal.porhtals as porhtal, index (index)}
            {@const hasUnlocked = porhtal.unlocked}
            <Chip image={{ src: porhtal.texture ?? "" }} class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })}>
              <div class="flex flex-col">
                <div class="font-bold whitespace-nowrap">
                  <span class="opacity-60">{porhtal.name}</span>
                </div>
              </div>
            </Chip>
          {/each}
        </ScrollItems>
      {/if}
      <div class="space-y-4">
        <SectionSubtitle class="my-0">Timecharms</SectionSubtitle>
        {#if rift.timecharms}
          <AdditionStat text="Timecharms Obtained" data={rift.timecharms.timecharmsFound ?? 0} maxed={rift.timecharms.timecharmsFound === 8} />
        {/if}
      </div>
      {#if rift.timecharms}
        <ScrollItems>
          {#each rift.timecharms.timecharms as timecharm, index (index)}
            {@const hasUnlocked = timecharm.unlocked}

            <Chip image={{ src: timecharm.texture ?? "" }} class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked }, "whitespace-nowrap")} tooltip={hasUnlocked ? tooltip : undefined}>
              <div class="flex flex-col">
                <div class="font-bold whitespace-nowrap">
                  <span class="opacity-60">{timecharm.name}</span>
                  <div class="text-sm">
                    {#if hasUnlocked && timecharm.unlockedAt != null}
                      <span class="opacity-60">
                        Obtained {formatDistanceToNowStrict(timecharm.unlockedAt, {
                          addSuffix: true,
                          in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
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
                    {#if hasUnlocked && timecharm.unlockedAt != null}
                      {formatDate(timecharm.unlockedAt, "dd MMMM yyyy 'at' HH:mm", { in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone) })}
                    {/if}
                  </span>
                </div>
              </div>
            {/snippet}
          {/each}
        </ScrollItems>
      {/if}
    </Items>
  {/if}
</Section>
