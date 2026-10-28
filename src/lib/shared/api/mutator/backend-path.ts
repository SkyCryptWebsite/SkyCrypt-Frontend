import { error } from "@sveltejs/kit";

/**
 * Orval interpolates path params unescaped, and they come straight from route params and public remote-function input.
 * `new URL` would collapse `.`/`..` segments (`/api/embed/x/..` becomes `/api/embed/`) and treat `?`, `#` and `\` as
 * syntax, letting anyone reach other backend routes with our server token. Encode every segment and refuse dot or empty
 * ones.
 */
export function toBackendPath(url: string): string {
  const { path, query } = splitQuery(url);
  const segments = path.split("/").slice(1);
  if (!path.startsWith("/") || segments.some((segment) => segment === "" || segment === "." || segment === "..")) {
    error(400, "Invalid player or profile");
  }
  return `/${segments.map(encodeURIComponent).join("/")}${query}`;
}

/**
 * Orval appends query params with URLSearchParams, whose output only has these characters. A `?` in a path param
 * followed by text that also looks like that still counts as a query, but it can only cut its own param short and add
 * query params to the same route; anything with `/`, `?` or `#` after it stays inside the path and gets encoded.
 */
const SEARCH_PARAMS = /^[\w.*%+-]+=[\w.*%+-]*(?:&[\w.*%+-]+=[\w.*%+-]*)*$/;

function splitQuery(url: string): { path: string; query: string } {
  const index = url.lastIndexOf("?");
  if (index === -1 || !SEARCH_PARAMS.test(url.slice(index + 1))) return { path: url, query: "" };
  return { path: url.slice(0, index), query: url.slice(index) };
}
