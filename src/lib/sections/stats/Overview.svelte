<script lang="ts">
  import { Section } from "$lib/components/sections";
  import AdditionalStats from "$lib/layouts/stats/AdditionalStats.svelte";
  import PlayerProfile from "$lib/layouts/stats/PlayerProfile.svelte";
  import Skills from "$lib/layouts/stats/Skills.svelte";
  import Stats from "$lib/layouts/stats/Stats.svelte";

  let { order }: { order: number } = $props();
</script>

<Section id="Overview" {order}>
  <div class="space-y-5">
    <PlayerProfile />
    <Skills />
    <Stats />
    <AdditionalStats />
  </div>
</Section>