<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import { api, SectionName } from "$lib/shared/api";
  import { calculatePercentage, formatNumber } from "$lib/shared/helper";
  import type { NetworthV2 } from "$types/statsv2";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { createQuery } from "@tanstack/svelte-query";
  import { format as dateFormat, formatDistanceToNowStrict } from "date-fns";
  import { format as numberFormat } from "numerable";

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
  const profileUUID = $derived(profile.uuid);
  const profileId = $derived(profile.profile_id);

  const query = createQuery<NetworthV2>({
    queryKey: [SectionName.NETWORTH, profileUUID, profileId],
    queryFn: () => api(fetch).getSection(SectionName.NETWORTH, profileUUID, profileId)
  });

  const networth = $derived.by(() => {
    if ($query.isPending || $query.error || !$query.data) return;
    return $query.data;
  });

  const defaultPatternDecimal: string = "0,0.##";
  const defaultPattern: string = "0,0";
</script>

<div class="additional-stats flex flex-col gap-2 @md:flex-row @md:flex-wrap">
  <AdditionStat text="Joined" data={formatDistanceToNowStrict(profile.joined, { addSuffix: true })} asterisk={true}>
    Joined on {dateFormat(profile.joined, "dd MMMM yyyy 'at' HH:mm")}
  </AdditionStat>
  <AdditionStat text="Purse" data={`${formatNumber(profile.purse)} Coins`} />
  <AdditionStat text="Bank Account" data={`${formatNumber(profile.bank + profile.personalBank)} Coins`} asterisk={profile.bank && profile.personalBank ? true : false}>
    <div>
      <h3 class="text-text/85 font-bold">
        Bank:
        <span class="text-text">
          {formatNumber(profile.bank)}
        </span>
      </h3>
      {#if profile.personalBank}
        <h3 class="text-text/85 font-bold">
          Personal Bank:
          <span class="text-text">
            {formatNumber(profile.personalBank)}
          </span>
        </h3>
      {/if}
    </div>
  </AdditionStat>
  {#if profile.skills?.averageSkillLevel}
    <AdditionStat text="Average Skill Level" data={profile.skills?.averageSkillLevel.toFixed(2)} asterisk={true}>
      <div class="max-w-xs space-y-2">
        <div>
          <h3 class="text-text/85 font-bold">
            Total Skill XP:
            <span class="text-text">
              {numberFormat(profile.skills.totalSkillXp, defaultPattern)}
            </span>
          </h3>
          <p class="text-text/80 font-medium">Total XP gained in all skills except Social and Runecrafting.</p>
        </div>
        <div>
          <h3 class="text-text/85 font-bold">
            Average Level:
            <span class="text-text">
              {profile.skills.averageSkillLevelWithProgress.toFixed(2)}
            </span>
          </h3>
          <p class="text-text/80 font-medium">Average skill level over all skills except Social and Runecrafting, includes progress to next level.</p>
        </div>
        <div>
          <h3 class="text-text/85 font-bold">
            Average Level without progress:
            <span class="text-text">
              {numberFormat(profile.skills.averageSkillLevel, defaultPatternDecimal)}
            </span>
          </h3>
          <p class="text-text/80 font-medium">Average skill level without including partial level progress.</p>
        </div>
      </div>
    </AdditionStat>
  {/if}
  <AdditionStat text="Fairy Souls" data={`${profile.fairySouls.found} / ${profile.fairySouls.total}`} asterisk={true}>
    {calculatePercentage(profile.fairySouls.found, profile.fairySouls.total)}% of fairy souls found.
  </AdditionStat>

  {#if $query.isPending}
    <div class="text-text/60 my-0 flex items-center gap-1 font-bold">
      Networth:
      <LoaderCircle class="text-icon animate-spin" />
    </div>
  {/if}
  {#if $query.error}
    <div class="text-text/60 my-0 flex items-center gap-1 font-bold">Networth: An error has occurred</div>
  {/if}
  {#if $query.isSuccess && $query.data && networth}
    <AdditionStat text="Networth" data={formatNumber(networth.networth)} asterisk={true}>
      <div class="max-w-xs space-y-2 font-bold">
        <div>
          <h3 class="text-text/85">Networth</h3>
          <p class="text-text/80 font-medium italic">Networth calculations by SkyHelper.</p>
        </div>
        <div>
          <ul class="[&_li]:text-text/85 [&_li_span]:text-text font-bold [&_li]:capitalize [&_li_span]:normal-case">
            {#each Object.entries(networth.types) as [key, value], index (index)}
              <li>
                {key.replace(/_/g, " ")}:
                <span>
                  {formatNumber(value.total)}
                </span>
              </li>
            {/each}
          </ul>
        </div>
        <p class="text-text/85">
          Unsoulbound Networth:
          <span class="text-text">
            {formatNumber(networth.unsoulboundNetworth)}
          </span>
          <br />
          Total Networth:
          <span class="text-text">
            {numberFormat(networth.networth, defaultPattern)} ({formatNumber(networth.networth)})
          </span>
        </p>
      </div>
    </AdditionStat>
  {/if}
</div>
