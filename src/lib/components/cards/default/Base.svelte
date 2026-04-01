<script lang="ts" module>
  export const [getDefaultCardDataContext, setDefaultCardDataContext] = createContext<DefaultCardData>();
  export const [getDefaultCardSettingsContext, setDefaultCardSettingsContext] = createContext<DefaultCardSettings>();
</script>

<script lang="ts">
  import { createContext } from "svelte";
  import { setCardDataContext } from "..";
  import Player from "../components/Player.svelte";
  import type { DefaultCardData, DefaultCardProps, DefaultCardSettings } from "./index";
  import Profile from "./Profile.svelte";
  import Skills from "./Skills.svelte";
  import Stats from "./Stats.svelte";

  type Props = DefaultCardProps;

  const { profile, networth, dungeons, settings }: Props = $props();

  // svelte-ignore state_referenced_locally
  setCardDataContext({ profile });

  // svelte-ignore state_referenced_locally
  setDefaultCardDataContext({
    networth,
    dungeons
  });

  // svelte-ignore state_referenced_locally
  setDefaultCardSettingsContext({
    ...settings
  });
</script>

<main class="relative h-full overflow-hidden rounded-4xl" style={settings?.border && settings?.borderColor ? `border: 2px solid ${settings.borderColor}` : ""}>
  <img src="skycrypt-background" class="absolute inset-0 -z-10 h-screen w-screen object-cover" alt="" />

  <div class="flex h-full w-full items-start justify-start">
    <Player showMinecraftName={settings?.showMinecraftName ?? false} />
    <div
      class="relative z-50 flex h-full w-full flex-col gap-y-2 overflow-hidden rounded-4xl p-2 px-4 backdrop-blur-lg
backdrop-brightness-50">
      <Profile />
      <Skills />
      <Stats />
    </div>
  </div>
  <footer>
    <div class="absolute top-2 left-2 flex items-center justify-center gap-2 text-base font-bold text-white" data-sveltekit-preload-data="hover">
      <img src="skycrypt-logo" alt="SkyCrypt" class="pointer-events-none size-6 select-none" />
      <span>SkyCrypt</span>
    </div>
  </footer>
</main>
