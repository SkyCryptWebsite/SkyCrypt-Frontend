<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import { getNewsroomNotifications, getPreferences } from "$ctx";
  import { clientLocale } from "$lib/hooks/client-locale.svelte";
  import { cn } from "$lib/shared/utils";
  import PostRenderer from "$src/lib/components/newsroom/PostRenderer.svelte";
  import TypeBadge from "$src/lib/components/newsroom/TypeBadge.svelte";
  import type { Author, AuthorView } from "$types";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import Star from "@lucide/svelte/icons/star";
  import { Avatar, Button } from "bits-ui";
  import SvelteSeo from "svelte-seo";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  const preferences = getPreferences();
  const notifications = getNewsroomNotifications();

  const dateFormatter = $derived(
    new Intl.DateTimeFormat(clientLocale.current, {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  );

  function formatDate(iso: string | null | undefined): string {
    if (!iso) return "";
    try {
      return dateFormatter.format(new Date(iso));
    } catch {
      return iso;
    }
  }

  function authorOf(author: Author | string): AuthorView {
    if (typeof author === "string") return { id: author, name: "Unknown" };
    return author;
  }

  const post = $derived(data.post);
  const author = $derived(authorOf(post.author));
  const displayName = $derived(author.displayName?.trim() || author.name);
  const initials = $derived(displayName.slice(0, 2).toUpperCase());
  const heroSrc = $derived(post.heroImage?.sizes?.hero?.url ?? post.heroImage?.url ?? null);
  const heroWidth = $derived(post.heroImage?.sizes?.hero?.width ?? post.heroImage?.width ?? undefined);
  const heroHeight = $derived(post.heroImage?.sizes?.hero?.height ?? post.heroImage?.height ?? undefined);
  const heroAlt = $derived(post.heroImage?.alt ?? post.title);

  const ogImages = $derived(post.heroImage?.url ? [{ url: post.heroImage.url, width: post.heroImage.width ?? undefined, height: post.heroImage.height ?? undefined, alt: post.heroImage.alt ?? post.title }] : []);

  const containerClass = $derived(cn("rounded-lg", preferences.performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-60 dark:backdrop-brightness-50 dark:backdrop-contrast-100"));

  const markCurrentPostSeen = () => {
    if (!data.preview) notifications.markPostSeen(data.post);
  };

  afterNavigate(markCurrentPostSeen);
</script>

<SvelteSeo
  title="{post.title} | SkyCrypt"
  description={post.excerpt ?? post.title}
  canonical="https://sky.shiiyu.moe/newsroom/{post.slug}"
  openGraph={{
    type: "article",
    title: post.title,
    description: post.excerpt ?? post.title,
    images: ogImages,
    article: {
      published_time: post.publishedAt ?? undefined,
      author: [displayName]
    }
  }} />

<article class="mx-auto flex max-w-3xl flex-col gap-6 px-[max(1.25rem,env(safe-area-inset-right))] py-8">
  <Button.Root href="/newsroom" data-sveltekit-preload-data="hover" class={cn("flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-text transition-all duration-150 ease-out hover:text-link", preferences.performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-60 dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
    <ArrowLeft class="size-4" />
    Newsroom
  </Button.Root>

  {#if data.preview}
    <div role="status" class="rounded-lg bg-gold px-4 py-2.5 text-center text-sm font-bold tracking-wide text-background">Draft preview — not visible to public</div>
  {/if}

  {#if heroSrc}
    <div class="aspect-video overflow-hidden rounded-lg bg-background-lore">
      <img src={heroSrc} alt={heroAlt} width={heroWidth} height={heroHeight} loading="lazy" class="size-full object-cover" />
    </div>
  {/if}

  <header class={cn("flex flex-col gap-4 p-6 md:p-8", containerClass)}>
    <div class="flex items-center gap-2">
      <TypeBadge type={post.type} />
      {#if post.featured}
        <span class="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-gold uppercase">
          <Star class="size-3 fill-gold" />
          Featured
        </span>
      {/if}
    </div>
    <h1 class="text-4xl leading-tight font-bold text-text md:text-5xl">{post.title}</h1>
    <div class="flex items-center gap-3 text-sm">
      <Avatar.Root class="size-10 shrink-0">
        {#if author.mcUuid}
          <Avatar.Image loading="lazy" src="https://nmsr.nickac.dev/face/{author.mcUuid}" alt={displayName} class="size-10 [image-rendering:pixelated]" />
        {/if}
        <Avatar.Fallback class="flex size-10 items-center justify-center bg-text/10 text-sm font-semibold text-text/60 uppercase">{initials}</Avatar.Fallback>
      </Avatar.Root>
      <div class="flex flex-col leading-tight">
        <span class="font-semibold text-text">{displayName}</span>
        <time datetime={post.publishedAt} class="text-xs text-text/60">{formatDate(post.publishedAt)}</time>
      </div>
    </div>
    {#if post.tags && post.tags.length > 0}
      <div class="flex flex-wrap gap-1.5">
        {#each post.tags as tag (tag)}
          <span class="rounded-full bg-text/10 px-2.5 py-0.5 text-xs font-medium text-text/70">#{tag}</span>
        {/each}
      </div>
    {/if}
  </header>

  <div class={cn("p-6 text-base leading-7 text-text md:p-8 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0", containerClass)}>
    <PostRenderer body={post.body ?? []} />
  </div>
</article>
