const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS experiences (
        id SERIAL PRIMARY KEY,
        job_title VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        from_date VARCHAR(255),
        to_date VARCHAR(255),
        description TEXT,
        images JSONB DEFAULT '[]'::jsonb,
        videos JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      DROP TRIGGER IF EXISTS set_experiences_updated_at ON experiences;
      CREATE TRIGGER set_experiences_updated_at
        BEFORE UPDATE ON experiences
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('Experiences table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    process.exit(0);
  }
}

run();
