import { persisted } from "svelte-persisted-store";

// First param `recentSearches` is the local storage key.
// Second param is the initial value.
export const recentSearches = persisted<{ uuid?: string; ign: string }[]>("recentSearches", []);
