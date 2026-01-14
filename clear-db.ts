import { db } from "./lib/db";
import { sql } from "drizzle-orm";

async function clearDatabase() {
  try {
    console.log("Clearing database data...");
    
    // Disable foreign key checks temporarily
    await db.execute(sql`SET session_replication_role = replica;`);
    
 
    const tables = await db.execute(sql`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT LIKE 'drizzle%'
    `);
    
    for (const table of tables) {
      const tableName = table.tablename;
      console.log(`Clearing table: ${tableName}`);
      await db.execute(sql.raw(`TRUNCATE TABLE "${tableName}" CASCADE`));
    }
    
    await db.execute(sql`SET session_replication_role = DEFAULT;`);
    
    console.log(" Database cleared successfully!");
    
  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    process.exit();
  }
}

clearDatabase();