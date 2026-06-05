import type { Session, User } from "better-auth/minimal";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  const __NPM_PACKAGE_VERSION__: string;

  namespace App {
    // interface Error {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
    namespace Superforms {
      type Message = { type: "error" | "success"; text: string };
    }

    interface Locals {
      user?: User;
      session?: Session;
    }
  }
}

export {};
