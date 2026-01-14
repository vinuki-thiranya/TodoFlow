import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL

// Use a safe dummy URL for build time if no real connection string is available
const safeDatabaseUrl = connectionString && !connectionString.includes('your-vercel-postgres-url') 
  ? connectionString 
  : "postgresql://user:pass@localhost:5432/dummy"

// Disable prepared statements for edge runtime compatibility  
const client = postgres(safeDatabaseUrl, { prepare: false })
export const db = drizzle(client, { schema })