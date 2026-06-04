<script lang="ts">
  import { getPreferences } from "$ctx";
  import TypeBadge from "$lib/components/newsroom/TypeBadge.svelte";
  import { clientLocale } from "$lib/hooks/client-locale.svelte";
  import { cn } from "$lib/shared/utils";
  import type { Author, AuthorView, Post } from "$types";
  import ImageIcon from "@lucide/svelte/icons/image";
  import Star from "@lucide/svelte/icons/star";
  import { Avatar, Button } from "bits-ui";

  /** `as` sets the title's heading level so the card fits its surrounding document outline. */
  const { post, as = "h3" }: { post: Post; as?: "h2" | "h3" } = $props();

  const preferences = getPreferences();

  const dateFormatter = $derived(new Intl.DateTimeFormat(clientLocale.current, { year: "numeric", month: "long", day: "numeric" }));
  const formatDate = (iso: string | null | undefined): string => {
    if (!iso) return "";
    try {
      return dateFormatter.format(new Date(iso));
    } catch {
      return iso;
    }
  };

  const authorOf = (author: Author | string): AuthorView => (typeof author === "string" ? { id: author, name: "Unknown" } : author);

  const author = $derived(authorOf(post.author));
  const displayName = $derived(author.displayName?.trim() || author.name);
  const initials = $derived(displayName.slice(0, 2).toUpperCase());
  const thumb = $derived(post.heroImage?.sizes?.card ?? post.heroImage?.sizes?.thumbnail ?? (post.heroImage ? { url: post.heroImage.url, width: post.heroImage.width, height: post.heroImage.height } : null));
  const visibleTags = $derived(post.tags?.slice(0, 3) ?? []);
  const overflowTags = $derived((post.tags?.length ?? 0) - visibleTags.length);
</script>

<Button.Root href="/newsroom/{post.slug}" data-sveltekit-preload-data="hover" class={cn("group relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-lg text-left", preferences.performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-60 dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
  <div class="relative aspect-video w-full overflow-hidden bg-background-lore">
    {#if thumb && post.heroImage}
      <Avatar.Root class="size-full transition-transform duration-300 ease-out group-hover:scale-105">
        <Avatar.Image src={thumb.url} alt={post.heroImage.alt ?? ""} width={thumb.width} height={thumb.height} loading="lazy" class="size-full object-cover" />
        <Avatar.Fallback class="flex size-full items-center justify-center bg-text/10">
          <ImageIcon class="size-6" aria-label="Image failed to load" />
        </Avatar.Fallback>
      </Avatar.Root>
    {/if}
    <div class="pointer-events-none absolute inset-0 bg-linear-to-t from-background/70 via-background/10 to-transparent group-hover:opacity-0 transition-opacity duration-300 ease-out"></div>
    {#if post.featured}
      <Star class="size-6 absolute top-2 left-2 shrink-0 fill-gold text-gold" aria-label="Featured" />
    {/if}
  </div>
  <div class="flex flex-1 flex-col gap-2.5 p-4">
    <div class="flex items-center justify-between gap-4 text-sm">
      <div class="flex min-w-0 items-center justify-center gap-2">
        {#if author.mcUuid}
          <Avatar.Root class="size-4 shrink-0">
            <Avatar.Image loading="lazy" src="https://nmsr.nickac.dev/face/{author.mcUuid}" alt={displayName} class="size-full [image-rendering:pixelated]" />
            <Avatar.Fallback class="flex size-full items-center justify-center bg-text/10 text-[0.5rem] font-semibold text-text/60 uppercase">{initials}</Avatar.Fallback>
          </Avatar.Root>
        {/if}
        <span class="truncate text-text/60">{displayName}</span>
      </div>
      <time datetime={post.publishedAt} class="shrink-0 text-text/60">{formatDate(post.publishedAt)}</time>
    </div>

    <svelte:element this={as} class="text-xl leading-tight font-bold text-text transition-colors group-hover:text-hover">{post.title}</svelte:element>

    {#if post.excerpt}
      <p class="line-clamp-3 text-sm leading-relaxed text-text/80">{post.excerpt}</p>
    {/if}

    <div class="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
      <TypeBadge type={post.type} />
      {#each visibleTags as tag (tag)}
        <span class="rounded-full bg-text/10 px-2 py-0.5 text-[10px] font-medium text-text/70">#{tag}</span>
      {/each}
      {#if overflowTags > 0}
        <span class="rounded-full bg-text/10 px-2 py-0.5 text-[10px] font-medium text-text/50">+{overflowTags}</span>
      {/if}
    </div>
  </div>
</Button.Root>
