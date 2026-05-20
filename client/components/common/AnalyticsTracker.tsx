'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import posthog from 'posthog-js';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track public site routes, not admin pages or API routes
    if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
      // 1. Existing local DB tracking
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname }),
      }).catch((err) => console.error('Failed to track view:', err));

      // 2. PostHog Event Tracking
      try {
        posthog.capture('page_view', {
          path: pathname,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Failed to capture PostHog page_view:', err);
      }
    }
  }, [pathname]);

  return null;
}
