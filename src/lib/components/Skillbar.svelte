<script lang="ts">
  import type { ModelsSkill } from "$lib/shared/api/orval-generated";
  import { calculatePercentage, formatNumber } from "$lib/shared/helper";
  import { cn } from "$lib/shared/utils";
  import { performanceMode } from "$lib/stores/preferences";
  import BarChartHorizontal from "@lucide/svelte/icons/bar-chart-horizontal";
  import { Avatar, Progress } from "bits-ui";
  import { format } from "numerable";
  import { createHover } from "svelte-interactions";

  type Props = {
    skill: string;
    skillData: ModelsSkill;
    apiEnabled?: boolean;
    class?: string | null | undefined;
  };

  let { skill, skillData, apiEnabled = true, class: className }: Props = $props();

  const { hoverAction, isHovered } = createHover();
  const isMaxed = $derived(skillData.maxed);
</script>

<div class={cn("group relative flex grow basis-full flex-col sm:basis-1/3 sm:last:grow-0 sm:last:basis-1/2", !apiEnabled && "opacity-50 grayscale", className)} data-maxed={isMaxed} use:hoverAction>
  <div class={cn("absolute bottom-0 left-0 z-10 flex size-9 items-center justify-center rounded-full p-1 drop-shadow-sm group-data-[maxed=false]:bg-icon group-data-[maxed=true]:bg-maxed", apiEnabled ? "" : "bg-gray-600", { "group-data-[maxed=true]:shine": !$performanceMode })}>
    <Avatar.Root class="select-none">
      <Avatar.Image loading="lazy" class={cn("pointer-events-none size-6.5 [image-rendering:pixelated]", !apiEnabled && "grayscale")} src={skillData.texture} alt={skill} />
      <Avatar.Fallback>
        <BarChartHorizontal class="pointer-events-none size-6" />
      </Avatar.Fallback>
    </Avatar.Root>
  </div>

  <div class="relative ml-10 text-sm font-semibold capitalize">
    {skill}
    <span class="text-text/80">
      {skillData.level}
    </span>
  </div>
  <Progress.Root value={skillData.xpCurrent} max={isMaxed ? skillData.xpCurrent : skillData.xpForNext} class={cn("relative ml-2 h-4 w-full overflow-hidden rounded-full", apiEnabled ? "bg-text/30" : "bg-gray-500")}>
    {#if apiEnabled}
      <div class="absolute z-10 flex h-full w-full justify-center">
        <div class="text-xs font-semibold shadow-background/50 text-shadow-md">
          {#if $isHovered && !isMaxed}
            {format(skillData.xpCurrent, "0,0")} / {format(skillData.xpForNext)}
          {:else if !isMaxed}
            {formatNumber(skillData.xpCurrent ?? 0)} / {formatNumber(skillData.xpForNext ?? 0)}
          {/if}

          {#if $isHovered && isMaxed}
            {format(skillData.xpCurrent, "0,0")}
          {:else if isMaxed}
            {formatNumber(skillData.xpCurrent ?? 0)}
          {/if}
          XP
        </div>
      </div>
    {/if}
    <div class={cn("h-full w-full flex-1 rounded-full transition-all duration-300 ease-out group-data-[maxed=false]:[background:var(--skillbar)] group-data-[maxed=true]:[background:var(--maxedbar)]", apiEnabled ? "" : "bg-gray-500")} style={`transform: translateX(-${100 - parseFloat(calculatePercentage(skillData.xpCurrent ?? 0, isMaxed ? (skillData.xpCurrent ?? 0) : (skillData.xpForNext ?? 0)))}%)`}></div>
  </Progress.Root>
</div>
