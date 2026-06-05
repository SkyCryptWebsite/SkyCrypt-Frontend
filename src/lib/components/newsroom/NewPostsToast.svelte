<script lang="ts">
  import { getNewsroomNotifications, getPreferences } from "$ctx";
  import { clientLocale } from "$lib/hooks/client-locale.svelte";
  import { cn } from "$lib/shared/utils";
  import TypeBadge from "$src/lib/components/newsroom/TypeBadge.svelte";
  import type { Post } from "$types";
  import ImageIcon from "@lucide/svelte/icons/image";
  import Newspaper from "@lucide/svelte/icons/newspaper";
  import { Avatar, Button } from "bits-ui";

  interface Props {
    posts: Post[];
    newestUnseen: Post;
    closeToast?: () => void;
  }

  const { posts, newestUnseen, closeToast = () => {} }: Props = $props();

  const preferences = getPreferences();
  const notifications = getNewsroomNotifications();

  const dateFormatter = $derived(new Intl.DateTimeFormat(clientLocale.current, { year: "numeric", month: "long", day: "numeric" }));
  const thumb = $derived(newestUnseen.heroImage?.sizes?.card ?? newestUnseen.heroImage?.sizes?.thumbnail ?? (newestUnseen.heroImage ? { url: newestUnseen.heroImage.url, width: newestUnseen.heroImage.width, height: newestUnseen.heroImage.height } : null));
  const publishedDate = $derived(formatDate(newestUnseen.publishedAt));
  const visibleTags = $derived(newestUnseen.tags?.slice(0, 3) ?? []);
  const overflowTags = $derived((newestUnseen.tags?.length ?? 0) - visibleTags.length);

  function formatDate(iso: string | null | undefined): string {
    if (!iso) return "";
    try {
      return dateFormatter.format(new Date(iso));
    } catch {
      return iso;
    }
  }

  function dismiss() {
    notifications.markAllSeen(posts);
    closeToast();
  }
</script>

<section role="status" aria-live="polite" class={cn("flex w-full max-w-sm flex-col gap-3 rounded-lg px-4 py-3 text-text shadow-lg shadow-black/10 @container-normal @sm:max-w-md", preferences.performanceMode ? "bg-background-grey" : "backdrop-blur-lg backdrop-brightness-150 backdrop-contrast-60 dark:backdrop-brightness-50 dark:backdrop-contrast-100")}>
  <div class="flex flex-col min-w-0 items-start gap-3">
    {#if thumb && newestUnseen.heroImage}
      <Avatar.Root class="relative aspect-video w-full max-w-sm mx-auto shrink-0 overflow-hidden rounded-lg bg-background-lore">
        <Avatar.Image src={thumb.url} alt={newestUnseen.heroImage.alt ?? ""} width={thumb.width} height={thumb.height} loading="lazy" class="size-full object-cover" />
        <Avatar.Fallback class="flex size-full items-center justify-center bg-text/10">
          <ImageIcon class="size-5" aria-label="Image failed to load" />
        </Avatar.Fallback>
        <div class="pointer-events-none absolute inset-0 bg-linear-to-t from-background/70 via-background/10 to-transparent group-hover:opacity-0 transition-opacity duration-300 ease-out"></div>
      </Avatar.Root>
    {:else}
      <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-link/15 text-link">
        <Newspaper class="size-5" />
      </div>
    {/if}

    <div class="min-w-0 flex-1 space-y-1">
      <p class="text-lg lg:text-xl leading-tight font-bold text-text">{newestUnseen.title}</p>
      {#if newestUnseen.excerpt}
        <p class="line-clamp-3 text-sm leading-relaxed text-text/80">{newestUnseen.excerpt}</p>
      {/if}
      {#if publishedDate}
        <time datetime={newestUnseen.publishedAt ?? undefined} class="shrink-0 text-xs font-medium text-text/60">{publishedDate}</time>
      {/if}
    </div>

    <div class="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
      <TypeBadge type={newestUnseen.type} />
      {#each visibleTags as tag (tag)}
        <span class="rounded-full bg-text/10 px-2 py-0.5 text-[10px] font-medium text-text/70">#{tag}</span>
      {/each}
      {#if overflowTags > 0}
        <span class="rounded-full bg-text/10 px-2 py-0.5 text-[10px] font-medium text-text/50">+{overflowTags}</span>
      {/if}
    </div>
  </div>

  <div class="flex items-center justify-end gap-2">
    <Button.Root aria-label="Dismiss newsroom notifications" class="rounded-lg px-3 py-1.5 text-sm font-bold transition-colors hover:text-hover text-text/70" onclick={dismiss}>Close</Button.Root>
    {#if newestUnseen.slug}
      <Button.Root href="/newsroom/{newestUnseen.slug}" data-sveltekit-preload-data="hover" class="rounded-lg bg-link px-3 py-1.5 text-sm font-bold text-background transition-colors hover:bg-hover" onclick={closeToast}>Read</Button.Root>
    {/if}
  </div>
</section>
