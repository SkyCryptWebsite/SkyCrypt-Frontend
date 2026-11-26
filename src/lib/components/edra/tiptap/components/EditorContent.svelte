<script lang="ts">
  import { untrack } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import type { Editor } from "../Editor";

  let { editor, class: className }: { editor: Editor | null; class: string } = $props();

  const mountEditor: Attachment<HTMLDivElement> = (rootEl) => {
    const current = editor;
    if (!current?.view.dom?.parentNode) return;
    // Already mounted — avoid re-appending / re-creating on every transaction
    if (rootEl.contains(current.view.dom)) return;

    untrack(() => {
      rootEl.append(...current.view.dom.parentNode!.childNodes);
      current.setOptions({ element: rootEl });
      current.createNodeViews();
    });
  };
</script>

<div {@attach mountEditor} class={className}></div>
