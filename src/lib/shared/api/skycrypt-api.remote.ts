import { prerender, query } from "$app/server";
import { APIEndpointName } from "$types";
import { error, isHttpError } from "@sveltejs/kit";
import { log } from "evlog";
import { z } from "zod";
import { apiErrorMessage } from "#lib/shared/api/error-message";
import {
  getCombinedProfileStats as getCombinedProfileStatsRequest,
  getGardenStats as getGardenStatsRequest,
  getPlayerStats as getPlayerStatsRequest,
  getProfileEmbed as getProfileEmbedRequest,
  getProfileInventory as getProfileInventoryRequest,
  getProfileNetworth as getProfileNetworthRequest,
  getProfileStats as getProfileStatsRequest,
  getSelectedProfileEmbed as getSelectedProfileEmbedRequest,
  getSelectedProfileStats as getSelectedProfileStatsRequest,
  getSourceInfo as getSourceInfoRequest,
  listEnchantments as listEnchantmentsRequest,
  listResourcePacks as listResourcePacksRequest,
  resolveUsernameByUuid as resolveUsernameByUuidRequest,
  resolveUuidByUsername as resolveUuidByUsernameRequest,
  searchProfileInventory as searchProfileInventoryRequest,
  getStatsConstants as getStatsConstantsRequest,
  type APIError,
  type SourceInfo
} from "#lib/shared/api/orval-generated";
import {
  GetCombinedProfileStatsParams,
  GetGardenStatsParams,
  GetPlayerStatsParams,
  GetProfileEmbedParams,
  GetProfileInventoryParams,
  GetProfileNetworthParams,
  GetProfileStatsParams,
  GetSelectedProfileEmbedParams,
  GetSelectedProfileStatsParams,
  ResolveUsernameByUuidParams,
  ResolveUuidByUsernameParams,
  SearchProfileInventoryParams
} from "#lib/shared/api/orval-generated-zod";

/** The body of a response's successful (200) case. */
type ExtractSuccessData<TResponse> = Extract<TResponse, { status: 200 }> extends { data: infer TData } ? TData : never;

/**
 * Generic helper function to handle API fetching with consistent error handling Reduces boilerplate for API section
 * fetching Automatically infers the return type from the API response, excluding error types
 *
 * @param sectionName - Name of the section being fetched (used for logging)
 * @param apiFetcher - Function that calls the API endpoint
 * @returns The body of the successful response
 * @throws SvelteKit error if the API returns an error or the request fails
 */
async function fetchSection<TResponse extends { data: unknown; status: number }>(
  sectionName: APIEndpointName,
  apiFetcher: () => Promise<TResponse>
): Promise<ExtractSuccessData<TResponse>> {
  try {
    const { data, status } = await apiFetcher();
    if (status >= 400) {
      // Errors are RFC 9457 problem details; code (NOT_CACHED, PLAYER_NOT_FOUND, ...) says which.
      const problem = typeof data === "object" && data !== null ? (data as APIError) : undefined;
      log.error({
        action: "skycrypt_api.fetch_section",
        section: sectionName,
        status,
        code: problem?.code,
        detail: problem?.detail ?? data
      });
      error(status, apiErrorMessage(problem));
    }
    return data as ExtractSuccessData<TResponse>;
  } catch (err) {
    if (isHttpError(err)) throw err;
    log.error({ action: "skycrypt_api.fetch_section_failed", section: sectionName, error: err });
    error(500, `Failed to fetch ${sectionName} section data`);
  }
}

/** Fetch player stats for a specific profile */
export const getProfileStats = query(GetProfileStatsParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.PROFILE, () => getProfileStatsRequest(uuid, profileId));
});

/** Fetch player stats for the selected profile */
export const getSelectedProfileStats = query(GetSelectedProfileStatsParams, async ({ uuid }) => {
  return fetchSection(APIEndpointName.PROFILE, () => getSelectedProfileStatsRequest(uuid));
});

