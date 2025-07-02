<script lang="ts">
  import { PUBLIC_DISCORD_INVITE, PUBLIC_PATREON } from "$env/static/public";
  import type { IsHover } from "$lib/hooks/is-hover.svelte";
  import { getUsername } from "$lib/shared/helper";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { favorites } from "$lib/stores/favorites";
  import { content } from "$lib/stores/internal";
  import { performanceMode } from "$lib/stores/preferences";
  import CodeXml from "@lucide/svelte/icons/code-xml";
  import GitPullRequestArrow from "@lucide/svelte/icons/git-pull-request-arrow";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import Server from "@lucide/svelte/icons/server";
  import Star from "@lucide/svelte/icons/star";
  import { Avatar, Button, Tooltip } from "bits-ui";
  import { Control, Field, FieldErrors, Label } from "formsnap";
  import { getContext, onMount } from "svelte";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import type { PageData } from "./$types";
  import { Role } from "./enums";
  import { schema } from "./schema";

  let { data }: { data: PageData } = $props();

  const isHover = getContext<IsHover>("isHover");

  const form = superForm(data.searchForm, {
    validators: zodClient(schema),
    validationMethod: "oninput",
    id: "searchForm"
  });

  const { form: formData, enhance, errors, tainted, submitting, isTainted, message } = form;

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

  onMount(() => {
    selectedCta = ctas[Math.floor(Math.random() * ctas.length)];
  });
</script>

