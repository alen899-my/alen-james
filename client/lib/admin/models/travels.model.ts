import pool from '@/lib/db';

export interface Travel {
  id: number;
  location: string;
  period: string | null;
  description: string | null;
  images: string[];
  videos: string[];
  is_public: boolean;
  password: string | null;
  created_at: string;
  updated_at: string;
}

export type TravelInput = Omit<Travel, 'id' | 'created_at' | 'updated_at'>;

export async function createTravelsTable(): Promise<void> {
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
}

export async function getAllTravels(): Promise<Travel[]> {
  const { rows } = await pool.query(
    `SELECT * FROM travels ORDER BY created_at DESC`
  );
  return rows as Travel[];
}

export async function getTravelById(id: number): Promise<Travel | null> {
  const { rows } = await pool.query(
    `SELECT * FROM travels WHERE id = $1 LIMIT 1`,
    [id]
  );
  return (rows[0] as Travel) ?? null;
}

export async function createTravel(data: TravelInput): Promise<Travel> {
  const { rows } = await pool.query(
    `INSERT INTO travels (location, period, description, images, videos, is_public, password)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.location,
      data.period,
      data.description,
      JSON.stringify(data.images || []),
      JSON.stringify(data.videos || []),
      data.is_public,
      data.password
    ]
  );
  return rows[0] as Travel;
}

export async function updateTravel(id: number, data: Partial<TravelInput>): Promise<Travel | null> {
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

  if (setClauses.length === 0) return getTravelById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE travels SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return (rows[0] as Travel) ?? null;
}

export async function deleteTravel(id: number): Promise<void> {
  await pool.query(`DELETE FROM travels WHERE id = $1`, [id]);
}
