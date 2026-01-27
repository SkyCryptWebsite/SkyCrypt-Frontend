import { prerender, query } from "$app/server";
import { getApiAccessoriesUuidProfileId, getApiBestiaryUuidProfileId, getApiCollectionsUuidProfileId, getApiCrimsonIsleUuidProfileId, getApiDungeonsUuidProfileId, getApiEmbedUuid, getApiGardenProfileId, getApiGearUuidProfileId, getApiInventoryUuidProfileIdInventoryId, getApiMinionsUuidProfileId, getApiMiscUuidProfileId, getApiNetworthUuidProfileId, getApiPetsUuidProfileId, getApiPlayerStatsUuidProfileId, getApiResourcepacks, getApiRiftUuidProfileId, getApiSkillsUuidProfileId, getApiSlayerUuidProfileId, getApiStatsUuidProfileId, getApiUsernameUuid, getApiUuidUsername, type ModelsProcessingError } from "$lib/shared/api/orval-generated";
import { GetApiAccessoriesUuidProfileIdParams, GetApiBestiaryUuidProfileIdParams, GetApiCollectionsUuidProfileIdParams, GetApiCrimsonIsleUuidProfileIdParams, GetApiDungeonsUuidProfileIdParams, GetApiEmbedUuidParams, GetApiEmbedUuidQueryParams, GetApiGardenProfileIdParams, GetApiGearUuidProfileIdParams, GetApiInventoryUuidProfileIdInventoryIdParams, GetApiInventoryUuidProfileIdInventoryIdQueryParams, GetApiMinionsUuidProfileIdParams, GetApiMiscUuidProfileIdParams, GetApiNetworthUuidProfileIdParams, GetApiPetsUuidProfileIdParams, GetApiPlayerStatsUuidProfileIdParams, GetApiRiftUuidProfileIdParams, GetApiSkillsUuidProfileIdParams, GetApiSlayerUuidProfileIdParams, GetApiStatsUuidProfileIdParams, GetApiUsernameUuidParams, GetApiUuidUsernameParams } from "$lib/shared/api/orval-generated-zod";
import { APIEndpointName } from "$types";
import { error, isHttpError, redirect } from "@sveltejs/kit";
import z from "zod";

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
export const getProfileStats = query(GetApiStatsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.PROFILE, () => getApiStatsUuidProfileId(uuid, profileId));
});

/** Fetch additional stats data for a specific profile */
export const getAdditionalStats = query(GetApiPlayerStatsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.STATS, () => getApiPlayerStatsUuidProfileId(uuid, profileId));
});

/** Fetch networth data for a specific profile */
export const getNetworth = query(GetApiNetworthUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.NETWORTH, () => getApiNetworthUuidProfileId(uuid, profileId));
});

/** Fetch gear section data (armor, equipment) for a specific profile */
export const getGearSection = query(GetApiGearUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.GEAR, () => getApiGearUuidProfileId(uuid, profileId));
});

/** Fetch accessories section data (talismans, enrichments) for a specific profile */
export const getAccessoriesSection = query(GetApiAccessoriesUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.ACCESSORIES, () => getApiAccessoriesUuidProfileId(uuid, profileId));
});

/** Fetch pets section data for a specific profile */
export const getPetsSection = query(GetApiPetsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.PETS, () => getApiPetsUuidProfileId(uuid, profileId));
});

/** Fetch inventory data for a specific profile and inventory type */
export const getInventorySection = query(z.object({ ...GetApiInventoryUuidProfileIdInventoryIdParams.shape, ...GetApiInventoryUuidProfileIdInventoryIdQueryParams.shape }), async ({ uuid, profileId, inventoryId, search }) => {
  return fetchSection(APIEndpointName.INVENTORY, () => getApiInventoryUuidProfileIdInventoryId(uuid, profileId, inventoryId, { search }));
});

/** Fetch inventory data for a specific profile and inventory type */
export const searchInventorySection = getInventorySection;

/** Fetch skills section data (mining, farming, combat, etc.) for a specific profile */
export const getSkillsSection = query(GetApiSkillsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.SKILLS, () => getApiSkillsUuidProfileId(uuid, profileId));
});

/** Fetch garden data for a specific profile */
export const getGarden = query(GetApiGardenProfileIdParams, async ({ profileId }) => {
  return fetchSection(APIEndpointName.GARDEN, () => getApiGardenProfileId(profileId));
});

/** Fetch dungeons section data (catacombs, master mode) for a specific profile */
export const getDungeonsSection = query(GetApiDungeonsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.DUNGEONS, () => getApiDungeonsUuidProfileId(uuid, profileId));
});

/** Fetch slayer section data (zombie, spider, wolf, etc.) for a specific profile */
export const getSlayerSection = query(GetApiSlayerUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.SLAYER, () => getApiSlayerUuidProfileId(uuid, profileId));
});

/** Fetch minions section data for a specific profile */
export const getMinionsSection = query(GetApiMinionsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.MINIONS, () => getApiMinionsUuidProfileId(uuid, profileId));
});

/** Fetch bestiary section data for a specific profile */
export const getBestiarySection = query(GetApiBestiaryUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.BESTIARY, () => getApiBestiaryUuidProfileId(uuid, profileId));
});

/** Fetch collections section data for a specific profile */
export const getCollectionsSection = query(GetApiCollectionsUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.COLLECTIONS, () => getApiCollectionsUuidProfileId(uuid, profileId));
});

/** Fetch crimson isle section data for a specific profile */
export const getCrimsonIsleSection = query(GetApiCrimsonIsleUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.CRIMSON_ISLE, () => getApiCrimsonIsleUuidProfileId(uuid, profileId));
});

/** Fetch rift section data for a specific profile */
export const getRiftSection = query(GetApiRiftUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.RIFT, () => getApiRiftUuidProfileId(uuid, profileId));
});

/** Fetch misc section data for a specific profile */
export const getMiscSection = query(GetApiMiscUuidProfileIdParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.MISC, () => getApiMiscUuidProfileId(uuid, profileId));
});

/** Fetch embed data */
export const getEmbedData = query(z.object({ ...GetApiEmbedUuidParams.shape, ...GetApiEmbedUuidQueryParams.shape }), async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.EMBED, () => getApiEmbedUuid(uuid, { profileId: profileId }));
});

/** Search user */
export const searchUser = query(GetApiUuidUsernameParams, async ({ username }) => {
  const response = await fetchSection(APIEndpointName.SEARCH, () => getApiUuidUsername(username));
  if (response.uuid && response.username) {
    redirect(303, `/stats/${response.username}`);
  }
  error(404, `No user with the name '${username}' was found`);
});

/** Fetch embed data */
export const getUsername = query(GetApiUsernameUuidParams, async ({ uuid }) => {
  return fetchSection(APIEndpointName.USERNAME, () => getApiUsernameUuid(uuid));
});

export const getUsernamePrerendered = prerender(GetApiUsernameUuidParams, async ({ uuid }) => {
  return fetchSection(APIEndpointName.USERNAME, () => getApiUsernameUuid(uuid));
});

/** Fetch packs */
export const getPacks = prerender(async () => {
  return fetchSection(APIEndpointName.RESOURCEPACK, () => getApiResourcepacks());
});
