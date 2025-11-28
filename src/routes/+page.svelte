<script lang="ts">
  import { getHoverContext } from "$ctx";
  import { env } from "$env/dynamic/public";
  import Notice from "$lib/components/Notice.svelte";
  import { searchUser } from "$lib/shared/api/skycrypt-api.remote";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { favorites } from "$lib/stores/favorites";
  import { content } from "$lib/stores/internal";
  import { performanceMode } from "$lib/stores/preferences";
  import { type Contributor, getContributors } from "$routes/ contributors.remote";
  import CodeXml from "@lucide/svelte/icons/code-xml";
  import GitPullRequestArrow from "@lucide/svelte/icons/git-pull-request-arrow";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import Server from "@lucide/svelte/icons/server";
  import Star from "@lucide/svelte/icons/star";
  import { isHttpError, type RemoteQuery } from "@sveltejs/kit";
  import { Avatar, Button, Tooltip } from "bits-ui";
  import { onMount } from "svelte";
  import { Role } from "./enums";
  import { schema } from "./schema";

  const { PUBLIC_DISCORD_INVITE, PUBLIC_PATREON } = env;

  let searchQuery = $state<string>(null!);
  const searchQueryValidated = $derived(schema.safeParse({ query: searchQuery }));

  let searchUserRemoteFn = $state<RemoteQuery<never>>();

  const isHover = getHoverContext();

  const iconMapper: Record<Role, typeof CodeXml | typeof Server | typeof GitPullRequestArrow | typeof Star | string> = {
    [Role.MAINTAINER]: CodeXml,
    [Role.FACILITATOR]: Server,
    [Role.CONTRIBUTOR]: GitPullRequestArrow,
    [Role.FAVORITE]: Star,
    [Role.TECHNOBLADE]: "/img/icons/technoblade.svg"
  };

  type Cta = {
    href: string;
    text: { title: string; description: string };
    img: { src: string; alt: string };
  };

  const ctas: Cta[] = [
    {
      href: PUBLIC_PATREON,
      text: {
        title: "Patreon",
        description: "Help keep SkyCrypt ad free by donating"
      },
      img: {
        src: "/img/icons/patreon.svg",
        alt: "Patreon logo"
      }
    },
    {
      href: PUBLIC_DISCORD_INVITE,
      text: {
        title: "Discord",
        description: "Announcements, Community, Bug Reports, Feature Requests, Support"
      },
      img: {
        src: "/img/icons/discord.svg",
        alt: "Discord logo"
      }
    },
    {
      href: "https://forms.gle/2Jfbs9tjm76Rihfe8",
      text: {
        title: "Skyblock Texture Pack Survey",
        description: "Updating SkyCrypt to prioritize most used texture packs"
      },
      img: {
        src: "/img/icons/google-forms.svg",
        alt: "Google Forms"
      }
    }
  ];

  let selectedCta = $state<Cta>();

  onMount(() => {
    selectedCta = ctas[Math.floor(Math.random() * ctas.length)];
  });
</script>

