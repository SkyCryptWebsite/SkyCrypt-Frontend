import { describe, expect, it } from "vitest";
import { getBody } from "./response-body";

describe("getBody", () => {
  it("parses problem+json error bodies", async () => {
    const response = new Response('{"status":404,"code":"PROFILE_NOT_FOUND"}', {
      headers: { "content-type": "application/problem+json" }
    });
    expect(await getBody(response)).toEqual({ status: 404, code: "PROFILE_NOT_FOUND" });
  });

  it("returns other types as text", async () => {
    const response = new Response("Not Found", { headers: { "content-type": "text/plain; charset=utf-8" } });
    expect(await getBody(response)).toBe("Not Found");
  });
});
