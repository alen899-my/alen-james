import { queryWithRetry } from './client/lib/db';

async function checkTraffic() {
  try {
    const tableCheck = await queryWithRetry(`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'page_views')`);
    console.log('Table page_views exists:', tableCheck.rows[0].exists);

    if (tableCheck.rows[0].exists) {
      const count = await queryWithRetry(`SELECT COUNT(*) FROM page_views`);
      console.log('Total page views:', count.rows[0].count);

      const recent = await queryWithRetry(`SELECT * FROM page_views ORDER BY visited_at DESC LIMIT 5`);
      console.log('Recent page views:', recent.rows);

      const hourly = await queryWithRetry(`
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
      `);
      console.log('Hourly data points:', hourly.rows.length);
      console.log('Sample hourly data:', hourly.rows.slice(0, 3));
    }
  } catch (err) {
    console.error('Error checking traffic:', err);
  }
}

checkTraffic();
