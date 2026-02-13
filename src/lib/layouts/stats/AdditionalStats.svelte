<script lang="ts">
  import { getHoverContext, getPreferences, getProfileContext } from "$ctx";
  import AdditionStat from "$lib/components/stats/AdditionStat.svelte";
  import NetworthCard from "$lib/components/stats/NetworthCard.svelte";
  import { getNetworth } from "$lib/shared/api/skycrypt-api.remote";
  import { calculatePercentage, formatNumber } from "$lib/shared/helper";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { tz } from "@date-fns/tz";
  import CircleX from "@lucide/svelte/icons/circle-x";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { isHttpError } from "@sveltejs/kit";
  import { Button, Popover } from "bits-ui";
  import { format as dateFormat, formatDistanceToNowStrict } from "date-fns";
  import { format as numberFormat } from "numerable";

  const profile = $derived(getProfileContext().current);
  const profileUUID = $derived(profile?.uuid);
  const profileId = $derived(profile?.profile_id);

  const defaultPatternDecimal: string = "0,0.##";
  const defaultPattern: string = "0,0";

  const isHover = getHoverContext();
  const preferences = getPreferences();

  let networthOpen = $state<boolean>(false);
</script>

<div class="additional-stats flex flex-col gap-2 @md:flex-row @md:flex-wrap">
  {#if profile != null}
    {#if profile.joined != null}
      <AdditionStat text="Joined" data={formatDistanceToNowStrict(profile.joined, { addSuffix: true, in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone) })} asterisk={true}>
        Joined on {dateFormat(profile.joined, "dd MMMM yyyy 'at' HH:mm", { in: tz(Intl.DateTimeFormat().resolvedOptions().timeZone) })}
      </AdditionStat>
    {/if}
    {#if profile.purse != null}
      <AdditionStat text="Purse" data={`${formatNumber(profile.purse)} Coins`} />
    {/if}
    {#if profile.bank != null && profile.personalBank != null}
      <AdditionStat text="Bank Account" data={`${formatNumber(profile.bank + profile.personalBank)} Coins`} asterisk={profile.bank && profile.personalBank ? true : false}>
        <div>
          <h3 class="font-bold text-text/85">
            Bank:
            <span class="text-text">
              {formatNumber(profile.bank)}
            </span>
          </h3>
          {#if profile.personalBank}
            <h3 class="font-bold text-text/85">
              Personal Bank:
              <span class="text-text">
                {formatNumber(profile.personalBank)}
              </span>
            </h3>
          {/if}
        </div>
      </AdditionStat>
    {/if}
    {#if profile.skills?.averageSkillLevel}
      <AdditionStat text="Average Skill Level" data={profile.skills.averageSkillLevel.toFixed(2)} asterisk={true}>
        <div class="max-w-xs space-y-2">
          <div>
            <h3 class="font-bold text-text/85">
              Total Skill XP:
              <span class="text-text">
                {numberFormat(profile.skills.totalSkillXp, defaultPattern)}
              </span>
            </h3>
            <p class="font-medium text-text/80">Total XP gained in all skills except Social and Runecrafting.</p>
          </div>
          {#if profile.skills.averageSkillLevelWithProgress != null}
            <div>
              <h3 class="font-bold text-text/85">
                Average Level:
                <span class="text-text">
                  {profile.skills.averageSkillLevelWithProgress.toFixed(2)}
                </span>
              </h3>
              <p class="font-medium text-text/80">Average skill level over all skills except Social and Runecrafting, includes progress to next level.</p>
            </div>
          {/if}
          <div>
            <h3 class="font-bold text-text/85">
              Average Level without progress:
              <span class="text-text">
                {numberFormat(profile.skills.averageSkillLevel, defaultPatternDecimal)}
              </span>
            </h3>
            <p class="font-medium text-text/80">Average skill level without including partial level progress.</p>
          </div>
        </div>
      </AdditionStat>
    {/if}
    {#if profile.fairySouls}
      <AdditionStat text="Fairy Souls" data={`${profile.fairySouls.found} / ${profile.fairySouls.total}`} maxed={(profile.fairySouls.found ?? 0) >= (profile.fairySouls.total ?? 0)} asterisk={true}>
        {calculatePercentage(profile.fairySouls.found ?? 0, profile.fairySouls.total ?? 0)}% of fairy souls found.
      </AdditionStat>
    {/if}
  {/if}
  <svelte:boundary>
    {#snippet pending()}
      <div class="my-0 flex items-center gap-1 font-bold text-text/60">
        Networth:
        <LoaderCircle class="animate-spin text-icon" />
      </div>
    {/snippet}

    {#snippet failed(err, retry)}
      <div class="my-0 flex items-center gap-1 font-bold text-text/60">
        <Popover.Root bind:open={networthOpen}>
          <Popover.Trigger
            class="flex items-center gap-1"
            onpointerenter={() => {
              if (!isHover.current) return;
              networthOpen = true;
            }}>
            <CircleX class="size-4 h-lh text-minecraft-c" /> Networth:
          </Popover.Trigger>
          {#if isHttpError(err)}
            <Popover.Content forceMount class={cn("z-50 overflow-hidden rounded-lg p-4 font-semibold", preferences.performanceMode ? "bg-background" : "backdrop-blur-lg backdrop-brightness-50")} sideOffset={8} side="bottom" align="start" collisionPadding={6} strategy="absolute">
              {#snippet child({ wrapperProps, props, open })}
                {#if open}
                  <div {...wrapperProps}>
                    <div {...props} transition:flyAndScale>
                      {err.body.message}
                    </div>
                  </div>
                {/if}
              {/snippet}
            </Popover.Content>
          {/if}
        </Popover.Root>
        <Button.Root onclick={retry} class="text-icon hover:text-icon/80">Retry</Button.Root>
      </div>
    {/snippet}
    {#if profileUUID != null && profileId != null}
      {@const networthData = await getNetworth({ uuid: profileUUID, profileId: profileId })}

      {#if networthData.normal}
        <NetworthCard networth={networthData.normal} title="Networth" />
      {/if}
      {#if networthData.nonCosmetic}
        <NetworthCard networth={networthData.nonCosmetic} title="Non-Cosmetic Networth" />
      {/if}
    {/if}
  </svelte:boundary>
</div>
