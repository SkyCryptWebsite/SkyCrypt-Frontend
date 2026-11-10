import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveItemTexture } from "./resolve-item-texture";

describe("resolveItemTexture", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // Regression: one failed request cached the fallback for the rest of the session.
  it("retries after a failed resolve instead of caching the fallback", async () => {
    const fetch = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValue(new Response(JSON.stringify({ texture: "/resolved.png", texture_pack: "FURFSKY" })));
    vi.stubGlobal("fetch", fetch);

    const textureUrl = "/api/item/RETRY_TEST_ITEM";
    expect(await resolveItemTexture(textureUrl)).toEqual({ texture: textureUrl });
    expect(await resolveItemTexture(textureUrl)).toEqual({ texture: "/resolved.png", texture_pack: "FURFSKY" });
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
