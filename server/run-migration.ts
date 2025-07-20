import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function main() {
  console.log('Running initial migration...');
  
  const sqlContent = await fs.readFile(
    path.join(process.cwd(), 'migrations', '0000_bitter_triton.sql'), 
    'utf-8'
  );

  await pool.query(sqlContent);
  console.log('Initial migration completed.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error running migration:', err);
  process.exit(1);
});
