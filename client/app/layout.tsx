import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alen James',
  description: 'Designer · Developer · AI Specialist',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ overflowX: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
