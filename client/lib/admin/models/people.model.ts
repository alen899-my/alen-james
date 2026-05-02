import pool from '@/lib/db';

export interface Person {
  id: number;
  name: string;
  relation: string | null;
  about_them: string | null;
  images: string[];
  videos: string[];
  is_public: boolean;
  password: string | null;
  created_at: string;
  updated_at: string;
}

export type PersonInput = Omit<Person, 'id' | 'created_at' | 'updated_at'>;

export async function createPeopleTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS people (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      relation VARCHAR(255),
      about_them TEXT,
      images JSONB DEFAULT '[]'::jsonb,
      videos JSONB DEFAULT '[]'::jsonb,
      is_public BOOLEAN DEFAULT false,
      password VARCHAR(255),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    DROP TRIGGER IF EXISTS set_people_updated_at ON people;
    CREATE TRIGGER set_people_updated_at
      BEFORE UPDATE ON people
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function getAllPeople(): Promise<Person[]> {
  const { rows } = await pool.query(
    `SELECT * FROM people ORDER BY created_at DESC`
  );
  return rows as Person[];
}

export async function getPersonById(id: number): Promise<Person | null> {
  const { rows } = await pool.query(
    `SELECT * FROM people WHERE id = $1 LIMIT 1`,
    [id]
  );
  return (rows[0] as Person) ?? null;
}

export async function createPerson(data: PersonInput): Promise<Person> {
  const { rows } = await pool.query(
    `INSERT INTO people (name, relation, about_them, images, videos, is_public, password)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.name,
      data.relation,
      data.about_them,
      JSON.stringify(data.images || []),
      JSON.stringify(data.videos || []),
      data.is_public,
      data.password
    ]
  );
  return rows[0] as Person;
}

export async function updatePerson(id: number, data: Partial<PersonInput>): Promise<Person | null> {
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

  if (setClauses.length === 0) return getPersonById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE people SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return (rows[0] as Person) ?? null;
}

export async function deletePerson(id: number): Promise<void> {
  await pool.query(`DELETE FROM people WHERE id = $1`, [id]);
}
