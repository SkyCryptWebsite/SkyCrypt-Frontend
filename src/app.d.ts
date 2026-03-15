// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  const __NPM_PACKAGE_VERSION__: string;

  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
    namespace Superforms {
      type Message = {
        type: "error" | "success";
        text: string;
      };
    }
  }
}

export {};
