import pool from '@/lib/db';

export interface Work {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  main_image: string | null;
  screenshots: string[]; // JSONB array of urls
  additional_videos: string[]; // JSONB array of urls
  live_link: string | null;
  video_url: string | null;
  introduction: string | null;
  what_i_did: string | null;
  tech_stacks: string[]; // JSONB array of strings
  year: string | null;
  created_at: string;
  updated_at: string;
}

export type WorkInput = Omit<Work, 'id' | 'created_at' | 'updated_at'>;

export async function createWorksTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS works (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255),
      description TEXT,
      main_image TEXT,
      screenshots JSONB DEFAULT '[]'::jsonb,
      additional_videos JSONB DEFAULT '[]'::jsonb,
      live_link TEXT,
      video_url TEXT,
      introduction TEXT,
      what_i_did TEXT,
      tech_stacks JSONB DEFAULT '[]'::jsonb,
      year VARCHAR(20),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    DROP TRIGGER IF EXISTS set_works_updated_at ON works;
    CREATE TRIGGER set_works_updated_at
      BEFORE UPDATE ON works
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function getAllWorks(): Promise<Work[]> {
  const { rows } = await pool.query(
    `SELECT * FROM works ORDER BY created_at DESC`
  );
  return rows as Work[];
}

export async function getWorkById(id: number): Promise<Work | null> {
  const { rows } = await pool.query(
    `SELECT * FROM works WHERE id = $1 LIMIT 1`,
    [id]
  );
  return (rows[0] as Work) ?? null;
}

export async function createWork(data: WorkInput): Promise<Work> {
  const { rows } = await pool.query(
    `INSERT INTO works (
      title, subtitle, description, main_image, screenshots, additional_videos, live_link, video_url, introduction, what_i_did, tech_stacks, year
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`,
    [
      data.title,
      data.subtitle,
      data.description,
      data.main_image,
      JSON.stringify(data.screenshots || []),
      JSON.stringify(data.additional_videos || []),
      data.live_link,
      data.video_url,
      data.introduction,
      data.what_i_did,
      JSON.stringify(data.tech_stacks || []),
      data.year
    ]
  );
  return rows[0] as Work;
}

export async function updateWork(id: number, data: Partial<WorkInput>): Promise<Work | null> {
  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(data)) {
    setClauses.push(`${key} = $${paramIndex}`);
    if (key === 'screenshots' || key === 'tech_stacks' || key === 'additional_videos') {
      values.push(JSON.stringify(value || []));
    } else {
      values.push(value);
    }
    paramIndex++;
  }

  if (setClauses.length === 0) return getWorkById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE works SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return (rows[0] as Work) ?? null;
}

export async function deleteWork(id: number): Promise<void> {
  await pool.query(`DELETE FROM works WHERE id = $1`, [id]);
}
