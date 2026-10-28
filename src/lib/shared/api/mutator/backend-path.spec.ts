import { isHttpError } from "@sveltejs/kit";
import { describe, expect, it } from "vitest";
import { toBackendPath } from "./backend-path";

const rejects = (path: string) => {
  try {
    toBackendPath(path);
  } catch (err) {
    return isHttpError(err) && err.status === 400;
  }
  return false;
};

describe("toBackendPath", () => {
  it("keeps normal paths", () => {
    expect(toBackendPath("/api/embed/TiltedHoney/Apple")).toBe("/api/embed/TiltedHoney/Apple");
  });

  it("refuses segments that URL parsing would normalize away", () => {
    for (const path of ["/api/embed/x/.", "/api/embed/x/..", "/api/embed/./x", "/api/embed/", "/api/stats//x"]) {
      expect(rejects(path), path).toBe(true);
    }
  });

  it("escapes URL syntax inside a param", () => {
    expect(toBackendPath("/api/stats/a?b=1#c")).toBe("/api/stats/a%3Fb%3D1%23c");
    expect(toBackendPath("/api/stats/a\\..\\x")).toBe("/api/stats/a%5C..%5Cx");
    expect(toBackendPath("/api/stats/%2e%2e")).toBe("/api/stats/%252e%252e");
    expect(new URL(`http://backend${toBackendPath("/api/stats/a\\..\\..\\x")}`).pathname).toBe(
      "/api/stats/a%5C..%5C..%5Cx"
    );
  });

  it("keeps the query string Orval appends", () => {
    const params = new URLSearchParams({ mode: "all", page: "2", limit: "50", q: "a b/c?d#e" });
    expect(toBackendPath(`/api/leaderboard/skyblock_level?${params}`)).toBe(
      `/api/leaderboard/skyblock_level?${params}`
    );
  });

  it("still escapes a query-like param that would change the route", () => {
    expect(toBackendPath("/api/stats/a?b=1/x")).toBe("/api/stats/a%3Fb%3D1/x");
    expect(toBackendPath("/api/stats/a?b=1&c=../x")).toBe("/api/stats/a%3Fb%3D1%26c%3D../x");
  });
});
