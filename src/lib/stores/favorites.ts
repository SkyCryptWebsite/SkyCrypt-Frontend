import { browser } from "$app/environment";
import { persisted } from "svelte-persisted-store";

// First param `favorites` is the local storage key.
// Second param is the initial value.
export const favorites = persisted<{ uuid: string; ign: string; displayName?: string }[]>("favorites", []);

// Check if favorites is in old format (string[]) and remove it if so
if (browser) {
  favorites.subscribe((value) => {
    try {
      // Check if the value is an array of strings (old format) instead of objects with uuid/ign
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
        console.warn("Old favorites format detected! Removing to prevent crashes.");
        localStorage.removeItem("favorites");
        window.location.reload();
      }
    } catch (_e) {
      console.warn("Invalid favorites data detected! Removing to prevent crashes.");
      localStorage.removeItem("favorites");
      window.location.reload();
    }
  });
}
