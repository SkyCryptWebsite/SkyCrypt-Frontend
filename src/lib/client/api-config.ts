import { PUBLIC_API_URL } from "$env/static/public";

/**
 * Get the API URL for client-side requests
 * Always uses localhost for browser accessibility
 */
export function getClientApiUrl(): string {
  return PUBLIC_API_URL;
}
