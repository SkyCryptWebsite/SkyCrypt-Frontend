<script lang="ts">
  import type { LexicalNode } from "$types";
  import type { Component } from "svelte";
  import Blockquote from "./elements/Blockquote.svelte";
  import Heading from "./elements/Heading.svelte";
  import Link from "./elements/Link.svelte";
  import List from "./elements/List.svelte";
  import ListItem from "./elements/ListItem.svelte";
  import Paragraph from "./elements/Paragraph.svelte";
  import Relationship from "./elements/Relationship.svelte";
  import Upload from "./elements/Upload.svelte";
  import Self from "./LexicalRenderer.svelte";
  import TextRenderer from "./TextRenderer.svelte";

  const { nodes }: { nodes: LexicalNode[] } = $props();

  // Registry: Lexical node type -> element component. Each element renders its own
  // children by recursing back into this renderer, mirroring the EliteFarmers pattern.
  const registry: Record<string, Component<{ node: LexicalNode }>> = {
    paragraph: Paragraph,
    heading: Heading,
    list: List,
    listitem: ListItem,
    quote: Blockquote,
    link: Link,
    upload: Upload,
    relationship: Relationship,
    text: TextRenderer
  };
</script>

{#each nodes as node, i (i)}
  {#if node.type === "linebreak"}
    <br />
  {:else if node.type === "horizontalrule"}
    <hr class="my-6 border-background-grey" />
  {:else if registry[node.type]}
    {@const Element = registry[node.type]}
    <Element {node} />
  {:else if node.children}
    <Self nodes={node.children} />
  {/if}
{/each}
