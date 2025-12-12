import { prerender, query } from "$app/server";
import { getApiAccessoriesUuidProfileId, getApiBestiaryUuidProfileId, getApiCollectionsUuidProfileId, getApiCrimsonIsleUuidProfileId, getApiDungeonsUuidProfileId, getApiEmbedUuidProfileId, getApiGardenProfileId, getApiGearUuidProfileId, getApiInventoryUuidProfileIdInventoryId, getApiInventoryUuidProfileIdSearchSearch, getApiMinionsUuidProfileId, getApiMiscUuidProfileId, getApiNetworthUuidProfileId, getApiPetsUuidProfileId, getApiPlayerStatsUuidProfileId, getApiResourcepacks, getApiRiftUuidProfileId, getApiSkillsUuidProfileId, getApiSlayerUuidProfileId, getApiStatsUuidProfileId, getApiUsernameUuid, getApiUuidUsername, type ModelsProcessingError } from "$lib/shared/api/orval-generated";
import { getApiAccessoriesUuidProfileIdParams, getApiBestiaryUuidProfileIdParams, getApiCollectionsUuidProfileIdParams, getApiCrimsonIsleUuidProfileIdParams, getApiDungeonsUuidProfileIdParams, getApiEmbedUuidProfileIdParams, getApiGardenProfileIdParams, getApiGearUuidProfileIdParams, getApiInventoryUuidProfileIdInventoryIdParams, getApiInventoryUuidProfileIdSearchSearchParams, getApiMinionsUuidProfileIdParams, getApiMiscUuidProfileIdParams, getApiNetworthUuidProfileIdParams, getApiPetsUuidProfileIdParams, getApiPlayerStatsUuidProfileIdParams, getApiRiftUuidProfileIdParams, getApiSkillsUuidProfileIdParams, getApiSlayerUuidProfileIdParams, getApiStatsUuidProfileIdParams, getApiUsernameUuidParams, getApiUuidUsernameParams } from "$lib/shared/api/orval-generated-zod";
import { APIEndpointName } from "$types";
import { error, isHttpError, redirect } from "@sveltejs/kit";

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
async function fetchSection<TResponse extends { data: unknown; status: number }>(sectionName: APIEndpointName, apiFetcher: () => Promise<TResponse>): Promise<ExtractSuccessData<TResponse>> {
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
  return fetchSection(APIEndpointName.PROFILE, () => getApiStatsUuidProfileId(uuid, profileId));
});

/** Fetch additional stats data for a specific profile */
export const getAdditionalStats = query(getApiPlayerStatsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.STATS, () => getApiPlayerStatsUuidProfileId(uuid, profileId));
});

/** Fetch networth data for a specific profile */
export const getNetworth = query(getApiNetworthUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.NETWORTH, () => getApiNetworthUuidProfileId(uuid, profileId));
});

/** Fetch gear section data (armor, equipment) for a specific profile */
export const getGearSection = query(getApiGearUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.GEAR, () => getApiGearUuidProfileId(uuid, profileId));
});

/** Fetch accessories section data (talismans, enrichments) for a specific profile */
export const getAccessoriesSection = query(getApiAccessoriesUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.ACCESSORIES, () => getApiAccessoriesUuidProfileId(uuid, profileId));
});

/** Fetch pets section data for a specific profile */
export const getPetsSection = query(getApiPetsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.PETS, () => getApiPetsUuidProfileId(uuid, profileId));
});

/** Fetch inventory data for a specific profile and inventory type */
export const getInventorySection = query(getApiInventoryUuidProfileIdInventoryIdParams, async ({ uuid, profileId, inventoryId }) => {
  return fetchSection(APIEndpointName.INVENTORY, () => getApiInventoryUuidProfileIdInventoryId(uuid, profileId, inventoryId));
});

/** Fetch inventory data for a specific profile and inventory type */
export const searchInventorySection = query(getApiInventoryUuidProfileIdSearchSearchParams, async ({ uuid, profileId, search }) => {
  return fetchSection(APIEndpointName.INVENTORY, () => getApiInventoryUuidProfileIdSearchSearch(uuid, profileId, search));
});

/** Fetch skills section data (mining, farming, combat, etc.) for a specific profile */
export const getSkillsSection = query(getApiSkillsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.SKILLS, () => getApiSkillsUuidProfileId(uuid, profileId));
});

/** Fetch garden data for a specific profile */
export const getGarden = query(getApiGardenProfileIdParams, async ({ profileId }) => {
  return fetchSection(APIEndpointName.GARDEN, () => getApiGardenProfileId(profileId));
});

/** Fetch dungeons section data (catacombs, master mode) for a specific profile */
export const getDungeonsSection = query(getApiDungeonsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.DUNGEONS, () => getApiDungeonsUuidProfileId(uuid, profileId));
});

/** Fetch slayer section data (zombie, spider, wolf, etc.) for a specific profile */
export const getSlayerSection = query(getApiSlayerUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.SLAYER, () => getApiSlayerUuidProfileId(uuid, profileId));
});

/** Fetch minions section data for a specific profile */
export const getMinionsSection = query(getApiMinionsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.MINIONS, () => getApiMinionsUuidProfileId(uuid, profileId));
});

/** Fetch bestiary section data for a specific profile */
export const getBestiarySection = query(getApiBestiaryUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.BESTIARY, () => getApiBestiaryUuidProfileId(uuid, profileId));
});

/** Fetch collections section data for a specific profile */
export const getCollectionsSection = query(getApiCollectionsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.COLLECTIONS, () => getApiCollectionsUuidProfileId(uuid, profileId));
});

/** Fetch crimson isle section data for a specific profile */
export const getCrimsonIsleSection = query(getApiCrimsonIsleUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.CRIMSON_ISLE, () => getApiCrimsonIsleUuidProfileId(uuid, profileId));
});

/** Fetch rift section data for a specific profile */
export const getRiftSection = query(getApiRiftUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.RIFT, () => getApiRiftUuidProfileId(uuid, profileId));
});

/** Fetch misc section data for a specific profile */
export const getMiscSection = query(getApiMiscUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.MISC, () => getApiMiscUuidProfileId(uuid, profileId));
});

/** Fetch embed data */
export const getEmbedData = query(getApiEmbedUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.EMBED, () => getApiEmbedUuidProfileId(uuid, profileId));
});

/** Search user */
export const searchUser = query(getApiUuidUsernameParams, async ({ username }) => {
  const response = await fetchSection(APIEndpointName.SEARCH, () => getApiUuidUsername(username));
  if (response.uuid && response.username) {
    redirect(303, `/stats/${response.username}`);
  }
  error(404, `No user with the name '${username}' was found`);
});

/** Fetch embed data */
export const getUsername = query(getApiUsernameUuidParams, async ({ uuid }) => {
  return fetchSection(APIEndpointName.USERNAME, () => getApiUsernameUuid(uuid));
});

export const getUsernamePrerendered = prerender(getApiUsernameUuidParams, async ({ uuid }) => {
  return fetchSection(APIEndpointName.USERNAME, () => getApiUsernameUuid(uuid));
});

/** Fetch packs */
export const getPacks = prerender(async () => {
  return fetchSection(APIEndpointName.RESOURCEPACK, () => getApiResourcepacks());
});
