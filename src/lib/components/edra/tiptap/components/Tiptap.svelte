<script lang="ts">
  import { type Snippet } from "svelte";
  import type { Editor } from "../Editor";
  import { setEditor } from "./editorContext";

  let { editor, children }: { editor: Editor | undefined; children?: Snippet } = $props();

  // The editor is created once per mount, so children only ever need its first value.
  // svelte-ignore state_referenced_locally
  if (editor) {
    // svelte-ignore state_referenced_locally
    setEditor(editor);
  }
</script>

{#if editor && children}
  {@render children()}
{/if}
