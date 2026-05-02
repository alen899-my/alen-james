import pool from '@/lib/db';

export interface MediaGallery {
  id: number;
  title: string;
  description: string | null;
  media_date: string | null;
  images: string[];
  videos: string[];
  created_at: string;
  updated_at: string;
}

export type MediaGalleryInput = Omit<MediaGallery, 'id' | 'created_at' | 'updated_at'>;

export async function createMediaGalleryTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS media_gallery (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      media_date VARCHAR(255),
      images JSONB DEFAULT '[]'::jsonb,
      videos JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    DROP TRIGGER IF EXISTS set_media_gallery_updated_at ON media_gallery;
    CREATE TRIGGER set_media_gallery_updated_at
      BEFORE UPDATE ON media_gallery
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function getAllMediaGallery(): Promise<MediaGallery[]> {
  const { rows } = await pool.query(
    `SELECT * FROM media_gallery ORDER BY created_at DESC`
  );
  return rows as MediaGallery[];
}

export async function getMediaGalleryById(id: number): Promise<MediaGallery | null> {
  const { rows } = await pool.query(
    `SELECT * FROM media_gallery WHERE id = $1 LIMIT 1`,
    [id]
  );
  return (rows[0] as MediaGallery) ?? null;
}

export async function createMediaGallery(data: MediaGalleryInput): Promise<MediaGallery> {
  const { rows } = await pool.query(
    `INSERT INTO media_gallery (title, description, media_date, images, videos)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      data.title,
      data.description,
      data.media_date,
      JSON.stringify(data.images || []),
      JSON.stringify(data.videos || [])
    ]
  );
  return rows[0] as MediaGallery;
}

export async function updateMediaGallery(id: number, data: Partial<MediaGalleryInput>): Promise<MediaGallery | null> {
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

  if (setClauses.length === 0) return getMediaGalleryById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE media_gallery SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return (rows[0] as MediaGallery) ?? null;
}

export async function deleteMediaGallery(id: number): Promise<void> {
  await pool.query(`DELETE FROM media_gallery WHERE id = $1`, [id]);
}
