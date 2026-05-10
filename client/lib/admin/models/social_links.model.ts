import pool, { queryWithRetry } from '@/lib/db';

export interface SocialLink {
  id: number;
  platform: string;
  icon_url: string | null;
  url: string;
  created_at: string;
  updated_at: string;
}

export type SocialLinkInput = Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>;

export async function createSocialLinksTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS social_links (
      id SERIAL PRIMARY KEY,
      platform VARCHAR(100) NOT NULL,
      icon_url TEXT,
      url TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    DROP TRIGGER IF EXISTS set_social_links_updated_at ON social_links;
    CREATE TRIGGER set_social_links_updated_at
      BEFORE UPDATE ON social_links
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function getAllSocialLinks(): Promise<SocialLink[]> {
  // Uses retry logic to handle Neon auto-suspend cold-starts
  const { rows } = await queryWithRetry<SocialLink>(
    `SELECT * FROM social_links ORDER BY created_at ASC`
  );
  return rows;
}

export async function getSocialLinkById(id: number): Promise<SocialLink | null> {
  const { rows } = await pool.query(
    `SELECT * FROM social_links WHERE id = $1 LIMIT 1`,
    [id]
  );
  return (rows[0] as SocialLink) ?? null;
}

export async function createSocialLink(data: SocialLinkInput): Promise<SocialLink> {
  const { rows } = await pool.query(
    `INSERT INTO social_links (platform, icon_url, url)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [data.platform, data.icon_url, data.url]
  );
  return rows[0] as SocialLink;
}

export async function updateSocialLink(id: number, data: Partial<SocialLinkInput>): Promise<SocialLink | null> {
  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(data)) {
    setClauses.push(`${key} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  }

  if (setClauses.length === 0) return getSocialLinkById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE social_links SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return (rows[0] as SocialLink) ?? null;
}

export async function deleteSocialLink(id: number): Promise<void> {
  await pool.query(`DELETE FROM social_links WHERE id = $1`, [id]);
}
