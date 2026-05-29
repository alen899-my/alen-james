'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import posthog from 'posthog-js';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track public site routes, not admin pages or API routes
    if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
      // 1. Existing local DB tracking (removed due to high CPU load)
      
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
