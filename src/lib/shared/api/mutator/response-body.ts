/** Reads a response body as JSON for any JSON type, including the backend's `application/problem+json` errors. */
export const getBody = <T>(c: Response | Request): Promise<T> => {
  const contentType = c.headers.get("content-type");

  if (contentType && contentType.includes("json")) {
    return c.json();
  }

  return c.text() as Promise<T>;
};
