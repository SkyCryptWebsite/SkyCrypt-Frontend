import { getRequestEvent } from "$app/server";
import { env as envPrivate } from "$env/dynamic/private";
import { env as envPublic } from "$env/dynamic/public";

const { PUBLIC_SERVER_API_URL } = envPublic;
const { SERVER_API_TOKEN } = envPrivate;

// NOTE: Supports cases where `content-type` is other than `json`
const getBody = <T>(c: Response | Request): Promise<T> => {
  const contentType = c.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return c.json();
  }

  return c.text() as Promise<T>;
};

// NOTE: Update just base url
const getUrl = (contextUrl: string): string => {
  // Remove the trailing /api/ if present
  const baseUrl = PUBLIC_SERVER_API_URL.replace(/\/api\/?$/, "");
  const requestUrl = new URL(`${baseUrl}${contextUrl}`);

  return requestUrl.toString();
};

// NOTE: Add headers
const getHeaders = (headers?: HeadersInit): HeadersInit => {
  try {
    const { request } = getRequestEvent();
    return {
      ...headers,
      ...request.headers,
      "X-API-Token": SERVER_API_TOKEN
    };
  } catch {
    return {
      ...headers
    };
  }
};

export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
  let fetchFunction = fetch;
  try {
    const event = getRequestEvent();
    fetchFunction = event.fetch;
  } catch {
    // Ignore this, we just won't have access to the request for this call
  }

  const requestUrl = getUrl(url);
  const requestHeaders = getHeaders(options.headers);

  const requestInit: RequestInit = {
    ...options,
    headers: requestHeaders
  };

  const response = await fetchFunction(requestUrl, requestInit);
  const data = await getBody<T>(response);

  return { status: response.status, data, headers: response.headers } as T;
};
