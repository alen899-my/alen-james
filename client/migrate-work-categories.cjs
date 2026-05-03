const pg = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  try {
    console.log('Starting migration...');
    
    // 1. Create work_categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS work_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('work_categories table created or already exists.');

    // 2. Add category_id to works table
    // Check if column exists first
    const { rows } = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='works' AND column_name='category_id';
    `);

    if (rows.length === 0) {
      await pool.query(`
        ALTER TABLE works 
        ADD COLUMN category_id INTEGER REFERENCES work_categories(id) ON DELETE SET NULL;
      `);
      console.log('category_id column added to works table.');
    } else {
      console.log('category_id column already exists in works table.');
    }

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
