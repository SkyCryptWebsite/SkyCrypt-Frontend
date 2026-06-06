<script lang="ts">
  import { Avatar, Button } from "bits-ui";

  interface Props {
    href: string;
    text: {
      title: string;
      description: string;
    };
    img: {
      src: string;
      alt: string;
    };
  }

  let { href, text, img }: Props = $props();
</script>

<Button.Root {href} target="_blank" rel="noreferrer" class="flex w-full items-center gap-4 rounded-lg p-4 transition-all duration-300 ease-out hover:scale-[1.05] glass glass-brightness-150 dark:glass-brightness-50 glass-contrast-60 dark:glass-contrast-100">
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
