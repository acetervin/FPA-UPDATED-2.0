import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function main() {
  console.log('Dropping existing tables...');

  // Drop tables in the correct order (reverse of creation)
  await pool.query(`
    DROP TABLE IF EXISTS volunteer_applications CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS team_members CASCADE;
    DROP TABLE IF EXISTS newsletter_subscriptions CASCADE;
    DROP TABLE IF EXISTS gallery_images CASCADE;
    DROP TABLE IF EXISTS event_registrations CASCADE;
    DROP TABLE IF EXISTS events CASCADE;
    DROP TABLE IF EXISTS contact_submissions CASCADE;
    DROP TABLE IF EXISTS causes CASCADE;
    DROP TABLE IF EXISTS blog_posts CASCADE;
  `);

  console.log('Tables dropped successfully.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error dropping tables:', err);
  process.exit(1);
});
