const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS travels (
        id SERIAL PRIMARY KEY,
        location VARCHAR(255) NOT NULL,
        period VARCHAR(255),
        description TEXT,
        images JSONB DEFAULT '[]'::jsonb,
        videos JSONB DEFAULT '[]'::jsonb,
        is_public BOOLEAN DEFAULT false,
        password VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      DROP TRIGGER IF EXISTS set_travels_updated_at ON travels;
      CREATE TRIGGER set_travels_updated_at
        BEFORE UPDATE ON travels
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('Travels table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    process.exit(0);
  }
}

run();
