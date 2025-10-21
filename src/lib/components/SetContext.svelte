<script lang="ts" generics="T">
  import type { Snippet } from "svelte";
  type Props = {
    data: T;
    setContextFn: (data: T) => void;
    children?: Snippet;
  };
  const { data, setContextFn, children }: Props = $props();

  setContextFn(data);
</script>

{@render children?.()}
