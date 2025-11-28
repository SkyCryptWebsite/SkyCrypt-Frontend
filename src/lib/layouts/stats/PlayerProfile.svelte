<script lang="ts">
  import { resolve } from "$app/paths";
  import { getHoverContext, getProfileContext } from "$ctx";
  import ApiNotice from "$lib/components/APINotice.svelte";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { favorites } from "$lib/stores/favorites";
  import { performanceMode } from "$lib/stores/preferences";
  import Ban from "@lucide/svelte/icons/ban";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import Link from "@lucide/svelte/icons/link";
  import Star from "@lucide/svelte/icons/star";
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  import { Avatar, Button, Popover, Tooltip } from "bits-ui";
  import { toast } from "svelte-sonner";

  let toastId: string | number = $state(0);
  let showMore = $state(false);
  let favoriteTooltipOpen = $state(false);
  let noticeOpen = $state(false);
  let ignOpen = $state(false);
  let profileOpen = $state(false);

  let noticeRef = $state<HTMLElement>(null!);
  let ignRef = $state<HTMLElement>(null!);

  const profile = $derived(getProfileContext().current);
  const isHover = getHoverContext();

  const apiSettings = $derived(Object.entries(profile?.apiSettings ?? {}).filter(([_, value]) => !value));

  const iconMapper: Record<string, string> = {
    TWITTER: "x-twitter.svg",
    YOUTUBE: "youtube.svg",
    INSTAGRAM: "instagram.svg",
    TIKTOK: "tiktok.svg",
    TWITCH: "twitch.svg",
    DISCORD: "discord.svg",
    HYPIXEL: "hypixel.avif"
  };

  function copyToClipboard(value: string) {
    navigator.clipboard.writeText(value);
    toast.dismiss(toastId);
    toastId = toast.success(`Copied ${value} to your clipboard!`);
  }
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

    <Popover.Content forceMount class={cn("z-50 min-w-64 overflow-hidden rounded-lg text-3xl font-semibold", $performanceMode ? "bg-background" : "backdrop-blur-lg backdrop-brightness-50")} sideOffset={8} side="bottom" align="start" collisionPadding={6} customAnchor={ignRef} strategy="absolute">
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
                    data-sveltekit-preload-code="viewport"
                    data-removed={member.removed}>
                    <div class="flex w-full items-center justify-between gap-2 rounded-lg bg-text/10 p-2 outline-icon transition-colors duration-300 ease-out group-hover:bg-text/20 group-focus-visible:outline-1 group-data-[removed=true]:bg-text/5 group-hover:group-data-[removed=true]:bg-text/20">
                      <div class="flex items-center gap-2 pr-4">
                        <Avatar.Root class="size-8 shrink-0 rounded-sm bg-text/10">
                          <Avatar.Image loading="lazy" src="https://crafatar.com/avatars/{member.uuid}?size=64&overlay" alt={member.username} class="aspect-square size-8 rounded-sm [image-rendering:pixelated] group-data-[removed=true]:grayscale-100" />
                          <Avatar.Fallback class="flex h-full items-center justify-center text-lg font-semibold text-text/60 uppercase">
                            <img loading="lazy" src="https://mc-heads.net/avatar/bc8ea1f51f253ff5142ca11ae45193a4ad8c3ab5e9c6eec8ba7a4fcb7bac40/64" alt="Steve" class="aspect-square size-8 rounded-sm [image-rendering:pixelated] group-data-[removed=true]:grayscale-100" />
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
      <Popover.Content forceMount class={cn("z-50 min-w-64 overflow-hidden rounded-lg text-3xl font-semibold", $performanceMode ? "bg-background" : "backdrop-blur-lg backdrop-brightness-50")} sideOffset={8} side="bottom" align="start" collisionPadding={6} customAnchor={noticeRef} strategy="absolute">
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
                      data-sveltekit-preload-code="viewport">
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
                    <ApiNotice />
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

