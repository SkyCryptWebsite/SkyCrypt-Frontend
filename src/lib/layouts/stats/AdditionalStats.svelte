<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import { calculatePercentage, formatNumber } from "$lib/shared/helper";
  import { format as dateFormat, formatDistanceToNowStrict } from "date-fns";
  import { format as numberFormat } from "numerable";

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);

  const defaultPatternDecimal: string = "0,0.##";
  const defaultPattern: string = "0,0";
</script>

<div class="additional-stats flex flex-col gap-2 @md:flex-row @md:flex-wrap">
  <AdditionStat text="Joined" data={formatDistanceToNowStrict(profile.stats.joined, { addSuffix: true })} asterisk={true}>
    Joined on {dateFormat(profile.stats.joined, "dd MMMM yyyy 'at' HH:mm")}
  </AdditionStat>
  <AdditionStat text="Purse" data={`${formatNumber(profile.stats.purse)} Coins`} />
  <AdditionStat text="Bank Account" data={`${formatNumber(profile.stats.bank + profile.stats.personalBank)} Coins`} asterisk={profile.stats.bank && profile.stats.personalBank ? true : false}>
    <div>
      <h3 class="text-text/85 font-bold">
        Bank:
        <span class="text-text">
          {formatNumber(profile.stats.bank)}
        </span>
      </h3>
      {#if profile.stats.personalBank}
        <h3 class="text-text/85 font-bold">
          Personal Bank:
          <span class="text-text">
            {formatNumber(profile.stats.personalBank)}
          </span>
        </h3>
      {/if}
    </div>
  </AdditionStat>
  <AdditionStat text="Average Skill Level" data={profile.skills.averageSkillLevel.toFixed(2)} asterisk={true}>
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
  <AdditionStat text="Fairy Souls" data={`${profile.stats.fairySouls.found} / ${profile.stats.fairySouls.total}`} asterisk={true}>
    {calculatePercentage(profile.stats.fairySouls.found, profile.stats.fairySouls.total)}% of fairy souls found.
  </AdditionStat>
  <AdditionStat text="Networth" data={formatNumber(profile.stats.networth.networth)} asterisk={true}>
    <div class="max-w-xs space-y-2 font-bold">
      <div>
        <h3 class="text-text/85">Networth</h3>
        <p class="text-text/80 font-medium italic">Networth calculations by SkyHelper.</p>
      </div>
      <div>
        <ul class="[&_li]:text-text/85 [&_li_span]:text-text font-bold [&_li]:capitalize [&_li_span]:normal-case">
          {#each Object.entries(profile.stats.networth.types) as [key, value], index (index)}
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
          {formatNumber(profile.stats.networth.unsoulboundNetworth)}
        </span>
        <br />
        Total Networth:
        <span class="text-text">
          {numberFormat(profile.stats.networth.networth, defaultPattern)} ({formatNumber(profile.stats.networth.networth)})
        </span>
      </p>
    </div>
  </AdditionStat>

  <AdditionStat text="Non-Cosmetic Networth" data={formatNumber(profile.stats.nonCosmeticNetworth.networth)} asterisk={true}>
    <div class="max-w-xs space-y-2 font-bold">
      <div>
        <h3 class="text-text/85">Non-Cosmetic Networth</h3>
        <p class="text-text/80 font-medium italic">Networth calculations by SkyHelper.</p>
      </div>
      <div>
        <ul class="[&_li]:text-text/85 [&_li_span]:text-text font-bold [&_li]:capitalize [&_li_span]:normal-case">
          {#each Object.entries(profile.stats.nonCosmeticNetworth.types) as [key, value], index (index)}
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
          {formatNumber(profile.stats.nonCosmeticNetworth.unsoulboundNetworth)}
        </span>
        <br />
        Total Networth:
        <span class="text-text">
          {numberFormat(profile.stats.nonCosmeticNetworth.networth, defaultPattern)} ({formatNumber(profile.stats.nonCosmeticNetworth.networth)})
        </span>
      </p>
    </div>
  </AdditionStat>
</div>
