

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"

// Configure authentication using Better Auth
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", 
  }),

  emailAndPassword: {
    enabled: true,
  },

  // User model configuration
  user: {
    
    additionalFields: {
      user_role: {
        type: "string",      
        required: false,     
        defaultValue: "user",
      },
    },
  },

  // Trusted origins for authentication cookies / redirects
  trustedOrigins:
    process.env.NODE_ENV === "production"
      ? ["https://your-app.vercel.app"]
      : ["http://localhost:3000"],      
})

// TypeScript type for the current session
export type Session = typeof auth.$Infer.Session
