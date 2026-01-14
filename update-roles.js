const postgres = require('postgres')
const fs = require('fs')

// Read DATABASE_URL from .env or .env.local
let connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL

if (!connectionString) {
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

const client = postgres(connectionString)

async function updateAdminRole() {
  try {
    const result = await client`
      UPDATE users SET user_role = 'admin' 
      WHERE email = 'admin@todoflow.com'
      RETURNING email, user_role
    `
    
    if (result.length > 0) {
      console.log('✅ Updated admin@todoflow.com to admin role')
    } else {
      console.log('❌ No user found with admin@todoflow.com')
    }
    
    // Also update manager if exists
    const managerResult = await client`
      UPDATE users SET user_role = 'manager' 
      WHERE email = 'manager@todoflow.com'
      RETURNING email, user_role
    `
    
    if (managerResult.length > 0) {
      console.log('✅ Updated manager@todoflow.com to manager role')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.end()
  }
}

updateAdminRole()