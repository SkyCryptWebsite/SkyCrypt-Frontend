import path from "node:path";
import { DATABASE_URL } from "$app/env/private";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { log } from "evlog";
import postgres from "postgres";

export async function runMigrations() {
  log.info("migrate", "Starting migrations...");

  const migrationsFolder = path.resolve(process.cwd(), "drizzle");

  log.info("migrate", `Migrations folder resolved to: ${migrationsFolder}`);

  // Own client without the app pool's query_timeout, so a long migration isn't cancelled.
  await using client = postgres(DATABASE_URL, { max: 1 });

  try {
    await migrate(drizzle(client), { migrationsFolder });
    log.info("migrate", "All migrations complete");
  } catch (error) {
    log.error({ action: "migrate.failed", error });
    throw error; // crash the process; never start with failed migration
  }
}
