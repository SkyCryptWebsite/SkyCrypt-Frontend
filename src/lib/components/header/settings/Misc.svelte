<script lang="ts">
  import { getPreferences } from "$ctx";
  import { SettingsTab } from "$lib/components/header/types";
  import Pickaxe from "@lucide/svelte/icons/pickaxe";
  import Settings2 from "@lucide/svelte/icons/settings-2";
  import { Tabs } from "bits-ui";
  import SettingToggleRow from "./SettingToggleRow.svelte";

  const preferences = getPreferences();
</script>

<Tabs.Content value={SettingsTab.Misc} class="space-y-6">
  <div class="flex max-h-96 flex-col gap-4 overflow-x-clip overflow-y-auto">
    <div class="space-y-4 rounded-lg bg-text/5 p-4">
      <div class="flex items-start gap-2 rounded-lg p-2 font-semibold">
        <Settings2 class="size-5 h-lh shrink-0" />
        <div>
          <h4>Misc Settings</h4>
          <div class="space-y-2">
            <p class="text-text/60">These settings affect various parts of SkyCrypt.</p>
            <p class="text-text/60">They are saved in your browser and will persist across sessions.</p>
          </div>
        </div>
      </div>

      <SettingToggleRow id="mctooltip" title="Minecraft Styled Tooltips" description="Enable Minecraft styled tooltips for items." checked={preferences.mctooltip} onCheckedChange={() => (preferences.mctooltip = !preferences.mctooltip)}>
        {#snippet icon()}
          <Pickaxe class="size-6 h-lh shrink-0" />
        {/snippet}
      </SettingToggleRow>
    </div>
  </div>
</Tabs.Content>
