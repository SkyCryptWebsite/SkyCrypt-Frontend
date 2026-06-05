<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { getFavorites, getPreferences } from "$ctx";
  import { env } from "$env/dynamic/public";
  import { ContributorCard, ContributorCardSkeleton, CtaCard } from "$lib/components/misc";
  import PostCard from "$lib/components/newsroom/PostCard.svelte";
  import { Notice } from "$lib/components/notices";
  import { listPosts } from "$lib/shared/api/cms-api.remote";
  import { searchUser } from "$lib/shared/api/skycrypt-api.remote";
  import { cn } from "$lib/shared/utils";
  import { getContributors } from "$routes/contributors.remote";
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import CodeXml from "@lucide/svelte/icons/code-xml";
  import GitPullRequestArrow from "@lucide/svelte/icons/git-pull-request-arrow";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import Server from "@lucide/svelte/icons/server";
  import Star from "@lucide/svelte/icons/star";
  import { isHttpError } from "@sveltejs/kit";
  import { Button } from "bits-ui";
  import { onMount } from "svelte";
  import { Role } from "./enums";
  import { schema } from "./schema";

  const { PUBLIC_DISCORD_INVITE, PUBLIC_PATREON } = env;

  const preferences = getPreferences();
  const favorites = getFavorites();

  let searchQuery = $state<string>(null!);
  const searchQueryValidated = $derived(schema.safeParse({ query: searchQuery }));

  let submittedSearchLoading = $state(false);
  let submittedSearchError = $state<string>();

  function getErrorMessage(err: unknown) {
    const httpError = err as { body?: unknown };

    if (isHttpError(err) && typeof httpError.body === "object" && httpError.body !== null && "message" in httpError.body && typeof httpError.body.message === "string") {
      return httpError.body.message;
    }

    return "Something went wrong";
  }

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
    }
  ];

  let selectedCta = $state<Cta>();

  async function submitSearch() {
    if (!searchQueryValidated.success) return;

    const username = searchQuery.trim();
    if (!username) return;

    submittedSearchLoading = true;
    submittedSearchError = undefined;

    try {
      const response = await searchUser({ username });
      await goto(resolve("/stats/[ign]", { ign: response.username ?? "" }));
    } catch (err) {
      submittedSearchError = getErrorMessage(err);
    } finally {
      submittedSearchLoading = false;
    }
  }

  onMount(() => {
    selectedCta = ctas[Math.floor(Math.random() * ctas.length)];
  });
</script>

<main class="@container mx-auto flex max-w-272 flex-col justify-center gap-6 pt-5 pr-[max(1.25rem+env(safe-area-inset-right))] pb-[max(1.25rem+env(safe-area-inset-bottom))] pl-[max(1.25rem+env(safe-area-inset-left))]">
  <div class={cn("flex w-full flex-col justify-center gap-6 rounded-lg py-6 text-3xl", preferences.performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-60 dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
    <div class="flex flex-col justify-center gap-2">
      <div class="flex flex-col gap-6">
        <label for="search" class="m-1 w-full text-center font-semibold">Show SkyBlock stats for</label>
        <!-- svelte-ignore a11y_autofocus -->
        <input
          id="search"
          type="search"
          required
          autofocus
          placeholder="Enter username"
          class="relative h-16 grow bg-text/10 text-center font-normal text-text placeholder:text-text/80 focus-visible:outline-hidden"
          bind:value={searchQuery}
          onchange={() => void submitSearch()}
          onkeydown={(e) => {
            if (e.key.toLowerCase() === "enter" || e.key.toLowerCase() === "search") {
              e.preventDefault();
              void submitSearch();
            }
          }} />
      </div>

      {#if !searchQueryValidated.success && searchQuery != null && searchQuery.length > 0}
        <div class="text-center text-sm font-semibold text-text/80">
          {searchQueryValidated.error.issues[0].message}
        </div>
      {/if}
      {#if submittedSearchError}
        <div class="text-center text-sm font-semibold text-text/80">{submittedSearchError}</div>
      {/if}
    </div>
    <Button.Root class="mx-auto flex w-full max-w-fit items-center justify-center rounded-3xl bg-icon px-6 py-3 text-base font-bold text-white uppercase transition-all duration-150 ease-out text-shadow-[0_0_3px_oklch(0%_0_0/50%)] hover:scale-[1.015] disabled:opacity-50 dark:text-text" disabled={searchQuery != null && searchQuery.length > 0 && !searchQueryValidated.success} onclick={() => void submitSearch()}>
      {#if submittedSearchLoading}
        <LoaderCircle class="size-6 animate-spin" />
      {:else}
        Show me
      {/if}
    </Button.Root>
  </div>

  {#if selectedCta}
    <CtaCard href={selectedCta.href} text={selectedCta.text} img={selectedCta.img} />
  {/if}

  <svelte:boundary>
    {#snippet pending()}
      <section class="flex flex-col gap-4">
        <div class={cn("h-16 animate-pulse rounded-lg", preferences.performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-60 dark:backdrop-brightness-50 dark:backdrop-contrast-100")}></div>
        <div class="grid grid-cols-1 gap-5 @md:grid-cols-2 @xl:grid-cols-3">
          {#each new Array(3) as _, i (i)}
            <div class={cn("flex flex-col overflow-hidden rounded-lg", preferences.performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-60 dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
              <div class="aspect-video w-full animate-pulse bg-text/10"></div>
              <div class="flex flex-col gap-2.5 p-4">
                <div class="h-4 w-2/5 animate-pulse rounded bg-text/10"></div>
                <div class="h-6 w-4/5 animate-pulse rounded bg-text/10"></div>
                <div class="h-12 w-full animate-pulse rounded bg-text/10"></div>
              </div>
            </div>
          {/each}
        </div>
      </section>
    {/snippet}
    {#snippet failed()}{/snippet}

    {@const newsroom = await listPosts({ page: 1, limit: 3 })}
    {#if newsroom.docs.length > 0}
      <section class="flex flex-col gap-4">
        <div class={cn("flex items-center justify-between gap-4 rounded-lg px-5 py-4", preferences.performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-60 dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
          <div class="flex flex-col gap-0.5">
            <h2 class="text-xl leading-tight font-bold text-text">Newsroom</h2>
            <p class="text-xs text-text/70">Latest announcements and updates</p>
          </div>
          <Button.Root href="/newsroom" data-sveltekit-preload-data="hover" class="flex shrink-0 items-center gap-1 text-sm font-semibold text-link transition-colors hover:text-hover">
            View all
            <ArrowRight class="size-4" />
          </Button.Root>
        </div>
        <div class="grid grid-cols-1 gap-5 @md:grid-cols-2 @xl:grid-cols-3">
          {#each newsroom.docs as post (post.id)}
            <PostCard {post} />
          {/each}
        </div>
      </section>
    {/if}
  </svelte:boundary>

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
