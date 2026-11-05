<script lang="ts">
  import { PUBLIC_DISCORD_INVITE, PUBLIC_PATREON } from "$app/env/public";
  import { resolve } from "$app/paths";
  import { onMount } from "svelte";
  import { API_DOCS_URL } from "#lib/shared/constants/developer";

  type FooterSection = {
    label: string;
    links: { title: string; href: string; external?: boolean }[];
  };

  const footerLinks: FooterSection[] = [
    {
      label: "SkyCrypt",
      links: [
        { title: "Newsroom", href: resolve("/newsroom") },
        { title: "About", href: resolve("/(pages)/about") }
      ]
    },
    {
      label: "Social",
      links: [
        { title: "Discord", href: PUBLIC_DISCORD_INVITE, external: true },
        { title: "Patreon", href: PUBLIC_PATREON, external: true },
        { title: "GitHub", href: "https://github.com/SkyCryptWebsite", external: true }
      ]
    },
    {
      label: "Developers",
      links: [
        { title: "API Policy", href: resolve("/(pages)/api-policy") },
        { title: "API Docs", href: API_DOCS_URL, external: true }
      ]
    },
    {
      label: "Legal",
      links: [
        { title: "Terms of Service", href: resolve("/(pages)/terms-of-service") },
        { title: "API Policy", href: resolve("/(pages)/api-policy") }
      ]
    },
    {
      label: "Privacy",
      links: [{ title: "Privacy Policy", href: resolve("/(pages)/privacy-policy") }]
    }
  ];

  const currentYear = new Date().getFullYear();

  // NitroPay fills these only for visitors the law applies to (California opt-out, GDPR consent); these calls make it rescan after client-side renders.
  onMount(() => {
    window.__uspapi?.("addLink", 1);
    window.__cmp?.("addConsentLink");
  });
</script>

<footer class="relative z-20 pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]">
  <div
    class="mx-auto flex w-full flex-col border border-b-0 glass px-6 pb-[calc(max(1rem,env(safe-area-inset-bottom))+var(--anchor-height,0px))] glass-bg-popover md:px-8 standard:bg-transparent">
    <div class="grid w-full gap-8 py-6 md:grid-cols-3 md:py-8">
      <div>
        <a href={resolve("/")} class="inline-flex items-center gap-1 rounded-md font-bold">
          <img src="/img/skycrypt-logo.avif" alt="" class="pointer-events-none size-10 select-none" />
          SkyCrypt
        </a>
        <p class="text-sm text-pretty text-muted-foreground">A free, open-source stats viewer for Hypixel SkyBlock.</p>
      </div>

      <div class="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-2 lg:grid-cols-5">
        {#each footerLinks as section (section.label)}
          <nav aria-label={section.label}>
            <h2 class="text-xs font-medium">{section.label}</h2>
            <ul class="mt-4 space-y-2 text-sm text-muted-foreground">
              {#each section.links as link (link.title)}
                <li>
                  <!-- eslint-disable svelte/no-navigation-without-resolve -- internal links are resolved above -->
                  <a
                    class="rounded-sm transition-colors hover:text-foreground focus-visible:text-foreground"
                    href={link.href}
                    rel={link.external ? "noreferrer" : undefined}
                    target={link.external ? "_blank" : undefined}>
                    {link.title}
                  </a>
                  <!-- eslint-enable svelte/no-navigation-without-resolve -->
                </li>
              {/each}
              {#if section.label === "Privacy"}
                {const injected =
                  "has-[>:empty]:hidden [&_:is(a,button)]:cursor-pointer [&_:is(a,button)]:rounded-sm [&_:is(a,button)]:text-left [&_:is(a,button)]:transition-colors [&_:is(a,button)]:hover:text-foreground [&_:is(a,button)]:focus-visible:text-foreground"}
                <li class={injected}><span data-ccpa-link="1"></span></li>
                <li class={injected}><div id="ncmp-consent-link"></div></li>
              {/if}
            </ul>
          </nav>
        {/each}
      </div>
    </div>

    <div class="h-px w-full bg-linear-to-r via-border"></div>

    <div
      class="flex w-full flex-col items-center gap-1 pt-4 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
      <p>Not affiliated with Hypixel Inc., Mojang or Microsoft.</p>
      <p>&copy; {currentYear} SkyCrypt LLC</p>
    </div>
  </div>
</footer>
