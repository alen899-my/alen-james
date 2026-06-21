import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'admin' | 'superadmin';
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminWithPassword extends Admin {
  password: string;
}

// ── DDL ──────────────────────────────────────────────────────────────────────

export async function createAdminTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(255)  NOT NULL,
      email       VARCHAR(255)  NOT NULL UNIQUE,
      phone       VARCHAR(30),
      password    TEXT          NOT NULL,
      role        VARCHAR(20)   NOT NULL DEFAULT 'admin'
                    CHECK (role IN ('admin', 'superadmin')),
      is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
      last_login  TIMESTAMPTZ,
      created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );

    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS set_admin_updated_at ON admins;
    CREATE TRIGGER set_admin_updated_at
      BEFORE UPDATE ON admins
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);
}

// ── Seed ─────────────────────────────────────────────────────────────────────



// ── Queries ───────────────────────────────────────────────────────────────────

export async function findAdminByEmail(email: string): Promise<AdminWithPassword | null> {
  const { rows } = await pool.query('SELECT * FROM admins WHERE email = $1 LIMIT 1', [email]);
  return (rows[0] as AdminWithPassword) ?? null;
}

export async function findAdminById(id: number): Promise<Admin | null> {
  const { rows } = await pool.query(
    `SELECT id, name, email, phone, role, is_active, last_login, created_at, updated_at
     FROM admins WHERE id = $1 LIMIT 1`,
    [id]
  );
  return (rows[0] as Admin) ?? null;
}

export async function getAllAdmins(): Promise<Admin[]> {
  const { rows } = await pool.query(
    `SELECT id, name, email, phone, role, is_active, last_login, created_at, updated_at
     FROM admins ORDER BY created_at DESC`
  );
  return rows as Admin[];
}

export async function createAdmin(data: {
  name: string; email: string; phone?: string; password: string; role?: 'admin' | 'superadmin';
}): Promise<Admin> {
  const hash = await bcrypt.hash(data.password, 12);
  const { rows } = await pool.query(
    `INSERT INTO admins (name, email, phone, password, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, role, is_active, created_at, updated_at`,
    [data.name, data.email, data.phone ?? null, hash, data.role ?? 'admin']
  );
  return rows[0] as Admin;
}

export async function updateAdminStatus(id: number, is_active: boolean): Promise<void> {
  await pool.query('UPDATE admins SET is_active = $1 WHERE id = $2', [is_active, id]);
}

export async function deleteAdmin(id: number): Promise<void> {
  await pool.query('DELETE FROM admins WHERE id = $1', [id]);
}

export async function updateLastLogin(id: number): Promise<void> {
  await pool.query('UPDATE admins SET last_login = NOW() WHERE id = $1', [id]);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function changeAdminPassword(id: number, newPassword: string): Promise<void> {
  const hash = await bcrypt.hash(newPassword, 12);
  await pool.query('UPDATE admins SET password = $1 WHERE id = $2', [hash, id]);
}

export async function updateAdminProfile(id: number, fields: { name?: string; phone?: string }): Promise<Admin> {
  const { rows } = await pool.query(
    `UPDATE admins SET name = COALESCE($1, name), phone = COALESCE($2, phone)
     WHERE id = $3
     RETURNING id, name, email, phone, role, is_active, last_login, created_at, updated_at`,
    [fields.name ?? null, fields.phone ?? null, id]
  );
  return rows[0] as Admin;
}
