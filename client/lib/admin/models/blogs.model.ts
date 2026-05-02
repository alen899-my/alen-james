import pool from '@/lib/db';

export interface Blog {
  id: number;
  title: string;
  description: string | null;
  main_image: string | null;
  video_url: string | null;
  status: 'active' | 'inactive';
  publish_date: string | null;
  created_at: string;
  updated_at: string;
}

export type BlogInput = Omit<Blog, 'id' | 'created_at' | 'updated_at'>;

export async function createBlogsTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      main_image TEXT,
      video_url TEXT,
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      publish_date TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    DROP TRIGGER IF EXISTS set_blogs_updated_at ON blogs;
    CREATE TRIGGER set_blogs_updated_at
      BEFORE UPDATE ON blogs
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function getAllBlogs(): Promise<Blog[]> {
  const { rows } = await pool.query(
    `SELECT * FROM blogs ORDER BY publish_date DESC NULLS LAST, created_at DESC`
  );
  return rows as Blog[];
}

export async function getBlogById(id: number): Promise<Blog | null> {
  const { rows } = await pool.query(
    `SELECT * FROM blogs WHERE id = $1 LIMIT 1`,
    [id]
  );
  return (rows[0] as Blog) ?? null;
}

export async function createBlog(data: BlogInput): Promise<Blog> {
  const { rows } = await pool.query(
    `INSERT INTO blogs (title, description, main_image, video_url, status, publish_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.title,
      data.description,
      data.main_image,
      data.video_url,
      data.status || 'active',
      data.publish_date || null
    ]
  );
  return rows[0] as Blog;
}

export async function updateBlog(id: number, data: Partial<BlogInput>): Promise<Blog | null> {
  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(data)) {
    setClauses.push(`${key} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  }

  if (setClauses.length === 0) return getBlogById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE blogs SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return (rows[0] as Blog) ?? null;
}

export async function deleteBlog(id: number): Promise<void> {
  await pool.query(`DELETE FROM blogs WHERE id = $1`, [id]);
}
