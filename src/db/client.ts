import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "@/core/config";
import * as schema from "./schema";

declare global {
  var _pgPool: Pool | undefined;
}

const pool =
  globalThis._pgPool ||
  new Pool({
    connectionString: config.db.url,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis._pgPool = pool;
}

export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });
