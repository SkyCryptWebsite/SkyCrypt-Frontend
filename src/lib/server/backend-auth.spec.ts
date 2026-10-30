import { describe, expect, it, vi } from "vitest";
import { requireBackendToken } from "./backend-auth";

vi.mock("$app/env/private", () => ({ SERVER_API_TOKEN: "secret-token\n" }));

const request = (token?: string) =>
  new Request("http://localhost/api/internal", { headers: token === undefined ? {} : { "x-api-token": token } });

describe("requireBackendToken", () => {
  it("accepts the trimmed token", () => {
    expect(() => requireBackendToken(request("secret-token"))).not.toThrow();
  });

  it.each([undefined, "", "secret-tokem", "secret", "secret-token-longer"])("rejects %j", (token) => {
    expect(() => requireBackendToken(request(token))).toThrow(expect.objectContaining({ status: 401 }));
  });
});
