import { NextResponse } from "next/server";
import { queryWithRetry } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Make sure table exists
    await queryWithRetry(`
      CREATE TABLE IF NOT EXISTS page_views (
        id          SERIAL PRIMARY KEY,
        path        VARCHAR(255) NOT NULL,
        session_id  VARCHAR(255) NOT NULL,
        visited_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `);

    // Fetch stats
    const [
      activeUsersRes,
      pageViewsRes,
      engagementRes,
      trafficHourlyRes,
      topSourcesRes
    ] = await Promise.all([
      // Active users (unique sessions in last 5 minutes)
      queryWithRetry(`SELECT COUNT(DISTINCT session_id) as active_users FROM page_views WHERE visited_at > NOW() - INTERVAL '5 minutes'`),
      
      // Page views (last 30 days)
      queryWithRetry(`SELECT COUNT(*) as total_views FROM page_views WHERE visited_at > NOW() - INTERVAL '30 days'`),
      
      // Unique visitors (last 30 days) for engagement calc
      queryWithRetry(`SELECT COUNT(DISTINCT session_id) as unique_visitors FROM page_views WHERE visited_at > NOW() - INTERVAL '30 days'`),
      
      // Hourly traffic last 24 hours (for sparkline)
      queryWithRetry(`
        WITH hours AS (
            SELECT generate_series(
                date_trunc('hour', NOW() - INTERVAL '23 hours'),
                date_trunc('hour', NOW()),
                '1 hour'::interval
            ) as hour
        )
        SELECT h.hour, COUNT(pv.id) as visits
        FROM hours h
        LEFT JOIN page_views pv ON date_trunc('hour', pv.visited_at) = h.hour
        GROUP BY h.hour
        ORDER BY h.hour ASC
      `),

      // Top paths (mocking 'sources' as top paths for now since we don't track referrers yet)
      queryWithRetry(`
        SELECT path as name, COUNT(*) as val 
        FROM page_views 
        WHERE visited_at > NOW() - INTERVAL '7 days'
        GROUP BY path 
        ORDER BY val DESC 
        LIMIT 4
      `)
    ]);

    const activeUsers = parseInt(activeUsersRes.rows[0].active_users || "0", 10);
    const totalViews = parseInt(pageViewsRes.rows[0].total_views || "0", 10);
    const uniqueVisitors = parseInt(engagementRes.rows[0].unique_visitors || "0", 10);
    
    // Engagement rough calc (views per visitor * 10, capped at 100)
    const engagementScore = uniqueVisitors > 0 ? Math.min(Math.round((totalViews / uniqueVisitors) * 30), 100) : 0;

    const hourlyTraffic = trafficHourlyRes.rows.map(r => parseInt(r.visits, 10));
    
    const colors = ['#1084a2', '#3b82f6', '#8b5cf6', '#14b8a6'];
    const totalRecentViews = topSourcesRes.rows.reduce((sum, r) => sum + parseInt(r.val, 10), 0);
    const topPaths = topSourcesRes.rows.map((r, i) => ({
      name: r.name === '/' ? 'Home / Direct' : r.name,
      val: totalRecentViews > 0 ? Math.round((parseInt(r.val, 10) / totalRecentViews) * 100) : 0,
      color: colors[i % colors.length]
    }));

    return NextResponse.json({
      activeUsers,
      totalViews,
      engagementScore,
      hourlyTraffic,
      topPaths
    });
  } catch (err: any) {
    console.error("Failed to fetch analytics", err);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
