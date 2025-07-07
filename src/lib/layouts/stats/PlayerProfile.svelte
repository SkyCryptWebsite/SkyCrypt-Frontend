<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import ApiNotice from "$lib/components/APINotice.svelte";
  import { IsHover } from "$lib/hooks/is-hover.svelte";
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
  import { getContext } from "svelte";
  import { toast } from "svelte-sonner";

  let toastId: string | number = $state(0);
  let showMore = $state(false);
  let favoriteTooltipOpen = $state(false);
  let noticeOpen = $state(false);
  let ignOpen = $state(false);
  let profileOpen = $state(false);

  let noticeRef = $state<HTMLElement>(null!);
  let ignRef = $state<HTMLElement>(null!);

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
  const isHover = getContext<IsHover>("isHover");

  const apiSettings = $derived(Object.entries(profile.apiSettings).filter(([_, value]) => !value));

  const iconMapper: Record<string, string> = {
    TWITTER: "x-twitter.svg",
    YOUTUBE: "youtube.svg",
    INSTAGRAM: "instagram.svg",
    TIKTOK: "tiktok.svg",
    TWITCH: "twitch.svg",
    DISCORD: "discord.svg",
    HYPIXEL: "hypixel.png"
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
      disabled={!profile.members.length}
      class="inline-flex items-center rounded-full bg-[oklch(59.65%_0_0)]/20 py-2 pr-4 pl-2 align-middle text-xl font-semibold whitespace-nowrap sm:text-3xl"
      bind:ref={ignRef}
      onpointerenter={() => {
        if (!profile.members.length) return;
        if (!isHover.current) return;
        profileOpen = false;
        ignOpen = true;
      }}>
      <div class="relative flex items-center justify-center overflow-hidden rounded-full bg-[var(--color)] px-2 py-1 text-xl" style={`--color:${profile.rank?.rankColor}`}>
        <div class="relative z-20 inline-flex justify-between gap-3 text-sm font-bold sm:text-lg">
          <span>{profile.rank?.rankText}</span>
          {#if profile.rank?.plusText}
            <span>{profile.rank.plusText}</span>
          {/if}
        </div>
        <div class="absolute top-0 -right-3 bottom-0 z-10 h-14 w-1/2 skew-x-[-20deg] bg-[var(--plusColor)]" style={`--plusColor:${profile.rank?.plusColor ?? profile.rank?.rankColor}`}></div>
      </div>
      <span class="pl-4">{profile.displayName}</span>
    </Popover.Trigger>

    <Popover.Content forceMount class={cn("z-50 min-w-64 overflow-hidden rounded-lg text-3xl font-semibold", $performanceMode ? "bg-background" : "backdrop-blur-lg backdrop-brightness-50")} sideOffset={8} side="bottom" align="start" collisionPadding={6} customAnchor={ignRef} strategy="absolute">
      {#snippet child({ wrapperProps, props, open })}
        {#if open}
          <div {...wrapperProps}>
            <div {...props} transition:flyAndScale>
              {#each profile.members as member (member.uuid)}
                {#if member.username !== profile.username}
                  <a href={`/stats/${member.username}/${profile.profile_cute_name}`} class="group flex min-w-(--bits-dropdown-menu-anchor-width) items-center p-2 focus-visible:outline-0" data-sveltekit-preload-code="viewport">
                    <span class="outline-icon group-hover:bg-text/20 flex w-full items-center justify-between gap-2 rounded-lg bg-[oklch(59.65%_0_0)]/20 p-2 transition-colors duration-300 group-focus-visible:outline-1">
                      {member.username}
                      {#if member.removed}
                        <Ban class="size-6" />
                      {/if}
                    </span>
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
  <div class="relative inline-flex items-center gap-2 rounded-full bg-[oklch(59.65%_0_0)]/20 px-2 py-1 align-middle text-xl font-semibold data-[warning=true]:border-2 data-[warning=true]:border-yellow-500/20 sm:text-3xl" data-warning={!!apiSettings.length} bind:this={noticeRef}>
    <Popover.Root bind:open={profileOpen}>
      <Popover.Trigger
        disabled={!profile.profiles.length}
        onpointerenter={() => {
          if (!profile.profiles.length) return;
          if (!isHover.current) return;
          ignOpen = false;
          profileOpen = true;
        }}
        class="rounded-full px-2 py-1">
        {profile.profile_cute_name}
        {@render profileIcon(profile.game_mode)}
      </Popover.Trigger>
      <Popover.Content forceMount class={cn("z-50 min-w-64 overflow-hidden rounded-lg text-3xl font-semibold", $performanceMode ? "bg-background" : "backdrop-blur-lg backdrop-brightness-50")} sideOffset={8} side="bottom" align="start" collisionPadding={6} customAnchor={noticeRef} strategy="absolute">
        {#snippet child({ wrapperProps, props, open })}
          {#if open}
            <div {...wrapperProps}>
              <div {...props} transition:flyAndScale>
                {#each profile.profiles ?? [] as otherProfile (otherProfile.profile_id)}
                  {#if otherProfile.profile_id !== profile.profile_id}
                    <a href={`/stats/${profile.username}/${otherProfile.cute_name}`} class="group flex items-center p-2 focus-visible:outline-0" data-sveltekit-preload-code="viewport">
                      <div class="group-hover:bg-text/20 outline-icon w-full rounded-lg bg-[oklch(59.65%_0_0)]/20 p-2 transition-colors duration-300 group-focus-visible:outline-1">
                        {otherProfile.cute_name}
                        {@render profileIcon(otherProfile.game_mode)}
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
          <Popover.Content forceMount class="bg-background-grey z-50 max-w-sm rounded-lg" sideOffset={0} side="bottom" align="center" customAnchor={noticeRef} collisionPadding={6}>
            {#snippet child({ wrapperProps, props, open })}
              {#if open}
                <div {...wrapperProps}>
                  <div {...props} transition:flyAndScale>
                    <ApiNotice />
                    <Popover.Arrow class="!text-icon [&>svg[data-arrow]]:text-icon" />
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
      class="bg-icon/90 hover:bg-icon aspect-square rounded-full p-2 transition-opacity duration-150"
      onclick={() => {
        if (!$favorites.some((fav) => fav.uuid === profile.uuid)) {
          favorites.set([...$favorites, { uuid: profile.uuid, ign: profile.username }]);
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
          {#if $favorites.some((fav) => fav.uuid === profile.uuid)}
            <Star class="size-4 fill-white" />
          {:else}
            <Star class="size-4" />
          {/if}
        </button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content forceMount class="bg-background-grey text-text/80 z-50 rounded-lg p-4 font-semibold" sideOffset={6} side="top" align="center">
        {#snippet child({ wrapperProps, props, open })}
          {#if open}
            <div {...wrapperProps}>
              <div {...props} transition:flyAndScale>
                <Tooltip.Arrow />
                {#if $favorites.some((fav) => fav.uuid === profile.uuid)}
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
    class="bg-icon/90 hover:bg-icon aspect-square rounded-full p-2 transition-opacity duration-150"
    onclick={() => {
      copyToClipboard(window.location.href);
    }}>
    <Link class="size-4" />
  </Button.Root>

  <Button.Root href={`https://plancke.io/hypixel/player/stats/${profile.username}`} target="_blank" class="bg-icon/90 hover:bg-icon flex items-center justify-center gap-1.5 rounded-full px-2 py-1 font-semibold transition-opacity duration-150">
    Plancke <ExternalLink class="size-4" />
  </Button.Root>

  <Button.Root href={`https://elitebot.dev/@${profile.username}/${profile.profile_cute_name}`} target="_blank" class="bg-icon/90 hover:bg-icon flex items-center justify-center gap-1.5 rounded-full px-2 py-1 font-semibold transition-opacity duration-150">
    Elite <ExternalLink class="size-4" />
  </Button.Root>

  <Button.Root
    class="bg-icon/90 hover:bg-icon hidden items-center justify-center gap-1.5 rounded-full px-2 py-1 font-semibold transition-opacity duration-150 data-[visible=true]:flex"
    data-visible={showMore}
    onclick={() => {
      copyToClipboard(profile.uuid);
    }}>
    Copy UUID
  </Button.Root>

  {#each Object.entries(profile.social) as [key, value], index (index)}
    {#if key === "DISCORD"}
      <Button.Root class="bg-icon/90 hover:bg-icon hidden items-center justify-center gap-1.5 rounded-full px-2 py-1 font-semibold transition-opacity duration-150 data-[visible=true]:flex" data-visible={showMore} onclick={() => copyToClipboard(value)}>
        <Avatar.Root>
          <Avatar.Image loading="lazy" src="/img/icons/{iconMapper[key]}" alt="{profile.username}'s {key.toLocaleLowerCase()}" class="size-4 text-white" />
          <Avatar.Fallback>
            {profile.username.slice(0, 2)}
          </Avatar.Fallback>
        </Avatar.Root>
        {value}
      </Button.Root>
    {:else}
      <Button.Root href={value} target="_blank" class="bg-icon/90 hover:bg-icon hidden aspect-square items-center justify-center gap-1.5 rounded-full px-2 py-1 font-semibold transition-opacity duration-150 data-[visible=true]:flex" data-visible={showMore}>
        <Avatar.Root>
          <Avatar.Image loading="lazy" src="/img/icons/{iconMapper[key]}" alt="{profile.username}'s {key.toLocaleLowerCase()}" class="size-4 text-white" />
          <Avatar.Fallback>
            {profile.username.slice(0, 2)}
          </Avatar.Fallback>
        </Avatar.Root>
      </Button.Root>
    {/if}
  {/each}

  <Button.Root class="bg-icon/90 hover:bg-icon rounded-full p-2 transition-opacity duration-150" onclick={() => (showMore = !showMore)}>
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
