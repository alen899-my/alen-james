import { NextResponse } from "next/server";
import { queryWithRetry } from "@/lib/db";

// Ensure the ping_logs table exists on first call
async function ensureTable() {
  await queryWithRetry(`
    CREATE TABLE IF NOT EXISTS ping_logs (
      id          SERIAL PRIMARY KEY,
      status      VARCHAR(10)  NOT NULL,  -- 'ok' | 'error'
      latency_ms  INTEGER      NOT NULL,
      message     TEXT,
      pinged_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);
}

export async function GET() {
  const start = Date.now();
  let status: "ok" | "error" = "ok";
  let message = "Server and DB are alive 🟢";

  try {
    await ensureTable();
    await queryWithRetry("SELECT 1");
  } catch (err: any) {
    status = "error";
    message = `DB unreachable: ${err?.message ?? "unknown error"}`;
    console.error("[ping] DB warm-up failed:", err?.message);
  }

  const latency_ms = Date.now() - start;

  // Write log (best-effort — don't fail the response if this errors)
  try {
    await queryWithRetry(
      `INSERT INTO ping_logs (status, latency_ms, message) VALUES ($1, $2, $3)`,
      [status, latency_ms, message]
    );
  } catch (logErr) {
    console.error("[ping] Failed to write log:", logErr);
  }

  return NextResponse.json(
    { status, message, latency_ms, timestamp: new Date().toISOString() },
    { status: status === "ok" ? 200 : 503 }
  );
}
