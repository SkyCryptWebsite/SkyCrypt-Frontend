<script lang="ts">
  type Props = {
    data: Record<string, unknown> | ReadonlyArray<Record<string, unknown>>;
  };

  const { data }: Props = $props();

  /**
   * Serialise JSON for embedding inside a `<script>` element.
   *
   * `JSON.stringify` does not escape `<`, `>` or `&`, so a string
   * containing the closing script sequence would close the tag and
   * allow arbitrary HTML/JS injection. Escaping these as unicode
   * escapes keeps the payload safely contained while still being
   * valid JSON for crawlers to parse.
   *
   * https://html.spec.whatwg.org/multipage/scripting.html#restrictions-for-contents-of-script-elements
   */
  function safeJsonLd(value: unknown): string {
    return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
  }

  const json = $derived(safeJsonLd(data));
</script>

<svelte:head>
  <!-- safe: `safeJsonLd` escapes <, > and & so user-controlled fields cannot break out of the script tag. -->
  <!-- The closing tag is split across the template literal so Svelte's parser doesn't treat it as the end of the surrounding script. -->
  {@html `<script type="application/ld+json">${json}<` + `/script>`}
</svelte:head>
