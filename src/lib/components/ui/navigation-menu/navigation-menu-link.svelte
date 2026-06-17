<script lang="ts">
  import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
  import { cn } from "$utils.js";

  let { ref = $bindable(null), class: className, ...restProps }: NavigationMenuPrimitive.LinkProps = $props();
</script>

<NavigationMenuPrimitive.Link bind:ref data-slot="navigation-menu-link" class={cn("data-[active=true]:focus:bg-muted data-[active=true]:hover:bg-muted data-[active=true]:bg-muted/50 focus-visible:ring-ring/30 hover:bg-muted focus:bg-muted flex items-center gap-1.5 rounded-3xl p-3 text-sm transition-all outline-none focus-visible:ring-3 focus-visible:outline-1 in-data-[slot=navigation-menu-content]:rounded-2xl [&_svg:not([class*='size-'])]:size-4", className)} {...restProps} />
