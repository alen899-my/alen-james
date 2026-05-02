import pool from '@/lib/db';

export interface Diary {
  id: number;
  title: string;
  content: string | null;
  images: string[];
  is_public: boolean;
  password: string | null;
  incident_date: string | null;
  created_at: string;
  updated_at: string;
}

export type DiaryInput = Omit<Diary, 'id' | 'created_at' | 'updated_at'>;

export async function createDiariesTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS diaries (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT,
      images JSONB DEFAULT '[]'::jsonb,
      is_public BOOLEAN DEFAULT false,
      password VARCHAR(255),
      incident_date TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    DROP TRIGGER IF EXISTS set_diaries_updated_at ON diaries;
    CREATE TRIGGER set_diaries_updated_at
      BEFORE UPDATE ON diaries
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function getAllDiaries(): Promise<Diary[]> {
  const { rows } = await pool.query(
    `SELECT * FROM diaries ORDER BY incident_date DESC NULLS LAST, created_at DESC`
  );
  return rows as Diary[];
}

export async function getDiaryById(id: number): Promise<Diary | null> {
  const { rows } = await pool.query(
    `SELECT * FROM diaries WHERE id = $1 LIMIT 1`,
    [id]
  );
  return (rows[0] as Diary) ?? null;
}

export async function createDiary(data: DiaryInput): Promise<Diary> {
  const { rows } = await pool.query(
    `INSERT INTO diaries (title, content, images, is_public, password, incident_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.title,
      data.content,
      JSON.stringify(data.images || []),
      data.is_public,
      data.password,
      data.incident_date || null
    ]
  );
  return rows[0] as Diary;
}

export async function updateDiary(id: number, data: Partial<DiaryInput>): Promise<Diary | null> {
  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(data)) {
    setClauses.push(`${key} = $${paramIndex}`);
    if (key === 'images') {
      values.push(JSON.stringify(value || []));
    } else {
      values.push(value);
    }
    paramIndex++;
  }

  if (setClauses.length === 0) return getDiaryById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE diaries SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return (rows[0] as Diary) ?? null;
}

export async function deleteDiary(id: number): Promise<void> {
  await pool.query(`DELETE FROM diaries WHERE id = $1`, [id]);
}