<main class="@container mx-auto mt-12 flex max-w-272 flex-col justify-center gap-6 pt-5 pr-[max(1.25rem+env(safe-area-inset-right))] pb-[max(1.25rem+env(safe-area-inset-bottom))] pl-[max(1.25rem+env(safe-area-inset-left))]">
  <div class={cn("flex w-full flex-col justify-center gap-6 rounded-lg py-6 text-3xl", $performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-60 dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
    <div class="flex flex-col justify-center gap-2">
      <div class="flex flex-col gap-6">
        <label for="search" class="m-1 w-full text-center font-semibold">Show SkyBlock stats for</label>
        <!-- svelte-ignore a11y_autofocus -->
        <input id="search" type="search" required autofocus placeholder="Enter username" class="relative h-16 grow bg-text/10 text-center font-normal text-text placeholder:text-text/80 focus-visible:outline-hidden" bind:value={searchQuery} onchange={() => (searchUserRemoteFn = searchUser({ username: searchQuery }))} />
      </div>

      {#if !searchQueryValidated.success && searchQuery != null && searchQuery.length > 0}
        <div class="text-center text-sm font-semibold text-text/80">
          {searchQueryValidated.error.issues[0].message}
        </div>
      {/if}
      {#if searchUserRemoteFn?.error}
        <div class="text-center text-sm font-semibold text-text/80">{isHttpError(searchUserRemoteFn.error) ? searchUserRemoteFn.error.body.message : "Something went wrong"}</div>
      {/if}
    </div>
    <Button.Root class="mx-auto flex w-full max-w-fit items-center justify-center rounded-3xl bg-icon px-6 py-3 text-base font-bold text-white uppercase transition-all duration-150 ease-out text-shadow-[0_0_3px_oklch(0%_0_0/50%)] hover:scale-[1.015] disabled:opacity-50 dark:text-text" disabled={searchQuery != null && searchQuery.length > 0 && !searchQueryValidated.success}>
      {#if searchUserRemoteFn?.loading}
        <LoaderCircle class="size-6 animate-spin" />
      {:else}
        Show me
      {/if}
    </Button.Root>
  </div>

  {#if selectedCta}
    {@render ctalink(selectedCta.href, selectedCta.text, selectedCta.img)}
  {/if}

  <div class="grid grid-cols-1 gap-5 @xl:grid-cols-2 @5xl:grid-cols-3">
    {#if $favorites.length === 0}
      {@render profile({ id: "0", username: "No favorites set!", quote: "Why don't you set a favorite?" }, { tip: true })}
    {:else}
      {#each $favorites.reverse() as favorite, index (index)}
        {@render profile({ id: favorite.uuid, username: favorite.ign, role: Role.FAVORITE, displayName: favorite.displayName }, { favorite: true })}
      {/each}
    {/if}

    <svelte:boundary>
      {#snippet pending()}
        {#each new Array(3 * 4) as _, index (index)}
          {@render profileSkeleton()}
        {/each}
      {/snippet}
      {#snippet failed(err, retry)}
        <Notice title="Failed to load contributors." type="error" error={err} {retry} class="col-span-full" />
      {/snippet}

      {#each await getContributors() as contributor (contributor.id)}
        {@render profile(contributor)}
      {/each}
    </svelte:boundary>
  </div>
</main>

{#snippet profile(user: Contributor, options?: { tip?: boolean; favorite?: boolean })}
  {#snippet tooltipContent()}
    <p class="font-semibold text-text/80 capitalize">
      {#if options?.favorite}
        Favorited
      {:else if user.role}
        SkyCrypt {Role[user.role].toLowerCase()}
      {:else}
        Unknown
      {/if}
    </p>
  {/snippet}

  <div class={cn("relative rounded-lg", { "transition-all duration-300 ease-out hover:scale-105": !options?.tip })}>
    <Button.Root href={options?.tip ? "#" : `/stats/${user.id}`} class={cn("relative flex h-full min-w-0 items-center gap-4 rounded-lg p-5", $performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-60 dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
      <Avatar.Root class="size-16 shrink-0 rounded-lg bg-text/10">
        <Avatar.Image loading="lazy" src={options?.tip ? "https://mc-heads.net/avatar/bc8ea1f51f253ff5142ca11ae45193a4ad8c3ab5e9c6eec8ba7a4fcb7bac40/64" : `https://crafatar.com/avatars/${user.id}?size=64&overlay`} alt={user.username} class="aspect-square size-16 rounded-lg [image-rendering:pixelated]" />
        <Avatar.Fallback class="flex h-full items-center justify-center text-lg font-semibold text-text/60 uppercase">
          {user.username?.slice(0, 2)}
        </Avatar.Fallback>
      </Avatar.Root>
      <div class="flex flex-col justify-center gap-0">
        <div class="text-lg font-semibold text-text">
          {user.displayName ?? user.username}
        </div>
        {#if user.quote}
          <div class={cn("pr-4 text-sm font-medium text-pretty text-text/80", user.role === Role.TECHNOBLADE ? "italic" : "")}>{@html user.quote}</div>
        {/if}
      </div>
    </Button.Root>
    {#if user.role}
      {@const Icon = iconMapper[user.role]}
      <Tooltip.Root>
        <Tooltip.Trigger
          class="absolute right-3 bottom-3"
          onclick={() => {
            if (!options?.favorite) {
              content.set(tooltipContent);
            } else {
              favorites.set($favorites.filter((favorite) => favorite.uuid !== user.id));
            }
          }}>
          {#snippet child({ props })}
            <div {...props} tabindex="0" role="button">
              {#if typeof Icon === "string"}
                <img src={Icon} alt="Technoblade Icon" class="size-5" />
              {:else}
                <Icon class={cn("size-5", options?.favorite ? "fill-[oklch(75.25%_0.0023_17.21)] stroke-[oklch(75.25%_0.0023_17.21)]" : "text-text/60")} />
              {/if}
            </div>
          {/snippet}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          {#if isHover.current}
            <Tooltip.Content forceMount class="rounded-lg bg-background-grey p-4" sideOffset={6} side="top" align="center">
              {#snippet child({ wrapperProps, props, open })}
                {#if open}
                  <div {...wrapperProps}>
                    <div {...props} transition:flyAndScale>
                      <Tooltip.Arrow />
                      {@render tooltipContent()}
                    </div>
                  </div>
                {/if}
              {/snippet}
            </Tooltip.Content>
          {/if}
        </Tooltip.Portal>
      </Tooltip.Root>
    {/if}
  </div>
{/snippet}

{#snippet profileSkeleton()}
  <div class={cn("relative flex min-w-0 items-center gap-2 rounded-lg p-5", $performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-60 dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
    <div class="size-16 animate-pulse rounded-lg bg-text/10"></div>
    <div class="flex flex-col gap-1">
      <div class="h-6 w-24 animate-pulse rounded-lg bg-text/10"></div>
      <div class="h-3 w-44 animate-pulse rounded-lg bg-text/10"></div>
    </div>
    <div class="absolute right-3 bottom-3 size-5 animate-pulse rounded-lg bg-text/10"></div>
  </div>
{/snippet}

{#snippet ctalink(href: string, text: { title: string; description: string }, img: { src: string; alt: string })}
  <Button.Root {href} target="_blank" rel="noreferrer" class={cn("flex w-full items-center gap-4 rounded-lg p-4 transition-all duration-300 ease-out hover:scale-[1.05]", $performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-60 dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
    <Avatar.Root class="size-12 shrink-0 rounded-lg select-none">
      <Avatar.Image loading="lazy" src={img.src} alt={img.alt} class="pointer-events-none size-12 rounded-lg" />
      <Avatar.Fallback class="flex h-full items-center justify-center text-lg font-semibold text-text/60 uppercase">{img.alt.slice(0, 2)}</Avatar.Fallback>
    </Avatar.Root>
    <div>
      <div class="font-semibold">
        <span class="text-text/70">SkyCrypt's</span>
        <span class="text-link">{text.title}</span>
      </div>
      <div class="font-medium text-text/90 opacity-85">{text.description}</div>
    </div>
  </Button.Root>
{/snippet}
