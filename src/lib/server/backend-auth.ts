import { createHash, timingSafeEqual } from "node:crypto";
import { SERVER_API_TOKEN } from "$app/env/private";
import { error } from "@sveltejs/kit";

/**
 * Guards the internal routes the Go backend calls. They aren't routed through nginx, but the shared token keeps them
 * closed even if a proxy rule ever exposes `/api/internal`.
 */
export function requireBackendToken(request: Request) {
  const provided = request.headers.get("x-api-token") ?? "";
  // The Go backend trims the token before sending it.
  const expected = SERVER_API_TOKEN?.trim();
  // Hashing both sides gives equal lengths, which timingSafeEqual requires.
  const digest = (value: string) => createHash("sha256").update(value).digest();
  if (!expected || !timingSafeEqual(digest(provided), digest(expected))) {
    error(401, "Unauthorized");
  }
}
