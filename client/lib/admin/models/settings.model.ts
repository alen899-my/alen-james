import pool from '@/lib/db';

export interface SiteSettings {
  id: number;
  site_name: string;
  site_description: string | null;
  site_tagline: string | null;
  site_url: string | null;
  contact_email: string | null;
  meta_keywords: string | null;
  logo_type: 'text' | 'image';
  logo_text: string | null;
  logo_image_url: string | null;
  color_primary: string;
  color_accent: string;
  color_background: string;
  color_text: string;
  social_github: string | null;
  social_linkedin: string | null;
  social_instagram: string | null;
  social_twitter: string | null;
  maintenance_mode: boolean;
  maintenance_message: string | null;
  diary_global_password: string | null;
  people_global_password: string | null;
  travel_global_password: string | null;
  regret_global_password: string | null;
  created_at: string;
  updated_at: string;
}

// ── DDL ───────────────────────────────────────────────────────────────────────

export async function createSiteSettingsTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id                  SERIAL PRIMARY KEY,
      site_name           VARCHAR(255)  NOT NULL DEFAULT 'Alen James',
      site_description    TEXT,
      site_tagline        VARCHAR(500),
      site_url            VARCHAR(500),
      contact_email       VARCHAR(255),
      meta_keywords       TEXT,
      logo_type           VARCHAR(10)   NOT NULL DEFAULT 'text' CHECK (logo_type IN ('text','image')),
      logo_text           VARCHAR(255)  DEFAULT 'Alen James',
      logo_image_url      TEXT,
      color_primary       VARCHAR(50)   DEFAULT '#1084a2',
      color_accent        VARCHAR(50)   DEFAULT '#1084a2',
      color_background    VARCHAR(50)   DEFAULT '#fdf8e1',
      color_text          VARCHAR(50)   DEFAULT '#2d2a21',
      social_github       VARCHAR(500),
      social_linkedin     VARCHAR(500),
      social_instagram    VARCHAR(500),
      social_twitter      VARCHAR(500),
      maintenance_mode    BOOLEAN       DEFAULT FALSE,
      maintenance_message TEXT          DEFAULT 'We''ll be back soon!',
      diary_global_password VARCHAR(255),
      people_global_password VARCHAR(255),
      travel_global_password VARCHAR(255),
      regret_global_password VARCHAR(255),
      created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
      updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );

    CREATE UNIQUE INDEX IF NOT EXISTS site_settings_singleton ON site_settings ((TRUE));

    DROP TRIGGER IF EXISTS set_settings_updated_at ON site_settings;
    CREATE TRIGGER set_settings_updated_at
      BEFORE UPDATE ON site_settings
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function seedDefaultSettings(): Promise<void> {
  const { rows } = await pool.query('SELECT id FROM site_settings LIMIT 1');
  if (rows.length > 0) return;
  await pool.query(`
    INSERT INTO site_settings (site_name, logo_type, logo_text)
    VALUES ('Alen James', 'text', 'Alen James')
    ON CONFLICT DO NOTHING
  `);
  console.log('✅ Default site settings seeded');
}

// ── Queries ───────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<SiteSettings | null> {
  const { rows } = await pool.query('SELECT * FROM site_settings LIMIT 1');
  return (rows[0] as SiteSettings) ?? null;
}

export async function updateSettings(fields: Partial<Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>>): Promise<SiteSettings> {
  const keys = Object.keys(fields);
  if (keys.length === 0) throw new Error('No fields to update');
  const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
  const values = Object.values(fields);
  const { rows } = await pool.query(
    `UPDATE site_settings SET ${setClause}
     WHERE id = (SELECT id FROM site_settings LIMIT 1)
     RETURNING *`,
    values
  );
  return rows[0] as SiteSettings;
}
