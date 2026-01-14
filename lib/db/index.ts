import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL

if (!connectionString || connectionString.includes('your-vercel-postgres-url')) {
  console.warn("⚠️ Database connection string is missing or invalid. Using dummy connection for build time.")
}

// Disable prepared statements for edge runtime compatibility
const client = postgres(connectionString || "postgres://localhost/dummy", { prepare: false })
export const db = drizzle(client, { schema })