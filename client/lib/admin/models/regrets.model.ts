import pool from '@/lib/db';

export interface Regret {
  id: number;
  title: string;
  date: string | null;
  description: string | null;
  images: string[];
  videos: string[];
  is_public: boolean;
  password: string | null;
  created_at: string;
  updated_at: string;
}

export type RegretInput = Omit<Regret, 'id' | 'created_at' | 'updated_at'>;

export async function createRegretsTable(): Promise<void> {
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
}

export async function getAllRegrets(): Promise<Regret[]> {
  const { rows } = await pool.query(
    `SELECT * FROM regrets ORDER BY created_at DESC`
  );
  return rows as Regret[];
}

export async function getRegretById(id: number): Promise<Regret | null> {
  const { rows } = await pool.query(
    `SELECT * FROM regrets WHERE id = $1 LIMIT 1`,
    [id]
  );
  return (rows[0] as Regret) ?? null;
}

export async function createRegret(data: RegretInput): Promise<Regret> {
  const { rows } = await pool.query(
    `INSERT INTO regrets (title, date, description, images, videos, is_public, password)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.title,
      data.date,
      data.description,
      JSON.stringify(data.images || []),
      JSON.stringify(data.videos || []),
      data.is_public,
      data.password
    ]
  );
  return rows[0] as Regret;
}

export async function updateRegret(id: number, data: Partial<RegretInput>): Promise<Regret | null> {
  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(data)) {
    setClauses.push(`${key} = $${paramIndex}`);
    if (key === 'images' || key === 'videos') {
      values.push(JSON.stringify(value || []));
    } else {
      values.push(value);
    }
    paramIndex++;
  }

  if (setClauses.length === 0) return getRegretById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE regrets SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return (rows[0] as Regret) ?? null;
}

export async function deleteRegret(id: number): Promise<void> {
  await pool.query(`DELETE FROM regrets WHERE id = $1`, [id]);
}
