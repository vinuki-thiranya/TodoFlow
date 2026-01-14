import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("Database connection string is required. Please set POSTGRES_URL or DATABASE_URL environment variable.")
}

// Disable prepared statements for edge runtime compatibility
const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client, { schema })