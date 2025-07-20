import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import 'dotenv/config';
import * as schema from '../shared/schema';
import { users } from '../shared/schema';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function main() {
  console.log('Creating admin user...');

  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  await db.insert(users).values({
    username: 'admin',
    password: hashedPassword,
    email: 'admin@example.com',
    role: 'admin',
    fullName: 'Administrator',
    active: true,
  }).onConflictDoUpdate({
    target: users.username,
    set: {
      password: hashedPassword,
      email: 'admin@example.com',
      role: 'admin',
      fullName: 'Administrator',
      active: true,
    },
  });

  console.log('Admin user created successfully.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error creating admin user:', err);
  process.exit(1);
});
