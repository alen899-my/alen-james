const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS regrets (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date VARCHAR(255),
        description TEXT,
        images JSONB DEFAULT '[]'::jsonb,
        videos JSONB DEFAULT '[]'::jsonb,
        is_public BOOLEAN DEFAULT false,
        password VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      DROP TRIGGER IF EXISTS set_regrets_updated_at ON regrets;
      CREATE TRIGGER set_regrets_updated_at
        BEFORE UPDATE ON regrets
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('Regrets table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    process.exit(0);
  }
}

run();
