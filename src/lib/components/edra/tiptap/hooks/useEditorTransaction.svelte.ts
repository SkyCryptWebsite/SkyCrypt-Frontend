import { createSubscriber } from "svelte/reactivity";
import type { Editor } from "../Editor";

/**
 * Reactive transaction counter. Reading `version` inside a template expression or effect creates a dependency that
 * re-evaluates on every editor transaction.
 */
export function useEditorTransaction(editor: Editor) {
  let version = 0;

  const subscribe = createSubscriber((update) => {
    const handler = () => {
      version++;
      update();
    };
    editor.on("transaction", handler);
    return () => {
      editor.off("transaction", handler);
    };
  });

  return {
    get version() {
      subscribe();
      return version;
    }
  };
}
