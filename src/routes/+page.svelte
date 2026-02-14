<script lang="ts">
  import { getFavorites, getPreferences } from "$ctx";
  import { env } from "$env/dynamic/public";
  import { ContributorCard } from "$lib/components/misc";
  import { ContributorCardSkeleton } from "$lib/components/misc";
  import { CtaCard } from "$lib/components/misc";
  import { Notice } from "$lib/components/notices";
  import { searchUser } from "$lib/shared/api/skycrypt-api.remote";
  import { cn } from "$lib/shared/utils";
  import { getContributors } from "$routes/ contributors.remote";
  import CodeXml from "@lucide/svelte/icons/code-xml";
  import GitPullRequestArrow from "@lucide/svelte/icons/git-pull-request-arrow";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import Server from "@lucide/svelte/icons/server";
  import Star from "@lucide/svelte/icons/star";
  import { isHttpError, type RemoteQuery } from "@sveltejs/kit";
  import { Button } from "bits-ui";
  import { onMount } from "svelte";
  import { Role } from "./enums";
  import { schema } from "./schema";

  const { PUBLIC_DISCORD_INVITE, PUBLIC_PATREON } = env;

  const preferences = getPreferences();
  const favorites = getFavorites();

  let searchQuery = $state<string>(null!);
  const searchQueryValidated = $derived(schema.safeParse({ query: searchQuery }));

  let searchUserRemoteFn = $state<RemoteQuery<never>>();

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
  <div class={cn("flex w-full flex-col justify-center gap-6 rounded-lg py-6 text-3xl", preferences.performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-60 dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
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
    <CtaCard href={selectedCta.href} text={selectedCta.text} img={selectedCta.img} />
  {/if}

  <div class="grid grid-cols-1 gap-5 @xl:grid-cols-2 @5xl:grid-cols-3">
    {#if favorites.current.length === 0}
      <ContributorCard user={{ id: "0", username: "No favorites set!", quote: "Why don't you set a favorite?" }} options={{ tip: true }} {iconMapper} />
    {:else}
      {#each favorites.current.toReversed() as favorite, index (index)}
        <ContributorCard user={{ id: favorite.uuid, username: favorite.ign, role: Role.FAVORITE, displayName: favorite.displayName }} options={{ favorite: true }} {iconMapper} />
      {/each}
    {/if}

    <svelte:boundary>
      {#snippet pending()}
        {#each new Array(3 * 4) as _, index (index)}
          <ContributorCardSkeleton />
        {/each}
      {/snippet}
      {#snippet failed(err, retry)}
        <Notice title="Failed to load contributors." type="error" error={err} {retry} class="col-span-full" />
      {/snippet}

      {#each await getContributors() as contributor (contributor.id)}
        <ContributorCard user={contributor} {iconMapper} />
      {/each}
    </svelte:boundary>
  </div>
</main>
