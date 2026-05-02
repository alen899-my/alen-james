import pool from '@/lib/db';

export interface Skill {
  id: number;
  name: string;
  image: string | null;
  level: string | null;
  experience: string | null;
  created_at: string;
  updated_at: string;
}

export type SkillInput = Omit<Skill, 'id' | 'created_at' | 'updated_at'>;

export async function createSkillsTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS skills (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      image TEXT,
      level VARCHAR(100),
      experience VARCHAR(100),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    DROP TRIGGER IF EXISTS set_skills_updated_at ON skills;
    CREATE TRIGGER set_skills_updated_at
      BEFORE UPDATE ON skills
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function getAllSkills(): Promise<Skill[]> {
  const { rows } = await pool.query(
    `SELECT * FROM skills ORDER BY created_at DESC`
  );
  return rows as Skill[];
}

export async function getSkillById(id: number): Promise<Skill | null> {
  const { rows } = await pool.query(
    `SELECT * FROM skills WHERE id = $1 LIMIT 1`,
    [id]
  );
  return (rows[0] as Skill) ?? null;
}

export async function createSkill(data: SkillInput): Promise<Skill> {
  const { rows } = await pool.query(
    `INSERT INTO skills (name, image, level, experience)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.name, data.image, data.level, data.experience]
  );
  return rows[0] as Skill;
}

export async function updateSkill(id: number, data: Partial<SkillInput>): Promise<Skill | null> {
  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(data)) {
    setClauses.push(`${key} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  }

  if (setClauses.length === 0) return getSkillById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE skills SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return (rows[0] as Skill) ?? null;
}

export async function deleteSkill(id: number): Promise<void> {
  await pool.query(`DELETE FROM skills WHERE id = $1`, [id]);
}
