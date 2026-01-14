import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users, todos, accounts, sessions, verifications, todoLists, tags, todoTags, todoItems, notes } from '../lib/db/schema';

const sql = neon(process.env.POSTGRES_URL!);
const db = drizzle(sql);

async function clearDatabase() {
  console.log('🗑️  Starting database cleanup...');
  
  try {
    // Delete in order to respect foreign key constraints
    console.log('Deleting todo items...');
    await db.delete(todoItems);
    console.log(`✅ Deleted todo items`);
    
    console.log('Deleting todo tags...');
    await db.delete(todoTags);
    console.log(`✅ Deleted todo tags`);
    
    console.log('Deleting todos...');
    await db.delete(todos);
    console.log(`✅ Deleted todos`);
    
    console.log('Deleting todo lists...');
    await db.delete(todoLists);
    console.log(`✅ Deleted todo lists`);
    
    console.log('Deleting tags...');
    await db.delete(tags);
    console.log(`✅ Deleted tags`);
    
    console.log('Deleting notes...');
    await db.delete(notes);
    console.log(`✅ Deleted notes`);
    
    console.log('Deleting verifications...');
    await db.delete(verifications);
    console.log(`✅ Deleted verifications`);
    
    console.log('Deleting sessions...');
    await db.delete(sessions);
    console.log(`✅ Deleted sessions`);
    
    console.log('Deleting accounts...');
    await db.delete(accounts);
    console.log(`✅ Deleted accounts`);
    
    console.log('Deleting users...');
    await db.delete(users);
    console.log(`✅ Deleted users`);
    
    console.log('🎉 Database cleanup completed! All data has been removed.');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
}

clearDatabase();