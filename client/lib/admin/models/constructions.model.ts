import pool from '@/lib/db';

export interface Construction {
  id: number;
  name: string;
  tagline: string | null;
  main_image: string | null;
  stacks: string[];
  project_idea: string | null;
  features: string | null;
  construction_phase: string | null;
  is_upcoming: boolean;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export type ConstructionInput = Omit<Construction, 'id' | 'created_at' | 'updated_at'>;

// ── DDL ───────────────────────────────────────────────────────────────────────

export async function createConstructionsTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS constructions (
      id                  SERIAL PRIMARY KEY,
      name                VARCHAR(255)  NOT NULL,
      tagline             VARCHAR(500),
      main_image          TEXT,
      stacks              JSONB         NOT NULL DEFAULT '[]'::jsonb,
      project_idea        TEXT,
      features            TEXT,
      construction_phase  VARCHAR(100)  DEFAULT 'Planning',
      is_upcoming         BOOLEAN       NOT NULL DEFAULT FALSE,
      status              VARCHAR(20)   NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active', 'inactive')),
      created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
      updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );

    DROP TRIGGER IF EXISTS set_constructions_updated_at ON constructions;
    CREATE TRIGGER set_constructions_updated_at
      BEFORE UPDATE ON constructions
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);
}

// ── Queries ───────────────────────────────────────────────────────────────────

export async function getAllConstructions(): Promise<Construction[]> {
  const { rows } = await pool.query(
    `SELECT * FROM constructions ORDER BY is_upcoming ASC, created_at DESC`
  );
  return rows.map(r => ({ ...r, stacks: r.stacks || [] })) as Construction[];
}

export async function getActiveConstructions(): Promise<Construction[]> {
  const { rows } = await pool.query(
    `SELECT * FROM constructions WHERE status = 'active' ORDER BY is_upcoming ASC, created_at DESC`
  );
  return rows.map(r => ({ ...r, stacks: r.stacks || [] })) as Construction[];
}

export async function getConstructionById(id: number): Promise<Construction | null> {
  if (isNaN(id)) return null;
  const { rows } = await pool.query(
    `SELECT * FROM constructions WHERE id = $1 LIMIT 1`,
    [id]
  );
  if (!rows[0]) return null;
  return { ...rows[0], stacks: rows[0].stacks || [] } as Construction;
}

export async function createConstruction(data: ConstructionInput): Promise<Construction> {
  const { rows } = await pool.query(
    `INSERT INTO constructions
      (name, tagline, main_image, stacks, project_idea, features, construction_phase, is_upcoming, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      data.name,
      data.tagline,
      data.main_image,
      JSON.stringify(data.stacks || []),
      data.project_idea,
      data.features,
      data.construction_phase,
      data.is_upcoming,
      data.status,
    ]
  );
  return { ...rows[0], stacks: rows[0].stacks || [] } as Construction;
}

export async function updateConstruction(id: number, data: Partial<ConstructionInput>): Promise<Construction | null> {
  const setClauses: string[] = [];
  const values: any[] = [];
  let i = 1;

  for (const [key, value] of Object.entries(data)) {
    setClauses.push(`${key} = $${i}`);
    values.push(key === 'stacks' ? JSON.stringify(value || []) : value);
    i++;
  }

  if (setClauses.length === 0) return getConstructionById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE constructions SET ${setClauses.join(', ')} WHERE id = $${i} RETURNING *`,
    values
  );
  if (!rows[0]) return null;
  return { ...rows[0], stacks: rows[0].stacks || [] } as Construction;
}

export async function deleteConstruction(id: number): Promise<void> {
  await pool.query(`DELETE FROM constructions WHERE id = $1`, [id]);
}
