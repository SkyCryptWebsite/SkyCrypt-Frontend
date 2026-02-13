<script lang="ts">
  import AdditionStat from "$lib/components/stats/AdditionStat.svelte";
  import { type SkycryptSrcModelsNetworthResult } from "$lib/shared/api/orval-generated";
  import { formatNumber } from "$lib/shared/helper";
  import { format as numberFormat } from "numerable";

  const defaultPattern: string = "0,0";

  type Props = {
    networth: SkycryptSrcModelsNetworthResult;
    title: string;
  };

  let { networth, title }: Props = $props();
</script>

<AdditionStat text={title} data={formatNumber(networth.networth ?? 0)} asterisk={true}>
  <div class="max-w-xs space-y-2 font-bold">
    <div>
      <h3 class="text-text/85">{title}</h3>
      <p class="font-medium text-text/80 italic">{title} calculations by SkyHelper.</p>
    </div>
    <div>
      <ul class="font-bold [&_li]:text-text/85 [&_li]:capitalize [&_li_span]:text-text [&_li_span]:normal-case">
        {#each Object.entries(networth.types ?? {}) as [key, value], index (index)}
          <li>
            {key.replace(/_/g, " ")}:
            <span>
              {formatNumber(value.total ?? 0)}
            </span>
          </li>
        {/each}
      </ul>
    </div>
    <p class="text-text/85">
      Unsoulbound {title}:
      <span class="text-text">
        {formatNumber(networth.unsoulboundNetworth ?? 0)}
      </span>
      <br />
      Total {title}:
      <span class="text-text">
        {numberFormat(networth.networth, defaultPattern)} ({formatNumber(networth.networth ?? 0)})
      </span>
    </p>
  </div>
</AdditionStat>
