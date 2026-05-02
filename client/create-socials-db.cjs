const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS social_links (
        id SERIAL PRIMARY KEY,
        platform VARCHAR(100) NOT NULL,
        icon_url TEXT,
        url TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      DROP TRIGGER IF EXISTS set_social_links_updated_at ON social_links;
      CREATE TRIGGER set_social_links_updated_at
        BEFORE UPDATE ON social_links
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('Social Links table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    process.exit(0);
  }
}

run();
