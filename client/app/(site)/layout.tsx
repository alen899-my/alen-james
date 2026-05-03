import { Geist_Mono, Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Preloader from '@/components/ui/Preloader';
import SmoothScrolling from '@/components/layout/SmoothScrolling';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const fontMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn('antialiased', fontMono.variable, 'font-sans', inter.variable)}>
      <ThemeProvider>
        <SmoothScrolling>
          <Preloader />
          <Navbar />
          {children}
        </SmoothScrolling>
      </ThemeProvider>
    </div>
  );
}

