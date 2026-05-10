import { Pool } from 'pg';

declare global {
  // Prevent multiple Pool instances in dev due to hot-reload
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

function createPool(): Pool {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 60000,        // keep idle connections alive longer
    connectionTimeoutMillis: 15000,  // Neon can take ~10s to wake from suspend
  });
}

// Singleton: reuse pool across hot-reloads in dev
const pool: Pool = global._pgPool ?? createPool();

if (process.env.NODE_ENV !== 'production') {
  global._pgPool = pool;
}

/**
 * Execute a query with automatic retry on connection timeout.
 * Neon's serverless DB auto-suspends; the first query after inactivity
 * can fail while it wakes up. This retries once to handle that.
 */
export async function queryWithRetry<T = any>(
  sql: string,
  params?: any[],
  retries = 2
): Promise<{ rows: T[] }> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await pool.query(sql, params);
      return result as { rows: T[] };
    } catch (err: any) {
      const isTimeout =
        err?.message?.includes('timeout') ||
        err?.message?.includes('Connection terminated') ||
        err?.code === 'ECONNRESET' ||
        err?.code === 'ETIMEDOUT';

      if (isTimeout && attempt < retries) {
        console.warn(`[DB] Connection timeout on attempt ${attempt}, retrying in 2s…`);
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }
      throw err;
    }
  }
  throw new Error('DB query failed after retries');
}

export default pool;
