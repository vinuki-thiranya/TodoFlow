

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"
import * as schema from "./db/schema"

// Configure authentication using Better Auth
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      
      verification: schema.verifications,
    },
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  // User model configuration
  user: {
    additionalFields: {
      userRole: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
    },
  },

  // Trusted origins for authentication cookies / redirects
  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://172.18.32.1:3000",
  ],
})

// TypeScript type for the current session
export type Session = typeof auth.$Infer.Session
