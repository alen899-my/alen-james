const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_EjPRr1vqdi2Y@ep-long-base-a73r9hz9-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        year_from VARCHAR(20),
        year_to VARCHAR(20),
        studied VARCHAR(255),
        about_education TEXT,
        achievements TEXT,
        gallery JSONB DEFAULT '[]'::jsonb,
        videos JSONB DEFAULT '[]'::jsonb,
        school_photo TEXT,
        school_location VARCHAR(255),
        grade_mark VARCHAR(100),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      DROP TRIGGER IF EXISTS set_education_updated_at ON education;
      CREATE TRIGGER set_education_updated_at
        BEFORE UPDATE ON education
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('Education table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    process.exit(0);
  }
}

run();
