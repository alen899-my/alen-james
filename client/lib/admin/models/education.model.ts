import pool from '@/lib/db';

export interface Education {
  id: number;
  name: string;
  year_from: string | null;
  year_to: string | null;
  studied: string | null;
  about_education: string | null;
  achievements: string | null;
  gallery: string[]; // JSONB array of urls
  videos: string[]; // JSONB array of urls
  school_photo: string | null;
  school_location: string | null;
  grade_mark: string | null;
  created_at: string;
  updated_at: string;
}

export type EducationInput = Omit<Education, 'id' | 'created_at' | 'updated_at'>;

export async function createEducationTable(): Promise<void> {
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
}

export async function getAllEducation(): Promise<Education[]> {
  const { rows } = await pool.query(
    `SELECT * FROM education ORDER BY year_from DESC NULLS LAST, created_at DESC`
  );
  return rows as Education[];
}

export async function getEducationById(id: number): Promise<Education | null> {
  const { rows } = await pool.query(
    `SELECT * FROM education WHERE id = $1 LIMIT 1`,
    [id]
  );
  return (rows[0] as Education) ?? null;
}

export async function createEducation(data: EducationInput): Promise<Education> {
  const { rows } = await pool.query(
    `INSERT INTO education (
      name, year_from, year_to, studied, about_education, achievements, gallery, videos, school_photo, school_location, grade_mark
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`,
    [
      data.name,
      data.year_from,
      data.year_to,
      data.studied,
      data.about_education,
      data.achievements,
      JSON.stringify(data.gallery || []),
      JSON.stringify(data.videos || []),
      data.school_photo,
      data.school_location,
      data.grade_mark
    ]
  );
  return rows[0] as Education;
}

export async function updateEducation(id: number, data: Partial<EducationInput>): Promise<Education | null> {
  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(data)) {
    setClauses.push(`${key} = $${paramIndex}`);
    if (key === 'gallery' || key === 'videos') {
      values.push(JSON.stringify(value || []));
    } else {
      values.push(value);
    }
    paramIndex++;
  }

  if (setClauses.length === 0) return getEducationById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE education SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return (rows[0] as Education) ?? null;
}

export async function deleteEducation(id: number): Promise<void> {
  await pool.query(`DELETE FROM education WHERE id = $1`, [id]);
}
