import { prerender, query } from "$app/server";
import { getApiAccessoriesUuidProfileId, getApiBestiaryUuidProfileId, getApiCollectionsUuidProfileId, getApiCrimsonIsleUuidProfileId, getApiDungeonsUuidProfileId, getApiGardenProfileId, getApiGearUuidProfileId, getApiInventoryUuidProfileIdInventoryId, getApiInventoryUuidProfileIdSearchSearch, getApiMinionsUuidProfileId, getApiMiscUuidProfileId, getApiNetworthUuidProfileId, getApiPetsUuidProfileId, getApiPlayerStatsUuidProfileId, getApiResourcepacks, getApiRiftUuidProfileId, getApiSkillsUuidProfileId, getApiSlayerUuidProfileId, getApiStatsUuidProfileId, type ModelsProcessingError } from "$lib/shared/api/orval-generated";
import { getApiAccessoriesUuidProfileIdParams, getApiBestiaryUuidProfileIdParams, getApiCollectionsUuidProfileIdParams, getApiCrimsonIsleUuidProfileIdParams, getApiDungeonsUuidProfileIdParams, getApiGardenProfileIdParams, getApiGearUuidProfileIdParams, getApiInventoryUuidProfileIdInventoryIdParams, getApiInventoryUuidProfileIdSearchSearchParams, getApiMinionsUuidProfileIdParams, getApiMiscUuidProfileIdParams, getApiNetworthUuidProfileIdParams, getApiPetsUuidProfileIdParams, getApiPlayerStatsUuidProfileIdParams, getApiRiftUuidProfileIdParams, getApiSkillsUuidProfileIdParams, getApiSlayerUuidProfileIdParams, getApiStatsUuidProfileIdParams } from "$lib/shared/api/orval-generated-zod";
import { error, isHttpError } from "@sveltejs/kit";

/**
 * Type helper to extract the success data type from an API response
 * Excludes ModelsProcessingError from the union type
 */
type ExtractSuccessData<TResponse> = TResponse extends { data: infer TData } ? Exclude<TData, ModelsProcessingError> : never;

/**
 * Generic helper function to handle API fetching with consistent error handling
 * Reduces boilerplate for API section fetching
 * Automatically infers the return type from the API response, excluding error types
 *
 * @param sectionName - Name of the section being fetched (used for logging)
 * @param apiFetcher - Function that calls the API endpoint
 * @returns The success data type, excluding ModelsProcessingError
 * @throws SvelteKit error if the API returns an error or the request fails
 */
async function fetchSection<TResponse extends { data: unknown; status: number }>(sectionName: string, apiFetcher: () => Promise<TResponse>): Promise<ExtractSuccessData<TResponse>> {
  try {
    const { data, status } = await apiFetcher();
    // Check if the API returned a processing error
    if (typeof data === "object" && data !== null && "error" in data && data.error) {
      console.error(`API returned an error for ${sectionName}:`, data);
      error(status, data.error as string);
    }
    return data as ExtractSuccessData<TResponse>;
  } catch (err) {
    if (isHttpError(err)) {
      console.error(`HTTP error fetching ${sectionName} section data:`, err);
      error(err.status, err.body);
    }
    console.error(`Error fetching ${sectionName} section data:`, err);
    error(500, `Failed to fetch ${sectionName} section data`);
  }
}

/** Fetch player stats for a specific profile */
export const getProfileStats = query(getApiStatsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection("stats", () => getApiStatsUuidProfileId(uuid, profileId));
});

/** Fetch additional stats data for a specific profile */
export const getAdditionalStats = query(getApiPlayerStatsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection("additional stats", () => getApiPlayerStatsUuidProfileId(uuid, profileId));
});

/** Fetch networth data for a specific profile */
export const getNetworth = query(getApiNetworthUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection("networth", () => getApiNetworthUuidProfileId(uuid, profileId));
});

/** Fetch gear section data (armor, equipment) for a specific profile */
export const getGearSection = query(getApiGearUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection("gear", () => getApiGearUuidProfileId(uuid, profileId));
});

/** Fetch accessories section data (talismans, enrichments) for a specific profile */
export const getAccessoriesSection = query(getApiAccessoriesUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection("accessories", () => getApiAccessoriesUuidProfileId(uuid, profileId));
});

/** Fetch pets section data for a specific profile */
export const getPetsSection = query(getApiPetsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection("pets", () => getApiPetsUuidProfileId(uuid, profileId));
});

/** Fetch inventory data for a specific profile and inventory type */
export const getInventorySection = query(getApiInventoryUuidProfileIdInventoryIdParams, async ({ uuid, profileId, inventoryId }) => {
  return fetchSection("inventory", () => getApiInventoryUuidProfileIdInventoryId(uuid, profileId, inventoryId));
});

/** Fetch inventory data for a specific profile and inventory type */
export const searchInventorySection = query(getApiInventoryUuidProfileIdSearchSearchParams, async ({ uuid, profileId, search }) => {
  return fetchSection("inventory", () => getApiInventoryUuidProfileIdSearchSearch(uuid, profileId, search));
});

/** Fetch skills section data (mining, farming, combat, etc.) for a specific profile */
export const getSkillsSection = query(getApiSkillsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection("skills", () => getApiSkillsUuidProfileId(uuid, profileId));
});

/** Fetch garden data for a specific profile */
export const getGarden = query(getApiGardenProfileIdParams, async ({ profileId }) => {
  return fetchSection("garden", () => getApiGardenProfileId(profileId));
});

/** Fetch dungeons section data (catacombs, master mode) for a specific profile */
export const getDungeonsSection = query(getApiDungeonsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection("dungeons", () => getApiDungeonsUuidProfileId(uuid, profileId));
});

/** Fetch slayer section data (zombie, spider, wolf, etc.) for a specific profile */
export const getSlayerSection = query(getApiSlayerUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection("slayer", () => getApiSlayerUuidProfileId(uuid, profileId));
});

/** Fetch minions section data for a specific profile */
export const getMinionsSection = query(getApiMinionsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection("minions", () => getApiMinionsUuidProfileId(uuid, profileId));
});

/** Fetch bestiary section data for a specific profile */
export const getBestiarySection = query(getApiBestiaryUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection("bestiary", () => getApiBestiaryUuidProfileId(uuid, profileId));
});

/** Fetch collections section data for a specific profile */
export const getCollectionsSection = query(getApiCollectionsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection("collections", () => getApiCollectionsUuidProfileId(uuid, profileId));
});

/** Fetch crimson isle section data for a specific profile */
export const getCrimsonIsleSection = query(getApiCrimsonIsleUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection("crimson isle", () => getApiCrimsonIsleUuidProfileId(uuid, profileId));
});

/** Fetch rift section data for a specific profile */
export const getRiftSection = query(getApiRiftUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection("rift", () => getApiRiftUuidProfileId(uuid, profileId));
});

/** Fetch misc section data for a specific profile */
export const getMiscSection = query(getApiMiscUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection("misc", () => getApiMiscUuidProfileId(uuid, profileId));
});

/** Fetch packs */
export const getPacks = prerender(async () => {
  return fetchSection("resource packs", () => getApiResourcepacks());
});
