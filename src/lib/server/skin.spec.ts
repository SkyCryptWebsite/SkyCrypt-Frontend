import { afterEach, describe, expect, it, vi } from "vitest";
import { createSkinTexturesCache, fetchSkinTextures, type SkinTextures } from "./skin";

const textures = (uuid: string): SkinTextures => ({ skinUrl: `https://textures/${uuid}`, capeUrl: undefined });

describe("createSkinTexturesCache", () => {
  it("shares one request per UUID, whatever its dashes and case", async () => {
    const fetchTextures = vi.fn(async (uuid: string) => textures(uuid));
    const cached = createSkinTexturesCache(fetchTextures, 1000, 100, 10);

    const [a, b] = await Promise.all([
      cached("069A79F4-44E9-4726-A5BE-FCA90E38AAF5"),
      cached("069a79f444e94726a5befca90e38aaf5")
    ]);

    expect(a).toBe(b);
    expect(fetchTextures).toHaveBeenCalledTimes(1);
    expect(fetchTextures).toHaveBeenCalledWith("069a79f444e94726a5befca90e38aaf5");
  });

  it("fetches again once the entry expires", async () => {
    let time = 0;
    const fetchTextures = vi.fn(async (uuid: string) => textures(uuid));
    const cached = createSkinTexturesCache(fetchTextures, 1000, 100, 10, () => time);

    await cached("a");
    time = 999;
    await cached("a");
    time = 1000;
    await cached("a");

    expect(fetchTextures).toHaveBeenCalledTimes(2);
  });

  it("keeps a failure only for the failure TTL, then retries", async () => {
    let time = 0;
    const fetchTextures = vi.fn().mockRejectedValueOnce(new Error("429")).mockResolvedValue(textures("a"));
    const cached = createSkinTexturesCache(fetchTextures, 1000, 100, 10, () => time);

    await expect(cached("a")).rejects.toThrow("429");
    time = 99;
    await expect(cached("a")).rejects.toThrow("429");
    time = 100;
    await expect(cached("a")).resolves.toEqual(textures("a"));
    expect(fetchTextures).toHaveBeenCalledTimes(2);
  });

  it("drops the oldest entry when full", async () => {
    const fetchTextures = vi.fn(async (uuid: string) => textures(uuid));
    const cached = createSkinTexturesCache(fetchTextures, 1000, 100, 2);

    await cached("a");
    await cached("b");
    await cached("c");
    await cached("b");
    await cached("a");

    expect(fetchTextures.mock.calls.map(([uuid]) => uuid)).toEqual(["a", "b", "c", "a"]);
  });
});

describe("fetchSkinTextures", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("asks Mojang once per 429 and backs off for a minute", async () => {
    let time = 0;
    const fetchMock = vi.fn(async () => new Response(null, { status: 429, headers: { "Retry-After": "1" } }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchSkinTextures("a", () => time)).rejects.toThrow("429");
    time = 59_999;
    await expect(fetchSkinTextures("b", () => time)).rejects.toThrow("rate limiting");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    time = 60_000;
    await expect(fetchSkinTextures("c", () => time)).rejects.toThrow("429");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
