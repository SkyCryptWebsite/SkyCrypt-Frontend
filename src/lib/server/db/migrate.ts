import { db } from "$src/lib/server/db";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import path from "node:path";
import { fileURLToPath } from "node:url";

export async function runMigrations() {
  console.info("[migrate] Starting migrations...");

  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const migrationsFolder = path.resolve(__dirname, "../../shared/drizzle");

  console.info(`[migrate] Migrations folder resolved to: ${migrationsFolder}`);

  try {
    await migrate(db, { migrationsFolder });
    console.info("[migrate] All migrations complete");
  } catch (error) {
    console.error("[migrate] Migration failed:", error);
    throw error; // crash the process; never start with failed migration
  }
}
