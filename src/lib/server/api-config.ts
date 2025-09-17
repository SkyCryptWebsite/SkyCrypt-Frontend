import { PUBLIC_API_URL } from "$env/static/public";

/**
 * Get the API URL for server-side requests
 * Uses container hostname for internal Docker network communication,
 * falls back to public URL if not available
 */
export function getServerApiUrl(): string {
  return process.env.SERVER_API_URL || PUBLIC_API_URL;
}
