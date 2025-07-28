import { error } from "@sveltejs/kit";

export function SkyCryptError(message: string): never {
  error(500, {
    message,
    // @ts-expect-error You can add extra properties to the error object if needed. https://svelte.dev/docs/kit/errors#Expected-errors
    type: "SkyCryptError"
  });
}
