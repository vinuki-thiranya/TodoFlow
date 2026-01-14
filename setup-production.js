#!/usr/bin/env node

/**
 * Production Database Setup Script for Neon
 * Run this after deploying to set up your production database
 */

const postgres = require('postgres')

// Get connection string from environment or command line
const connectionString = process.env.POSTGRES_URL || process.argv[2]

if (!connectionString) {
  console.error('❌ Please provide POSTGRES_URL environment variable or as command line argument')
  console.log('Usage: node setup-production.js "postgresql://user:pass@host/db"')
  process.exit(1)
}

const client = postgres(connectionString)

async function setupProduction() {
  try {
    console.log('🚀 Setting up production database...')
    
    // Test connection
    await client`SELECT 1 as test`
    console.log('✅ Database connection successful')
    
    // Create admin account for production
    const adminEmail = 'admin@todoflow.com'
    const managerEmail = 'manager@todoflow.com'
    
    // Remove existing default accounts if they exist
    await client`DELETE FROM users WHERE email IN (${adminEmail}, ${managerEmail})`
    
    console.log('🎯 Production database is ready!')
    console.log('')
    console.log('📧 You can now sign up with these emails and manually set roles:')
    console.log(`   • ${adminEmail}`)
    console.log(`   • ${managerEmail}`)
    console.log('')
    console.log('🔧 To set roles after signup:')
    console.log('   1. Use your database management tool (Neon dashboard)')
    console.log('   2. Update user_role column to "admin" or "manager"')
    console.log('   3. Or use Drizzle Studio: npx drizzle-kit studio')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    if (error.message.includes('connect')) {
      console.log('')
      console.log('💡 Troubleshooting:')
      console.log('   • Check your Neon database URL is correct')
      console.log('   • Ensure your Neon database is active')
      console.log('   • Verify network connectivity')
    }
  } finally {
    await client.end()
    process.exit(0)
  }
}

setupProduction()