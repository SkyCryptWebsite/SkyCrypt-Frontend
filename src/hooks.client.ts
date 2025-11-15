import { dev } from "$app/environment";
import { env } from "$env/dynamic/public";
import * as Sentry from "@sentry/sveltekit";
import { browserTracingIntegration, consoleLoggingIntegration, contextLinesIntegration, extraErrorDataIntegration, httpClientIntegration } from "@sentry/sveltekit";

const { PUBLIC_SENTRY_DSN } = env;

Sentry.init({
  dsn: PUBLIC_SENTRY_DSN,
  tunnel: "/api/tunnel",

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable debug
  debug: true,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: 0.5,

  integrations: [browserTracingIntegration(), httpClientIntegration(), contextLinesIntegration(), extraErrorDataIntegration(), consoleLoggingIntegration()],

  enabled: !dev,
  environment: dev ? "development" : "production"
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = Sentry.handleErrorWithSentry();
