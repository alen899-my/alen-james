import { NextResponse } from "next/server";
import { queryWithRetry } from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";

async function ensureAnalyticsTable() {
  await queryWithRetry(`
    CREATE TABLE IF NOT EXISTS page_views (
      id          SERIAL PRIMARY KEY,
      path        VARCHAR(255) NOT NULL,
      session_id  VARCHAR(255) NOT NULL,
      visited_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_page_views_visited_at ON page_views(visited_at);
  `);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { path } = body;

    if (!path) {
      return NextResponse.json({ error: "Path required" }, { status: 400 });
    }

    // Generate a simple anonymous session ID using cookies
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("aj_anon_session")?.value;

    if (!sessionId) {
      sessionId = crypto.randomBytes(16).toString("hex");
      // Note: We can't easily set cookies in an API route if we're also reading them without some boilerplate,
      // but let's just use it or generate it. To set the cookie, we attach it to the response.
    }

    await ensureAnalyticsTable();
    await queryWithRetry(
      `INSERT INTO page_views (path, session_id) VALUES ($1, $2)`,
      [path, sessionId]
    );

    const response = NextResponse.json({ success: true });
    
    // Set cookie if it didn't exist (expires in 1 day to count daily unique visitors)
    if (!cookieStore.get("aj_anon_session")) {
      response.cookies.set("aj_anon_session", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });
    }

    return response;
  } catch (err: any) {
    console.error("[analytics] Failed to track view:", err);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
