import pool from '@/lib/db';

export interface Experience {
  id: number;
  job_title: string;
  location: string | null;
  from_date: string | null;
  to_date: string | null;
  description: string | null;
  images: string[];
  videos: string[];
  created_at: string;
  updated_at: string;
}

export type ExperienceInput = Omit<Experience, 'id' | 'created_at' | 'updated_at'>;

export async function createExperiencesTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS experiences (
      id SERIAL PRIMARY KEY,
      job_title VARCHAR(255) NOT NULL,
      location VARCHAR(255),
      from_date VARCHAR(255),
      to_date VARCHAR(255),
      description TEXT,
      images JSONB DEFAULT '[]'::jsonb,
      videos JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    DROP TRIGGER IF EXISTS set_experiences_updated_at ON experiences;
    CREATE TRIGGER set_experiences_updated_at
      BEFORE UPDATE ON experiences
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function getAllExperiences(): Promise<Experience[]> {
  const { rows } = await pool.query(
    `SELECT * FROM experiences ORDER BY created_at DESC`
  );
  return rows as Experience[];
}

export async function getExperienceById(id: number): Promise<Experience | null> {
  const { rows } = await pool.query(
    `SELECT * FROM experiences WHERE id = $1 LIMIT 1`,
    [id]
  );
  return (rows[0] as Experience) ?? null;
}

export async function createExperience(data: ExperienceInput): Promise<Experience> {
  const { rows } = await pool.query(
    `INSERT INTO experiences (job_title, location, from_date, to_date, description, images, videos)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.job_title,
      data.location,
      data.from_date,
      data.to_date,
      data.description,
      JSON.stringify(data.images || []),
      JSON.stringify(data.videos || [])
    ]
  );
  return rows[0] as Experience;
}

export async function updateExperience(id: number, data: Partial<ExperienceInput>): Promise<Experience | null> {
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

  if (setClauses.length === 0) return getExperienceById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE experiences SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return (rows[0] as Experience) ?? null;
}

export async function deleteExperience(id: number): Promise<void> {
  await pool.query(`DELETE FROM experiences WHERE id = $1`, [id]);
}
