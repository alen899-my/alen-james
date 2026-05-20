import pool from '@/lib/db';

export interface Resume {
  id: number;
  name: string;
  file_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ResumeInput = Omit<Resume, 'id' | 'created_at' | 'updated_at'>;

export async function createResumesTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS resumes (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      file_url TEXT NOT NULL,
      is_active BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    DROP TRIGGER IF EXISTS set_resumes_updated_at ON resumes;
    CREATE TRIGGER set_resumes_updated_at
      BEFORE UPDATE ON resumes
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function getAllResumes(): Promise<Resume[]> {
  const { rows } = await pool.query(
    `SELECT * FROM resumes ORDER BY created_at DESC`
  );
  return rows as Resume[];
}

export async function getActiveResume(): Promise<Resume | null> {
  const { rows } = await pool.query(
    `SELECT * FROM resumes WHERE is_active = true LIMIT 1`
  );
  return (rows[0] as Resume) ?? null;
}

export async function getResumeById(id: number): Promise<Resume | null> {
  const { rows } = await pool.query(
    `SELECT * FROM resumes WHERE id = $1 LIMIT 1`,
    [id]
  );
  return (rows[0] as Resume) ?? null;
}

export async function createResume(data: ResumeInput): Promise<Resume> {
  // If this resume is set to active, deactivate all others first
  if (data.is_active) {
    await pool.query(`UPDATE resumes SET is_active = false`);
  }

  const { rows } = await pool.query(
    `INSERT INTO resumes (name, file_url, is_active)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [data.name, data.file_url, data.is_active]
  );
  return rows[0] as Resume;
}

export async function updateResume(id: number, data: Partial<ResumeInput>): Promise<Resume | null> {
  // If setting this one to active, deactivate others
  if (data.is_active) {
    await pool.query(`UPDATE resumes SET is_active = false WHERE id != $1`, [id]);
  }

  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(data)) {
    setClauses.push(`${key} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  }

  if (setClauses.length === 0) return getResumeById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE resumes SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return (rows[0] as Resume) ?? null;
}

export async function deleteResume(id: number): Promise<void> {
  await pool.query(`DELETE FROM resumes WHERE id = $1`, [id]);
}
