import { dev } from "$app/environment";
import { env } from "$env/dynamic/public";
import * as Sentry from "@sentry/sveltekit";
import { consoleLoggingIntegration, contextLinesIntegration, extraErrorDataIntegration } from "@sentry/sveltekit";

const { PUBLIC_SENTRY_DSN } = env;

Sentry.init({
  dsn: PUBLIC_SENTRY_DSN,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: 0.5,

  integrations: [contextLinesIntegration(), extraErrorDataIntegration(), consoleLoggingIntegration()],

  // Disable Sentry during development
  enabled: !dev,
  environment: dev ? "development" : "production"
});
