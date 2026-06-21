import type { Metadata } from 'next';
import './globals.css';
import AnalyticsTracker from '@/components/common/AnalyticsTracker';


export const metadata: Metadata = {
  title: 'Alen James',
  description: 'Designer · Developer · AI Specialist',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="0848ea46-9878-4c9b-96d4-ed6ae8cbac09"></script>
      </head>
      <body style={{ overflowX: 'hidden' }}>

        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
