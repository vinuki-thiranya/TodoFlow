const postgres = require('postgres')
const fs = require('fs')

// Read DATABASE_URL from .env or .env.local
let connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL

if (!connectionString) {
  // Try to read from .env file
  const envFiles = ['.env', '.env.local']
  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      const fileContent = fs.readFileSync(envFile, 'utf8')
      const match = fileContent.match(/POSTGRES_URL=["']?([^"'\n]+)["']?/)
      if (match) {
        connectionString = match[1].trim()
        break
      }
    }
  }
}

if (!connectionString) {
  console.error('❌ Database connection string not found. Please set POSTGRES_URL in .env')
  process.exit(1)
}

const client = postgres(connectionString)

async function setupDefaultAccounts() {
  try {
    console.log('🔄 Cleaning up any existing default accounts...')
    
    // Remove existing default accounts if they exist
    await client`
      DELETE FROM users WHERE email IN ('admin@todoflow.com', 'manager@todoflow.com')
    `
    
    console.log('✅ Existing accounts cleaned up')
    console.log('')
    console.log('🎉 Setup complete!')
    console.log('')
    console.log('📧 Now you can sign up with these emails:')
    console.log('   • admin@todoflow.com (will be set to Admin role)')
    console.log('   • manager@todoflow.com (will be set to Manager role)')
    console.log('')
    console.log('🔑 Use any password when signing up')
    console.log('')
    console.log('⚠️  IMPORTANT: After signing up, you need to update roles manually:')
    console.log('   1. Run: npx drizzle-kit studio')
    console.log('   2. Open the users table') 
    console.log('   3. Change user_role from "user" to "admin" or "manager"')
    console.log('   4. Save changes')
    console.log('')
    console.log('🚀 Then refresh your app to see the role permissions!')
    
  } catch (error) {
    console.error('❌ Error during setup:', error)
  } finally {
    await client.end()
    process.exit(0)
  }
}

setupDefaultAccounts()