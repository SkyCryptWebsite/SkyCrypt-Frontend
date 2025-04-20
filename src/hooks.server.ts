import { dev } from "$app/environment";
import { PUBLIC_SENTRY_DSN } from "$env/static/public";
import { init as resourcesInit } from "$lib/server/custom_resources";
import { indexCollectons } from "$lib/server/db/mongo/index-collections";
import { intializeNEURepository, parseNEURepository } from "$lib/server/helper/NotEnoughUpdates/parseNEURepository";
import { contextLinesIntegration, extraErrorDataIntegration, handleErrorWithSentry, sentryHandle, init as sentryInit } from "@sentry/sveltekit";
import type { ServerInit } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { getPrices } from "skyhelper-networth";
import { startMongo } from "./lib/server/db/mongo";
import { startRedis } from "./lib/server/db/redis";

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

export const init: ServerInit = async () => {
  console.log("[SkyCrypt] Starting...");
  const timeNow = performance.now();

  await intializeNEURepository().then(() => {
    parseNEURepository();
  });

  await resourcesInit();

  await startMongo().then(() => {
    console.log("[MONGO] MongoDB successfully connected");

    indexCollectons();
  });

  await startRedis().then(() => {
    console.log("[REDIS] Redis successfully connected");
  });

  await getPrices(true).then(() => {
    console.log("[NETWORTH] Prices successfully fetched!");
  });

  console.log(`[SkyCrypt] Started in ${(performance.now() - timeNow).toFixed(2)}ms`);
};
export const handleError = handleErrorWithSentry();
export const handle = sequence(sentryHandle());
