<script lang="ts">
  import { getNewsroomNotifications } from "$ctx";
  import type { Post } from "$types";
  import { toast } from "svelte-sonner";
  import NewPostsToast from "./NewPostsToast.svelte";

  interface Props {
    posts: Post[];
  }

  const { posts }: Props = $props();

  const notifications = getNewsroomNotifications();
  const unseenPosts = $derived(notifications.getUnseenPosts(posts));
  const unreadCount = $derived(unseenPosts.length);
  const newestUnseen = $derived(unseenPosts[0] ?? null);
  const unreadSignature = $derived(unseenPosts.map((post) => post.id).join("|"));

  let toastId: string | number | undefined;
  let shownSignature = "";

  $effect(() => {
    if (!newestUnseen || unreadCount === 0) {
      if (toastId !== undefined) {
        toast.dismiss(toastId);
        toastId = undefined;
      }
      shownSignature = "";
      return;
    }

    if (unreadSignature === shownSignature) return;

    shownSignature = unreadSignature;
    toastId = toast.custom(NewPostsToast, {
      id: "newsroom-new-posts",
      position: "bottom-right",
      duration: Number.POSITIVE_INFINITY,
      dismissible: true,
      componentProps: {
        posts,
        newestUnseen,
        closeToast: () => toast.dismiss("newsroom-new-posts")
      },
      onDismiss: () => {
        toastId = undefined;
        shownSignature = "";
      }
    });
  });

  $effect(() => {
    return () => toast.dismiss("newsroom-new-posts");
  });
</script>
