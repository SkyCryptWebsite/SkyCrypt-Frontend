import { describe, expect, it, vi } from "vitest";
import { createSkinTexturesCache, type SkinTextures } from "./skin";

const textures = (uuid: string): SkinTextures => ({ skinUrl: `https://textures/${uuid}`, capeUrl: undefined });

describe("createSkinTexturesCache", () => {
  it("shares one request per UUID, whatever its dashes and case", async () => {
    const fetchTextures = vi.fn(async (uuid: string) => textures(uuid));
    const cached = createSkinTexturesCache(fetchTextures, 1000, 10);

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
    const cached = createSkinTexturesCache(fetchTextures, 1000, 10, () => time);

    await cached("a");
    time = 999;
    await cached("a");
    time = 1000;
    await cached("a");

    expect(fetchTextures).toHaveBeenCalledTimes(2);
  });

  it("doesn't keep a failure, so the next call retries", async () => {
    const fetchTextures = vi.fn().mockRejectedValueOnce(new Error("429")).mockResolvedValue(textures("a"));
    const cached = createSkinTexturesCache(fetchTextures, 1000, 10);

    await expect(cached("a")).rejects.toThrow("429");
    await expect(cached("a")).resolves.toEqual(textures("a"));
    expect(fetchTextures).toHaveBeenCalledTimes(2);
  });

  it("drops the oldest entry when full", async () => {
    const fetchTextures = vi.fn(async (uuid: string) => textures(uuid));
    const cached = createSkinTexturesCache(fetchTextures, 1000, 2);

    await cached("a");
    await cached("b");
    await cached("c");
    await cached("b");
    await cached("a");

    expect(fetchTextures.mock.calls.map(([uuid]) => uuid)).toEqual(["a", "b", "c", "a"]);
  });
});
