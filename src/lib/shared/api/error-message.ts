import type { APIError } from "#lib/shared/api/orval-generated";

// The backend's detail text is an internal error chain, so users see a message picked by code instead.
const messages: Record<string, string> = {
  PLAYER_NOT_FOUND: "No Minecraft player has that name or UUID.",
  PROFILE_NOT_FOUND: "This player has no SkyBlock profile by that name.",
  GARDEN_NOT_FOUND: "This profile has no Garden.",
  NOT_CACHED: "SkyCrypt hasn't loaded this player yet.",
  INVALID_REQUEST: "That isn't a valid username or UUID.",
  RATE_LIMITED: "Too many requests. Try again in a minute.",
  UPSTREAM_ERROR: "Hypixel or Mojang sent an error. Try again in a minute.",
  UPSTREAM_TIMEOUT: "Hypixel or Mojang took too long to answer. Try again in a minute.",
  PRICES_UNAVAILABLE: "Item prices are still loading. Try again in a minute."
};

/** The message to show users for a failed backend request. */
export function apiErrorMessage(problem: APIError | undefined): string {
  return messages[problem?.code ?? ""] ?? "Something went wrong on our end. Try again later.";
}
