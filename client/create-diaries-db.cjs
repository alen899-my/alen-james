const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_EjPRr1vqdi2Y@ep-long-base-a73r9hz9-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS diaries (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        images JSONB DEFAULT '[]'::jsonb,
        is_public BOOLEAN DEFAULT false,
        password VARCHAR(255),
        incident_date TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      DROP TRIGGER IF EXISTS set_diaries_updated_at ON diaries;
      CREATE TRIGGER set_diaries_updated_at
        BEFORE UPDATE ON diaries
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('Diaries table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    process.exit(0);
  }
}

run();
