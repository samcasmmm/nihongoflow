import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function runMigrate() {
  console.log("Running migrations...");
  try {
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("Migrations applied successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigrate();
