import { createSubscriber } from "svelte/reactivity";
import type { Editor } from "../Editor";

export type EditorStateSnapshot = {
  editor: Editor;
};

const shallowEqual = (a: Record<string, unknown>, b: Record<string, unknown>) => {
  const aKeys = Object.keys(a);

  if (aKeys.length !== Object.keys(b).length) {
    return false;
  }

  for (const key of aKeys) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
};

export const useEditorState = <T extends Record<string, unknown>>({
  editor,
  selector
}: {
  editor: Editor;
  selector: (ctx: EditorStateSnapshot) => T;
}): { readonly current: T } => {
  let current = selector({ editor });

  const subscribe = createSubscriber((update) => {
    const handleTransaction = () => {
      if (!shallowEqual(current, selector({ editor }))) update();
    };
    editor.on("transaction", handleTransaction);
    return () => {
      editor.off("transaction", handleTransaction);
    };
  });

  return {
    get current() {
      subscribe();
      // Read fresh so callers outside an effect (event handlers) never see a stale snapshot.
      const next = selector({ editor });
      if (!shallowEqual(current, next)) current = next;
      return current;
    }
  };
};
