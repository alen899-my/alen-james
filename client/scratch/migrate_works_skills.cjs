const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    console.log('Adding skill_ids column to works table...');
    await pool.query(`
      ALTER TABLE works 
      ADD COLUMN IF NOT EXISTS skill_ids JSONB DEFAULT '[]'::jsonb;
    `);
    console.log('Successfully added skill_ids column.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
