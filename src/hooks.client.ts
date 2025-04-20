import { dev } from "$app/environment";
import { PUBLIC_SENTRY_DSN } from "$env/static/public";
import { browserTracingIntegration, contextLinesIntegration, extraErrorDataIntegration, handleErrorWithSentry, httpClientIntegration, init } from "@sentry/sveltekit";

init({
  dsn: PUBLIC_SENTRY_DSN,

  tunnel: "/api/tunnel",

  tracesSampleRate: 0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0,

  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 0,

  // Filter out specific errors before they are sent to Sentry
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
  },

  // If you don't want to use Session Replay, just remove the line below:
  integrations: [browserTracingIntegration(), httpClientIntegration(), contextLinesIntegration(), extraErrorDataIntegration()],

  enabled: !dev,
  environment: dev ? "development" : "production"
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
