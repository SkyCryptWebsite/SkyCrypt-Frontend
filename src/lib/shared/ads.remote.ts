import { getRequestEvent, query } from "$app/server";
import { getStoredPatreonMembership } from "#lib/server/patreon";
import { PatreonEntitlement } from "#lib/server/patreon-entitlements";

/** Donors who reached the first Patreon perk tier browse without ads. */
export const getAdFree = query(async () => {
  const { user } = getRequestEvent().locals;
  if (!user) return false;
  const membership = await getStoredPatreonMembership(user.id);
  return (membership?.entitlementLevel ?? PatreonEntitlement.None) > PatreonEntitlement.None;
});