<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
  <Tooltip.Root bind:open={favoriteTooltipOpen} disableCloseOnTriggerClick={false}>
    <Tooltip.Trigger
      class="aspect-square rounded-full bg-icon/90 p-2 transition-opacity duration-150 ease-out hover:bg-icon"
      onclick={() => {
        if (profile == null) return;
        if (!$favorites.some((fav) => fav.uuid === profile.uuid)) {
          favorites.set([...$favorites, { uuid: profile.uuid ?? "", ign: profile.username ?? "" }]);
          toast.dismiss(toastId);
          toastId = toast.success(`Added ${profile.username} to your favorites!`);
        } else {
          favorites.set($favorites.filter((fav) => fav.uuid !== profile.uuid));
          toast.dismiss(toastId);
          toastId = toast.success(`Removed ${profile.username} from your favorites!`);
        }
      }}
      onpointerdown={() => (favoriteTooltipOpen = !favoriteTooltipOpen)}>
      {#snippet child({ props })}
        <button {...props}>
          {#if $favorites.some((fav) => fav.uuid === profile?.uuid)}
            <Star class="size-4 fill-white" />
          {:else}
            <Star class="size-4" />
          {/if}
        </button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content forceMount class="z-50 rounded-lg bg-background-grey p-4 font-semibold text-text/80" sideOffset={6} side="top" align="center">
        {#snippet child({ wrapperProps, props, open })}
          {#if open}
            <div {...wrapperProps}>
              <div {...props} transition:flyAndScale>
                <Tooltip.Arrow />
                {#if $favorites.some((fav) => fav.uuid === profile?.uuid)}
                  <p>Remove from favorites</p>
                {:else}
                  <p>Add to favorites</p>
                {/if}
              </div>
            </div>
          {/if}
        {/snippet}
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>

  <Button.Root
    class="aspect-square rounded-full bg-icon/90 p-2 transition-opacity duration-150 ease-out hover:bg-icon"
    onclick={() => {
      copyToClipboard(window.location.href);
    }}>
    <Link class="size-4" />
  </Button.Root>

  <Button.Root href={`https://plancke.io/hypixel/player/stats/${profile?.username}`} target="_blank" class="flex items-center justify-center gap-1.5 rounded-full bg-icon/90 px-2 py-1 font-semibold transition-opacity duration-150 ease-out hover:bg-icon">
    Plancke <ExternalLink class="size-4" />
  </Button.Root>

  <Button.Root href={`https://elitebot.dev/@${profile?.username}/${profile?.profile_cute_name}`} target="_blank" class="flex items-center justify-center gap-1.5 rounded-full bg-icon/90 px-2 py-1 font-semibold transition-opacity duration-150 ease-out hover:bg-icon">
    Elite <ExternalLink class="size-4" />
  </Button.Root>

  <Button.Root
    class="hidden items-center justify-center gap-1.5 rounded-full bg-icon/90 px-2 py-1 font-semibold transition-opacity duration-150 ease-out hover:bg-icon data-[visible=true]:flex"
    data-visible={showMore}
    onclick={() => {
      copyToClipboard(profile?.uuid ?? "");
    }}>
    Copy UUID
  </Button.Root>

  <Button.Root
    class="hidden items-center justify-center gap-1.5 rounded-full bg-icon/90 px-2 py-1 font-semibold transition-opacity duration-150 ease-out hover:bg-icon data-[visible=true]:flex"
    data-visible={showMore}
    onclick={() => {
      copyToClipboard(profile?.profile_id ?? "");
    }}>
    Copy Profile UUID
  </Button.Root>

  {#if profile?.social}
    {#each Object.entries(profile.social) as [key, value], index (index)}
      {#if key === "DISCORD"}
        <Button.Root class="hidden items-center justify-center gap-1.5 rounded-full bg-icon/90 px-2 py-1 font-semibold transition-opacity duration-150 ease-out hover:bg-icon data-[visible=true]:flex" data-visible={showMore} onclick={() => copyToClipboard(value)}>
          <Avatar.Root>
            <Avatar.Image loading="lazy" src="/img/icons/{iconMapper[key]}" alt="{profile.username}'s {key.toLocaleLowerCase()}" class="size-4 text-white" />
            <Avatar.Fallback>
              {profile.username?.slice(0, 2)}
            </Avatar.Fallback>
          </Avatar.Root>
          {value}
        </Button.Root>
      {:else}
        <Button.Root href={value} target="_blank" class="hidden aspect-square items-center justify-center gap-1.5 rounded-full bg-icon/90 px-2 py-1 font-semibold transition-opacity duration-150 ease-out hover:bg-icon data-[visible=true]:flex" data-visible={showMore}>
          <Avatar.Root>
            <Avatar.Image loading="lazy" src="/img/icons/{iconMapper[key]}" alt="{profile.username}'s {key.toLocaleLowerCase()}" class="size-4 text-white" />
            <Avatar.Fallback>
              {profile.username?.slice(0, 2)}
            </Avatar.Fallback>
          </Avatar.Root>
        </Button.Root>
      {/if}
    {/each}
  {/if}

  <Button.Root class="rounded-full bg-icon/90 p-2 transition-opacity duration-150 ease-out hover:bg-icon" onclick={() => (showMore = !showMore)}>
    {#if showMore}
      <ChevronLeft class="size-4" />
    {:else}
      <ChevronRight class="size-4" />
    {/if}
  </Button.Root>
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
