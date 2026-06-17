<script lang="ts">
  import { getInternalState, getPreferences } from "$ctx";
  import { env } from "$env/dynamic/public";
  import Info from "$src/lib/components/header/Info.svelte";
  import { buttonVariants } from "$src/lib/components/ui/button";
  import { IsHover } from "$src/lib/hooks/is-hover.svelte";
  import { IsMobile } from "$src/lib/hooks/is-mobile.svelte";
  import { cn } from "$src/lib/shared/utils";
  import * as Kbd from "$ui/kbd";
  import * as NavigationMenu from "$ui/navigation-menu";
  import { type Icon as IconType } from "@lucide/svelte";
  import NewspaperIcon from "@lucide/svelte/icons/newspaper";
  import SearchIcon from "@lucide/svelte/icons/search";
  import { SvglDiscordLogo, SvglPatreonLogo, type SvglLogo } from "@selemondev/svgl-svelte";
  import type { NavigationMenuLinkProps } from "bits-ui";

  type ListItemProps = NavigationMenuLinkProps & {
    title: string;
    href: string;
    content: string;
    icon: typeof IconType | typeof SvglLogo;
  };

  const { PUBLIC_DISCORD_INVITE, PUBLIC_PATREON } = env;

  const preferences = getPreferences();
  const internalState = getInternalState();
  const isMobile = new IsMobile();
  const isHover = new IsHover();
</script>

{#snippet ListItem({ title, content, href, class: className, icon: IconComponent, ...restProps }: ListItemProps)}
  <NavigationMenu.Link {href} class={cn("hover:bg-background/50 hover:scale-95", className)} {...restProps}>
    <div class="flex flex-col gap-1">
      <div class="flex items-center-safe gap-1">
        <IconComponent class="size-5" />
        <div class="text-sm text-left leading-none font-medium">{title}</div>
      </div>
      <p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
        {content}
      </p>
    </div>
  </NavigationMenu.Link>
{/snippet}

<NavigationMenu.Root viewport={isMobile.current}>
  <NavigationMenu.List class="gap-4">
    <NavigationMenu.Item class="hidden md:block">
      <NavigationMenu.Trigger class={buttonVariants({ variant: "outline", class: "data-open:focus:bg-transparent" })}>Home</NavigationMenu.Trigger>
      <NavigationMenu.Content class="standard:bg-transparent! glass glass-bg-popover">
        <div class="sm:w-100 md:w-125">
          {@render ListItem({
            href: "/newsroom",
            title: "Newsroom",
            content: "Latest announcements and updates from the SkyCrypt team.",
            icon: NewspaperIcon
          })}
          {@render ListItem({
            href: PUBLIC_DISCORD_INVITE,
            title: "Discord",
            content: "Announcements, Community, Bug Reports, Feature Requests, Support",
            icon: SvglDiscordLogo
          })}
          {@render ListItem({
            href: PUBLIC_PATREON,
            title: "Patreon",
            content: "Help keep SkyCrypt ad free by donating",
            icon: SvglPatreonLogo
          })}
        </div>
      </NavigationMenu.Content>
    </NavigationMenu.Item>

    <NavigationMenu.Item class={buttonVariants({ variant: "outline", class: "data-open:focus:bg-transparent" })} onpointerdown={() => (internalState.openCommand = true)}>
      <div class="flex items-center-safe gap-1">
        Search
        {#if isHover.current}
          <Kbd.Root class="hidden md:block light:bg-foreground/30 dark:bg-background/30 size-fit min-w-auto py-0.5">{preferences.keybind}</Kbd.Root>
        {:else}
          <SearchIcon class="size-4" />
        {/if}
      </div>
    </NavigationMenu.Item>

    <NavigationMenu.Item class="hidden md:block">
      <NavigationMenu.Trigger class={buttonVariants({ variant: "outline", class: "data-open:focus:bg-transparent" })}>About</NavigationMenu.Trigger>
      <NavigationMenu.Content class="standard:bg-transparent! glass glass-bg-popover gap-0">
        <div class="sm:w-md md:w-lg leading-normal space-y-4 p-4">
          <Info />
        </div>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>
