<script lang="ts">
  import { resolve } from "$app/paths";
  import { getHoverContext, getPreferences, getProfileContext } from "$ctx";
  import { APINotice } from "$lib/components/notices";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import Ban from "@lucide/svelte/icons/ban";
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  import { Avatar, Popover } from "bits-ui";

  let noticeOpen = $state(false);
  let ignOpen = $state(false);
  let profileOpen = $state(false);

  let noticeRef = $state<HTMLElement>(null!);
  let ignRef = $state<HTMLElement>(null!);

  const profile = $derived(getProfileContext().current);
  const isHover = getHoverContext();
  const preferences = getPreferences();

  const apiSettings = $derived(Object.entries(profile?.apiSettings ?? {}).filter(([_, value]) => !value));
</script>

<div class="flex flex-wrap items-center gap-x-2 gap-y-3 text-4xl">
  Stats for
  <Popover.Root bind:open={ignOpen}>
    <Popover.Trigger
      disabled={!profile?.members?.length}
      class="inline-flex items-center rounded-full bg-text/10 py-2 pr-4 pl-2 align-middle text-xl font-semibold whitespace-nowrap sm:text-3xl"
      bind:ref={ignRef}
      onpointerenter={() => {
        if (profile == null) return;
        if (profile.members?.length) return;
        if (!isHover.current) return;
        profileOpen = false;
        ignOpen = true;
      }}>
      {#if profile != null && profile.rank?.rankColor}
        <div class="relative flex items-center justify-center overflow-hidden rounded-full bg-(--color) px-2 py-1 text-xl" style={`--color:${profile.rank.rankColor}`}>
          <div class="relative z-20 inline-flex justify-between gap-3 text-sm font-bold text-white sm:text-lg">
            <span>{profile.rank.rankText}</span>
            {#if profile.rank.plusText}
              <span>{profile.rank.plusText}</span>
            {/if}
          </div>
          <div class="absolute top-0 -right-3 bottom-0 z-10 h-14 w-1/2 skew-x-[-20deg] bg-(--plusColor)" style={`--plusColor:${profile.rank.plusColor ?? profile.rank.rankColor}`}></div>
        </div>
      {/if}
      <span class={cn(profile?.rank?.rankColor ? "pl-4" : "pl-2")}>{profile?.displayName}</span>
    </Popover.Trigger>

    <Popover.Content forceMount class={cn("z-50 min-w-64 overflow-hidden rounded-lg text-3xl font-semibold", preferences.performanceMode ? "bg-background" : "backdrop-blur-lg backdrop-brightness-50")} sideOffset={8} side="bottom" align="start" collisionPadding={6} customAnchor={ignRef} strategy="absolute">
      {#snippet child({ wrapperProps, props, open })}
        {#if open}
          <div {...wrapperProps}>
            <div {...props} transition:flyAndScale>
              {#each profile?.members as member (member.uuid)}
                {#if member.username !== profile?.username}
                  <a
                    href={resolve("/stats/[ign]/[[profile]]", {
                      ign: member.username ?? "",
                      profile: member?.profile_id
                    })}
                    class="group flex min-w-(--bits-dropdown-menu-anchor-width) items-center p-2 focus-visible:outline-0"
                    data-sveltekit-preload-data="hover"
                    data-removed={member.removed}>
                    <div class="flex w-full items-center justify-between gap-2 rounded-lg bg-text/10 p-2 outline-icon transition-colors duration-300 ease-out group-hover:bg-text/20 group-focus-visible:outline-1 group-data-[removed=true]:bg-text/5 group-hover:group-data-[removed=true]:bg-text/20">
                      <div class="flex items-center gap-2 pr-4">
                        <Avatar.Root class="size-8 shrink-0">
                          <Avatar.Image loading="lazy" src="https://nmsr.nickac.dev/face/{member.uuid}" alt={member.username} class="aspect-square size-8 rounded-sm [image-rendering:pixelated] group-data-[removed=true]:grayscale-100" />
                          <Avatar.Fallback class="flex h-full items-center justify-center rounded-sm bg-text/10 text-lg font-semibold text-text/60 uppercase">
                            <img loading="lazy" src="https://nmsr.nickac.dev/face/bc8ea1f51f253ff5142ca11ae45193a4ad8c3ab5e9c6eec8ba7a4fcb7bac40" alt="Steve" class="aspect-square size-8 rounded-sm [image-rendering:pixelated] group-data-[removed=true]:grayscale-100" />
                          </Avatar.Fallback>
                        </Avatar.Root>
                        <span class="light:invert">
                          {member.username}
                        </span>
                      </div>
                      {#if member.removed}
                        <Ban class="size-8 text-text light:invert" />
                      {/if}
                    </div>
                  </a>
                {/if}
              {/each}
            </div>
          </div>
        {/if}
      {/snippet}
    </Popover.Content>
  </Popover.Root>
  on
  <div class="relative inline-flex items-center gap-2 rounded-full bg-text/10 px-2 py-1 align-middle text-xl font-semibold data-[warning=true]:border-2 data-[warning=true]:border-yellow-500/20 sm:text-3xl" data-warning={apiSettings.length > 0} bind:this={noticeRef}>
    <Popover.Root bind:open={profileOpen}>
      <Popover.Trigger
        disabled={!profile?.profiles?.length}
        onpointerenter={() => {
          if (profile == null) return;
          if (profile.profiles?.length) return;
          if (!isHover.current) return;
          ignOpen = false;
          profileOpen = true;
        }}
        class="rounded-full px-2 py-1">
        {profile?.profile_cute_name}
        {@render profileIcon(profile?.game_mode ?? "")}
      </Popover.Trigger>
      <Popover.Content forceMount class={cn("z-50 min-w-64 overflow-hidden rounded-lg text-3xl font-semibold", preferences.performanceMode ? "bg-background" : "backdrop-blur-lg backdrop-brightness-50")} sideOffset={8} side="bottom" align="start" collisionPadding={6} customAnchor={noticeRef} strategy="absolute">
        {#snippet child({ wrapperProps, props, open })}
          {#if open}
            <div {...wrapperProps}>
              <div {...props} transition:flyAndScale>
                {#each profile?.profiles ?? [] as otherProfile (otherProfile.profile_id)}
                  {#if otherProfile.profile_id !== profile?.profile_id}
                    <a
                      href={resolve("/stats/[ign]/[[profile]]", {
                        ign: profile?.username ?? "",
                        profile: otherProfile.cute_name
                      })}
                      class="group flex items-center p-2 focus-visible:outline-0"
                      data-sveltekit-preload-data="hover">
                      <div class="w-full rounded-lg bg-text/10 p-2 outline-icon transition-colors duration-300 ease-out group-hover:bg-text/20 group-focus-visible:outline-1">
                        <span class="light:invert">
                          {otherProfile.cute_name}
                        </span>
                        {@render profileIcon(otherProfile.game_mode ?? "")}
                      </div>
                    </a>
                  {/if}
                {/each}
              </div>
            </div>
          {/if}
        {/snippet}
      </Popover.Content>
    </Popover.Root>

    {#if apiSettings.length}
      <Popover.Root bind:open={noticeOpen}>
        <Popover.Trigger class="rounded-full bg-yellow-500/20 px-4 py-2" onpointerenter={() => (noticeOpen = true)}>
          <TriangleAlert class="size-6 text-yellow-500" />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content forceMount class="z-50 max-w-sm rounded-lg bg-background-grey" sideOffset={0} side="bottom" align="center" customAnchor={noticeRef} collisionPadding={6}>
            {#snippet child({ wrapperProps, props, open })}
              {#if open}
                <div {...wrapperProps}>
                  <div {...props} transition:flyAndScale>
                    <APINotice />
                    <Popover.Arrow class="text-icon! [&>svg[data-arrow]]:text-icon" />
                  </div>
                </div>
              {/if}
            {/snippet}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    {/if}
  </div>
</div>

{#snippet profileIcon(gameMode: string)}
  {#if gameMode === "bingo"}
    🎲
  {/if}
  {#if gameMode === "ironman"}
    ♻️
  {/if}
  {#if gameMode === "island"}
    🌴
  {/if}
{/snippet}
