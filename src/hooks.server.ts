import { dev } from "$app/environment";
import { env } from "$env/dynamic/public";
import { validateToken } from "$lib/server/token";
import { contextLinesIntegration, extraErrorDataIntegration, handleErrorWithSentry, sentryHandle, init as sentryInit } from "@sentry/sveltekit";
import { error, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const { PUBLIC_SENTRY_DSN } = env;

sentryInit({
  dsn: PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0,

  integrations: [contextLinesIntegration(), extraErrorDataIntegration()],

  // Disable Sentry during development
  enabled: !dev,
  environment: dev ? "development" : "production",

  beforeSend(event, hint) {
    const error = event.exception?.values?.[0];
    const status = (hint.originalException as { status?: number })?.status;

    if (error && typeof error === "object") {
      if (error.value?.includes("HttpError") || error.type === "SkyCryptError") {
        return null; // Return null to prevent the event from being sent to Sentry
      }
    }

    // Filter out 4xx client errors
    if (status && status >= 400 && status < 500) {
      return null; // Return null to prevent the event from being sent to Sentry
    }

    return event;
  }
});

export const handleError = handleErrorWithSentry();
export const handle = sequence(sentryHandle(), async ({ event, resolve }) => {
  checkRoutes(event);
  const response = await resolve(event);

  // Security headers
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "accelerometer=(), autoplay=(), camera=(), encrypted-media=(), fullscreen=(), gyroscope=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), sync-xhr=(), usb=(), xr-spatial-tracking=(), geolocation=()");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

  // Cross-Origin policies
  response.headers.set("Cross-Origin-Embedder-Policy", "unsafe-none");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "cross-origin");

  // Legacy XSS protection
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
});

function checkRoutes(event: Parameters<Handle>[0]["event"]) {
  // if (dev) return; // Skip route checks in development
  const routeId = event.route.id;
  if (!routeId) return;

  const isProtectedRoute = routeId.includes("(protected)");
  if (!isProtectedRoute) return;

  const ip = event.getClientAddress();
  const authHeader = event.request.headers.get("Authorization");
  const timestamp = event.request.headers.get("X-Timestamp");
  const userAgent = event.request.headers.get("User-Agent") || "";
  const route = event.request.headers.get("X-Route") || routeId;

  // Always perform validation to prevent timing attacks
  const token = authHeader?.replace(/^Bearer\s+/, "") || "invalid";
  const validToken = validateToken(ip, token, timestamp || "0", userAgent, route);

  // Check all conditions after validation
  if (!authHeader || !timestamp || !validToken) {
    error(401, "Unauthorized access to protected route");
  }
}