/** Fetch combined section data for a specific profile */
export const getCombinedProfileStats = query(GetCombinedProfileStatsParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.COMBINED, () => getCombinedProfileStatsRequest(uuid, profileId));
});

/** Fetch additional stats data for a specific profile */
export const getPlayerStats = query(GetPlayerStatsParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.STATS, () => getPlayerStatsRequest(uuid, profileId));
});

/** Fetch networth data for a specific profile */
export const getProfileNetworth = query(GetProfileNetworthParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.NETWORTH, () => getProfileNetworthRequest(uuid, profileId));
});

/** Fetch all inventory tabs for a specific profile */
export const getProfileInventory = query(GetProfileInventoryParams, async ({ uuid, profileId }) => {
  return (await fetchSection(APIEndpointName.INVENTORY, () => getProfileInventoryRequest(uuid, profileId))) ?? [];
});

/** Search all inventories for matching items */
export const searchProfileInventory = query(SearchProfileInventoryParams, async ({ uuid, profileId, searchParam }) => {
  return (
    (await fetchSection(APIEndpointName.INVENTORY, () =>
      searchProfileInventoryRequest(uuid, profileId, searchParam)
    )) ?? []
  );
});

/** Fetch garden data for a specific profile */
export const getGardenStats = query(GetGardenStatsParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.GARDEN, async () => {
    const response = await getGardenStatsRequest(uuid, profileId);
    // A profile without a garden isn't an error; the section shows it as locked.
    if (response.status === 404 && response.data.code === "GARDEN_NOT_FOUND")
      return { data: null, status: 200 as const };
    return response;
  });
});

/** Fetch embed data for a specific profile */
export const getProfileEmbed = query(GetProfileEmbedParams, async ({ uuid, profileId }) => {
  return fetchSection(APIEndpointName.EMBED, () => getProfileEmbedRequest(uuid, profileId));
});

/** Fetch embed data for the selected profile */
export const getSelectedProfileEmbed = query(GetSelectedProfileEmbedParams, async ({ uuid }) => {
  return fetchSection(APIEndpointName.EMBED, () => getSelectedProfileEmbedRequest(uuid));
});

/** Resolve a username to a UUID */
export const resolveUuidByUsername = query(ResolveUuidByUsernameParams, async ({ username }) => {
  return fetchSection(APIEndpointName.SEARCH, () => resolveUuidByUsernameRequest(username));
});

/** Resolve a UUID to a username */
export const resolveUsernameByUuid = prerender(
  ResolveUsernameByUuidParams.extend({ version: z.string() }),
  async ({ uuid }) => fetchSection(APIEndpointName.USERNAME, () => resolveUsernameByUuidRequest(uuid)),
  { dynamic: true }
);

/** Give each build its own static catalog URL without changing the app's commit version. */
export const listResourcePacks = prerender(
  z.string(),
  async (_version) => fetchSection(APIEndpointName.RESOURCEPACK, () => listResourcePacksRequest()),
  { dynamic: true, inputs: () => [__PRERENDER_VERSION__] }
);

/** Fetch stats list */
export const getAllStats = prerender(
  z.string(),
  async (_version) => (await fetchSection(APIEndpointName.STATS, () => getStatsConstantsRequest())) ?? [],
  { dynamic: true, inputs: () => [__PRERENDER_VERSION__] }
);

/** Fetch max-level enchantment lore strings */
export const listEnchantments = prerender(
  z.string(),
  async (_version) => (await fetchSection(APIEndpointName.ENCHANTMENTS, () => listEnchantmentsRequest())) ?? [],
  { dynamic: true, inputs: () => [__PRERENDER_VERSION__] }
);

/** Fetch the source information for the currently running backend service. */
export const getSourceInfo = query(async (): Promise<SourceInfo | null> => {
  try {
    const response = await getSourceInfoRequest({ cache: "no-store" });
    return response.status === 200 ? response.data : null;
  } catch (error) {
    log.warn({ action: "skycrypt_api.get_source_info", error });
    return null;
  }
});
