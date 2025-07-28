import { generateToken } from "$lib/server/token";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, getClientAddress, route }) => {
  const body = await request.json();
  const { route: requestedRoute } = body;
  const ip = getClientAddress();
  const userAgent = request.headers.get("User-Agent");
  const routeId = route.id;

  if (!ip) {
    error(400, "IP address not found");
  }
  if (!userAgent) {
    error(400, "User-Agent header not found");
  }
  if (!requestedRoute) {
    error(400, "Route parameter required");
  }

  try {
    // Generate new token using the refreshToken function
    const newTokenData = generateToken(ip, userAgent, routeId);

    return json({
      success: true,
      ...newTokenData
    });
  } catch (err) {
    error(400, err instanceof Error ? err.message : "Failed to refresh token");
  }
};
