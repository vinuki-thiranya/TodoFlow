import { db } from "./lib/db/index.js"
import { users } from "./lib/db/schema.js"

async function addDefaultAccounts() {
  try {
    console.log("Adding default admin and manager accounts...")
    
    // Add default admin account
    await db.insert(users).values({
      id: "admin-default-001",
      name: "System Admin", 
      email: "admin@todoflow.com",
      userRole: "admin",
      emailVerified: true,
    }).onConflictDoUpdate({
      target: users.email,
      set: {
        userRole: "admin",
        name: "System Admin",
        updatedAt: new Date()
      }
    })

    // Add default manager account  
    await db.insert(users).values({
      id: "manager-default-001",
      name: "System Manager",
      email: "manager@todoflow.com", 
      userRole: "manager",
      emailVerified: true,
    }).onConflictDoUpdate({
      target: users.email,
      set: {
        userRole: "manager", 
        name: "System Manager",
        updatedAt: new Date()
      }
    })

    console.log("✅ Default accounts added successfully!")
    console.log("Admin: admin@todoflow.com") 
    console.log("Manager: manager@todoflow.com")
    console.log("Password: Use any password when signing up with these emails")
    
  } catch (error) {
    console.error("Error adding default accounts:", error)
  }
  
  process.exit(0)
}

addDefaultAccounts()