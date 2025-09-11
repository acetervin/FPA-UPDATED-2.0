import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function addUniqueConstraint() {
  try {
    await db.execute(sql`ALTER TABLE events ADD CONSTRAINT events_name_unique UNIQUE (name);`);
    console.log('Successfully added unique constraint');
  } catch (error) {
    console.error('Error adding unique constraint:', error);
  } finally {
    await pool.end();
  }
}

addUniqueConstraint();
