const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_EjPRr1vqdi2Y@ep-long-base-a73r9hz9-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        main_image TEXT,
        video_url TEXT,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        publish_date TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      DROP TRIGGER IF EXISTS set_blogs_updated_at ON blogs;
      CREATE TRIGGER set_blogs_updated_at
        BEFORE UPDATE ON blogs
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('Blogs table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    process.exit(0);
  }
}

run();
