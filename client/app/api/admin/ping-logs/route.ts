import { NextResponse } from "next/server";
import { queryWithRetry } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { rows } = await queryWithRetry<{
      id: number;
      status: string;
      latency_ms: number;
      message: string;
      pinged_at: string;
    }>(
      `SELECT id, status, latency_ms, message, pinged_at
       FROM ping_logs
       ORDER BY pinged_at DESC
       LIMIT 100`
    );

    // Summary stats
    const total = rows.length;
    const successful = rows.filter((r) => r.status === "ok").length;
    const failed = total - successful;
    const uptime =
      total > 0 ? Math.round((successful / total) * 100) : 100;
    const avgLatency =
      total > 0
        ? Math.round(rows.reduce((s, r) => s + r.latency_ms, 0) / total)
        : 0;
    const lastPing = rows[0]?.pinged_at ?? null;

    return NextResponse.json({
      logs: rows,
      stats: { total, successful, failed, uptime, avgLatency, lastPing },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
