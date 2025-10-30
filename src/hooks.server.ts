import * as Sentry from "@sentry/sveltekit";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const headersHandler = (async ({ event, resolve }) => {
  const response = await resolve(event);

  // Security headers
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "accelerometer=(), autoplay=(), camera=(), encrypted-media=(), fullscreen=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), sync-xhr=(), usb=(), xr-spatial-tracking=(), geolocation=()");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

  // Cross-Origin policies
  response.headers.set("Cross-Origin-Embedder-Policy", "unsafe-none");
  response.headers.set("Cross-Origin-Opener-Policy", "unsafe-none");
  response.headers.set("Cross-Origin-Resource-Policy", "cross-origin");

  // Legacy XSS protection
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}) satisfies Handle;

export const handleError = Sentry.handleErrorWithSentry();
export const handle = sequence(Sentry.sentryHandle(), headersHandler) satisfies Handle;
