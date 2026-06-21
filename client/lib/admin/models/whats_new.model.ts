import pool from '@/lib/db';

export interface WhatsNew {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  btn_text: string | null;
  btn_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type WhatsNewInput = Omit<WhatsNew, 'id' | 'created_at' | 'updated_at'>;

export async function createWhatsNewTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS whats_new (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      btn_text VARCHAR(100),
      btn_url TEXT,
      is_active BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    DROP TRIGGER IF EXISTS set_whats_new_updated_at ON whats_new;
    CREATE TRIGGER set_whats_new_updated_at
      BEFORE UPDATE ON whats_new
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function getAllWhatsNew(): Promise<WhatsNew[]> {
  const { rows } = await pool.query(
    `SELECT * FROM whats_new ORDER BY created_at DESC`
  );
  return rows as WhatsNew[];
}

export async function getActiveWhatsNew(): Promise<WhatsNew | null> {
  const { rows } = await pool.query(
    `SELECT * FROM whats_new WHERE is_active = true LIMIT 1`
  );
  return (rows[0] as WhatsNew) ?? null;
}

export async function getWhatsNewById(id: number): Promise<WhatsNew | null> {
  const { rows } = await pool.query(
    `SELECT * FROM whats_new WHERE id = $1 LIMIT 1`,
    [id]
  );
  return (rows[0] as WhatsNew) ?? null;
}

export async function createWhatsNew(data: WhatsNewInput): Promise<WhatsNew> {
  if (data.is_active) {
    await pool.query(`UPDATE whats_new SET is_active = false`);
  }

  const { rows } = await pool.query(
    `INSERT INTO whats_new (title, content, image_url, btn_text, btn_url, is_active)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [data.title, data.content, data.image_url, data.btn_text, data.btn_url, data.is_active]
  );
  return rows[0] as WhatsNew;
}

export async function updateWhatsNew(id: number, data: Partial<WhatsNewInput>): Promise<WhatsNew | null> {
  if (data.is_active) {
    await pool.query(`UPDATE whats_new SET is_active = false WHERE id != $1`, [id]);
  }

  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(data)) {
    setClauses.push(`"${key}" = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  }

  if (setClauses.length === 0) return getWhatsNewById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE whats_new SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return (rows[0] as WhatsNew) ?? null;
}

export async function deleteWhatsNew(id: number): Promise<void> {
  await pool.query(`DELETE FROM whats_new WHERE id = $1`, [id]);
}
