import { describe, expect, it } from "vitest";
import { apiErrorMessage } from "./error-message";

describe("apiErrorMessage", () => {
  it("never shows the backend's internal detail", () => {
    const detail = "failed to load data: failed to load profile: profile not found: no profiles found";
    expect(apiErrorMessage({ code: "PROFILE_NOT_FOUND", detail })).not.toContain("failed");
    expect(apiErrorMessage({ code: "INTERNAL_ERROR", detail })).not.toContain("failed");
    expect(apiErrorMessage(undefined)).not.toBe("");
  });
});
