const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS resumes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        is_active BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      DROP TRIGGER IF EXISTS set_resumes_updated_at ON resumes;
      CREATE TRIGGER set_resumes_updated_at
        BEFORE UPDATE ON resumes
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('Resumes table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    process.exit(0);
  }
}

run();
