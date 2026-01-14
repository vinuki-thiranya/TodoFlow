

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { Resend } from "resend"
import { db } from "./db"
import * as schema from "./db/schema"

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY!)

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
    requireEmailVerification: process.env.NODE_ENV === 'production', // Enable for production
    sendResetPassword: async ({ user, url }) => {
      // Only send reset emails to your verified email in development
      if (process.env.NODE_ENV !== 'production' && user.email !== 'vtkatugampala@gmail.com') {
        console.log("🚧 DEV MODE: Skipping password reset email for", user.email)
        return
      }
      
      await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: [user.email],
        subject: "Reset your password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Reset your password</h2>
            <p>Hi ${user.name || 'there'},</p>
            <p>Click the link below to reset your password:</p>
            <a href="${url}" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, you can ignore this email.</p>
          </div>
        `,
      })
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log("Sending verification email to:", user.email)
      
      // For development: Only send real emails to your verified email, auto-verify others
      if (process.env.NODE_ENV !== 'production' && user.email !== 'vtkatugampala@gmail.com') {
        console.log("🚧 DEV MODE: Auto-verifying email for", user.email)
        console.log("🚧 DEV MODE: Resend free account can only send to vtkatugampala@gmail.com")
        
        // In development, just mark as verified without sending email
        console.log("✅ DEV MODE: Email marked as verified for", user.email)
        return // Skip email sending
      }
      
      console.log("📧 Sending real email to:", user.email)
      
      try {
        const { data, error } = await resend.emails.send({
          from: process.env.FROM_EMAIL!,
          to: [user.email],
          subject: "Verify your email address - TodoFlow",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #16a34a; font-size: 32px; margin-bottom: 10px;">TodoFlow</h1>
                <p style="color: #6b7280; font-size: 16px;">Task Management Made Simple</p>
              </div>
              
              <div style="background: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1f2937; margin-bottom: 15px;">Welcome to TodoFlow!</h2>
                <p style="color: #4b5563; margin-bottom: 20px;">Hi ${user.name || 'there'},</p>
                <p style="color: #4b5563; margin-bottom: 25px;">Thanks for signing up! Please verify your email address by clicking the button below:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${url}" style="background: #16a34a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">Verify Email Address</a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">This link will expire in 24 hours.</p>
              </div>
              
              <div style="text-align: center; color: #9ca3af; font-size: 12px;">
                <p>If you didn't create an account, you can safely ignore this email.</p>
                <p>If the button doesn't work, copy and paste this link: ${url}</p>
              </div>
            </div>
          `,
        })
        
        if (error) {
          console.error("Failed to send verification email:", error)
          throw error
        }
        
        console.log("✅ Verification email sent successfully:", data?.id)
      } catch (error) {
        console.error("❌ Email sending error:", error)
        throw error
      }
    },
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
