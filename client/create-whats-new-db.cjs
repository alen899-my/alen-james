const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS whats_new (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        btn_text VARCHAR(100),
        btn_url TEXT,
        is_active BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      DROP TRIGGER IF EXISTS set_whats_new_updated_at ON whats_new;
      CREATE TRIGGER set_whats_new_updated_at
        BEFORE UPDATE ON whats_new
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('Whats new table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    process.exit(0);
  }
}

run();
