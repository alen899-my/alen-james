'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track public site routes, not admin pages or API routes
    if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname }),
      }).catch((err) => console.error('Failed to track view:', err));
    }
  }, [pathname]);

  return null;
}
