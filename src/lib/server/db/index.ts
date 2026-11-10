import dc from "node:diagnostics_channel";
import { DATABASE_URL } from "$app/env/private";
import { drizzle } from "drizzle-orm/postgres-js";
import { log } from "evlog";
import postgres from "postgres";
import * as schema from "./schema";

if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");

const client = postgres(DATABASE_URL, { min: 1, idle_timeout: 60, queue_timeout: 10, query_timeout: 30 });

dc.subscribe("tracing:postgres:query:error", (message) => {
  const { error } = message as { error: { code?: string } };
  if (error.code === "QUEUE_TIMEOUT" || error.code === "QUERY_TIMEOUT") {
    log.warn({ action: "db.query_timeout", code: error.code, pool: client.stats, error });
  }
});

export const db = drizzle(client, { schema });
