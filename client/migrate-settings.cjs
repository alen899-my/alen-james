const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    await pool.query(`
      ALTER TABLE site_settings 
      ADD COLUMN IF NOT EXISTS diary_global_password VARCHAR(255);
    `);
    console.log('Added diary_global_password to site_settings successfully.');
  } catch (err) {
    console.error('Error altering table:', err);
  } finally {
    process.exit(0);
  }
}

run();