<main class="@container mx-auto mt-[48px] flex min-h-screen max-w-[68rem] flex-col justify-center gap-6 pt-5 pr-[max(1.25rem+env(safe-area-inset-right))] pb-[max(1.25rem+env(safe-area-inset-bottom))] pl-[max(1.25rem+env(safe-area-inset-left))]">
  <form method="POST" action="/search" use:enhance class={cn("flex w-full flex-col justify-center gap-6 rounded-lg py-6 text-3xl", $performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-[60%] dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
    <div class="flex flex-col justify-center gap-2">
      <Field {form} name="query">
        <Control>
          {#snippet children({ props })}
            <div class="flex flex-col gap-6">
              <Label class="m-1 w-full text-center font-semibold">Show SkyBlock stats for</Label>
              <!-- svelte-ignore a11y_autofocus -->
              <input {...props} type="search" required autofocus placeholder="Enter username" class="bg-text/10 text-text placeholder:text-text/80 relative h-16 grow text-center font-normal focus-visible:outline-hidden" bind:value={$formData.query} />
            </div>
          {/snippet}
        </Control>
        {#if $formData.query.length > 0 && isTainted($tainted?.query) && $errors.query !== undefined}
          <FieldErrors class="text-text/80 text-center text-sm font-semibold" />
        {/if}
        {#if $message && $message.type === "error"}
          <div class="text-text/80 text-center text-sm font-semibold">{$message.text}</div>
        {/if}
      </Field>
    </div>
    <Button.Root type="submit" class="bg-icon dark:text-text mx-auto flex w-full max-w-fit items-center justify-center rounded-3xl px-6 py-3 text-base font-bold text-white uppercase transition-all duration-150 [text-shadow:0_0_3px_oklch(0%_0_0_/_50%)] hover:scale-[1.015] disabled:opacity-50" disabled={($formData.query.length > 0 && isTainted($tainted?.query) && $errors.query !== undefined) || $submitting}>
      {#if $submitting}
        <LoaderCircle class="size-6 animate-spin" />
      {:else}
        Show me
      {/if}
    </Button.Root>
  </form>

  {#if selectedCta}
    {@render ctalink(selectedCta.href, selectedCta.text, selectedCta.img)}
  {/if}

  <div class="grid grid-cols-1 gap-5 @xl:grid-cols-2 @5xl:grid-cols-3">
    {#if $favorites.length === 0}
      {@render profile({ id: "0", name: "No favorites set!", quote: "Why don't you set a favorite?" }, { tip: true })}
    {:else}
      {#each $favorites.reverse() as favorite, index (index)}
        {#await getUsername(favorite)}
          {@render profileSkeleton()}
        {:then username}
          {@render profile({ id: favorite, name: username, role: Role.FAVORITE }, { favorite: true })}
        {/await}
      {/each}
    {/if}

    {#await data.contributors}
      {#each new Array(3 * 4) as _, index (index)}
        {@render profileSkeleton()}
      {/each}
    {:then contributors}
      {#each contributors as contributor (contributor.id)}
        {@render profile(contributor)}
      {/each}
    {/await}
  </div>
</main>

{#snippet profile(user: { id: string; name: string; quote?: string; role?: Role }, options?: { tip?: boolean; favorite?: boolean })}
  {#snippet tooltipContent()}
    <p class="text-text/80 font-semibold capitalize">
      {#if options?.favorite}
        Favorited
      {:else if user.role}
        SkyCrypt {Role[user.role].toLowerCase()}
      {:else}
        Unknown
      {/if}
    </p>
  {/snippet}

  <div class={cn("relative rounded-lg", { "transition-all duration-300 hover:scale-105": !options?.tip })}>
    <Button.Root href={options?.tip ? "#" : `/stats/${user.id}`} class={cn("relative flex h-full min-w-0 items-center gap-4 rounded-lg p-5", $performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-[60%] dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
      <Avatar.Root class="bg-text/10 size-16 shrink-0 rounded-lg">
        <Avatar.Image loading="lazy" src={options?.tip ? "https://mc-heads.net/avatar/bc8ea1f51f253ff5142ca11ae45193a4ad8c3ab5e9c6eec8ba7a4fcb7bac40/64" : `https://crafatar.com/avatars/${user.id}?size=64&overlay`} alt={user.name} class="aspect-square size-16 rounded-lg " />
        <Avatar.Fallback class="text-text/60 flex h-full items-center justify-center text-lg font-semibold uppercase">
          {user.name.slice(0, 2)}
        </Avatar.Fallback>
      </Avatar.Root>
      <div class="flex flex-col justify-center gap-0">
        <div class="text-text text-lg font-semibold">
          {user.name}
        </div>
        {#if user.quote}
          <div class={cn("text-text/80 pr-4 text-sm font-medium text-pretty", user.role === Role.TECHNOBLADE ? "italic" : "")}>{@html user.quote}</div>
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
              favorites.set($favorites.filter((uuid) => uuid !== user.id));
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
            <Tooltip.Content forceMount class="bg-background-grey rounded-lg p-4" sideOffset={6} side="top" align="center">
              {#snippet child({ wrapperProps, props, open })}
                {#if open}
                  <div {...wrapperProps}>
                    <div {...props} transition:flyAndScale={{ y: 8, duration: 150 }}>
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
  <div class={cn("relative flex min-w-0 items-center gap-2 rounded-lg p-5", $performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-[60%] dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
    <div class="bg-text/10 size-16 animate-pulse rounded-lg"></div>
    <div class="flex flex-col gap-1">
      <div class="bg-text/10 h-6 w-24 animate-pulse rounded-lg"></div>
      <div class="bg-text/10 h-3 w-44 animate-pulse rounded-lg"></div>
    </div>
    <div class="bg-text/10 absolute right-3 bottom-3 size-5 animate-pulse rounded-lg"></div>
  </div>
{/snippet}

{#snippet ctalink(href: string, text: { title: string; description: string }, img: { src: string; alt: string })}
  <Button.Root {href} target="_blank" rel="noreferrer" class={cn("flex w-full items-center gap-4 rounded-lg p-4 transition-all duration-300 hover:scale-[1.05]", $performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-[60%] dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
    <Avatar.Root class="size-12 shrink-0 rounded-lg select-none">
      <Avatar.Image loading="lazy" src={img.src} alt={img.alt} class="pointer-events-none size-12 rounded-lg" />
      <Avatar.Fallback class="text-text/60 flex h-full items-center justify-center text-lg font-semibold uppercase">{img.alt.slice(0, 2)}</Avatar.Fallback>
    </Avatar.Root>
    <div>
      <div class="font-semibold">
        <span class="text-text/70">SkyCrypt's</span>
        <span class="text-link">{text.title}</span>
      </div>
      <div class="text-text/90 font-medium opacity-85">{text.description}</div>
    </div>
  </Button.Root>
{/snippet}
