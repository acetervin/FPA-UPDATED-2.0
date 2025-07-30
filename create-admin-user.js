import bcrypt from 'bcrypt';
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

async function createAdminUser() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const username = 'admin';
    const password = 'admin123';
    const email = 'admin@example.com';
    const fullName = 'Admin User';
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (username, password, email, role, full_name, active)
      VALUES ($1, $2, $3, 'admin', $4, true)
      ON CONFLICT (username) DO NOTHING
      RETURNING id, username, role, email, full_name
    `;
    
    const result = await pool.query(query, [username, hashedPassword, email, fullName]);
    
    if (result.rows.length > 0) {
      console.log('Admin user created successfully!');
      console.log('Username:', username);
      console.log('Password:', password);
      console.log('Email:', email);
    } else {
      console.log('Admin user already exists');
    }
    
    await pool.end();
  } catch (error) {
    console.error('Error creating admin user:', error);
    await pool.end();
  }
}

createAdminUser();
