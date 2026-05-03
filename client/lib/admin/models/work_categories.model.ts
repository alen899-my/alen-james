import pool from '@/lib/db';

export interface WorkCategory {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export type WorkCategoryInput = Omit<WorkCategory, 'id' | 'created_at' | 'updated_at'>;

export async function createWorkCategoriesTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS work_categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    DROP TRIGGER IF EXISTS set_work_categories_updated_at ON work_categories;
    CREATE TRIGGER set_work_categories_updated_at
      BEFORE UPDATE ON work_categories
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function getAllWorkCategories(): Promise<WorkCategory[]> {
  const { rows } = await pool.query(
    `SELECT * FROM work_categories ORDER BY name ASC`
  );
  return rows as WorkCategory[];
}

export async function getWorkCategoryById(id: number): Promise<WorkCategory | null> {
  const { rows } = await pool.query(
    `SELECT * FROM work_categories WHERE id = $1 LIMIT 1`,
    [id]
  );
  return (rows[0] as WorkCategory) ?? null;
}

export async function createWorkCategory(data: WorkCategoryInput): Promise<WorkCategory> {
  const { rows } = await pool.query(
    `INSERT INTO work_categories (name, slug) VALUES ($1, $2) RETURNING *`,
    [data.name, data.slug]
  );
  return rows[0] as WorkCategory;
}

export async function updateWorkCategory(id: number, data: Partial<WorkCategoryInput>): Promise<WorkCategory | null> {
  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(data)) {
    setClauses.push(`${key} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  }

  if (setClauses.length === 0) return getWorkCategoryById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE work_categories SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return (rows[0] as WorkCategory) ?? null;
}

export async function deleteWorkCategory(id: number): Promise<void> {
  await pool.query(`DELETE FROM work_categories WHERE id = $1`, [id]);
}
