<script lang="ts">
  import type { BubbleMenuPluginProps } from "@tiptap/extension-bubble-menu";
  import { BubbleMenuPlugin } from "@tiptap/extension-bubble-menu";
  import { untrack } from "svelte";
  import type { Snippet } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import type { Editor } from "../../Editor";
  interface Props {
    editor: Editor;
    pluginKey?: BubbleMenuPluginProps["pluginKey"];
    updateDelay?: BubbleMenuPluginProps["updateDelay"];
    resizeDelay?: BubbleMenuPluginProps["resizeDelay"];
    options?: BubbleMenuPluginProps["options"];
    appendTo?: BubbleMenuPluginProps["appendTo"];
    shouldShow?: BubbleMenuPluginProps["shouldShow"];
    getReferencedVirtualElement?: BubbleMenuPluginProps["getReferencedVirtualElement"];
    children: Snippet<[]>;
    class?: string;
    [key: string]: unknown;
  }

  let {
    editor,
    pluginKey = "bubbleMenu",
    updateDelay = undefined,
    resizeDelay = undefined,
    options = {},
    appendTo = undefined,
    shouldShow = null,
    getReferencedVirtualElement = undefined,
    children,
    class: className,
    ...rest
  }: Props = $props();

  const registerMenu: Attachment<HTMLDivElement> = (el) => {
    const current = editor;
    if (!current) return;

    untrack(() => {
      el.style.visibility = "hidden";
      el.style.position = "absolute";

      el.remove();

      current.registerPlugin(
        BubbleMenuPlugin({
          editor: current,
          element: el,
          options,
          pluginKey,
          resizeDelay,
          appendTo,
          shouldShow,
          getReferencedVirtualElement,
          updateDelay
        })
      );
    });

    return () => {
      try {
        current.unregisterPlugin(pluginKey);
      } catch {
        // editor may already be destroyed during navigation
      }
    };
  };
</script>

<div {@attach registerMenu} class={className} {...rest}>
  {@render children()}
</div>
