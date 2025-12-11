import { dev } from "$app/environment";
import { env } from "$env/dynamic/public";
import * as Sentry from "@sentry/sveltekit";
import { consoleLoggingIntegration, contextLinesIntegration, extraErrorDataIntegration } from "@sentry/sveltekit";

const { PUBLIC_SENTRY_DSN } = env;

Sentry.init({
  dsn: PUBLIC_SENTRY_DSN,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  tracesSampleRate: 0.3,
  integrations: [contextLinesIntegration(), extraErrorDataIntegration(), consoleLoggingIntegration()],

  // Disable Sentry during development
  enabled: !dev,
  environment: dev ? "development" : "production"
});
