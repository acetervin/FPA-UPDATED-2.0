import bcrypt from 'bcrypt';
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

async function resetAdminPassword() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      UPDATE users 
      SET password = $1 
      WHERE username = 'admin' AND role = 'admin'
      RETURNING id`;
    
    const result = await pool.query(query, [hashedPassword]);
    
    if (result.rows.length > 0) {
      console.log('Admin password has been reset successfully');
    } else {
      console.log('Admin user not found');
    }
  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    await pool.end();
  }
}

resetAdminPassword();
