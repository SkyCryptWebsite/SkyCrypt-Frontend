<script lang="ts" module>
  import type { PostType } from "$types";

  const TYPE_STYLES: Record<PostType, string> = {
    announcement: "bg-gold/15 text-gold",
    news: "bg-link/15 text-link",
    update: "bg-minecraft-a/15 text-minecraft-a",
    changelog: "bg-minecraft-d/15 text-minecraft-d",
    guide: "bg-minecraft-b/15 text-minecraft-b",
    event: "bg-minecraft-c/15 text-minecraft-c"
  };

  export const POST_TYPE_LABELS: Record<PostType, string> = {
    announcement: "Announcement",
    news: "News",
    update: "Update",
    changelog: "Changelog",
    guide: "Guide",
    event: "Event"
  };
</script>

<script lang="ts">
  import { cn } from "$lib/shared/utils";

  const { type, class: className }: { type: PostType; class?: string } = $props();
</script>

<span class={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm", TYPE_STYLES[type], className)}>
  {POST_TYPE_LABELS[type]}
</span>
