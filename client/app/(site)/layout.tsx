import { Geist_Mono, Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Preloader from '@/components/ui/Preloader';

import SmoothScrolling from '@/components/layout/SmoothScrolling';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const fontMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });

import { getAllSocialLinks } from '@/lib/admin/models/social_links.model';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const socialLinks = await getAllSocialLinks();

  return (
    <div className={cn('antialiased', fontMono.variable, 'font-sans', inter.variable)}>
      <ThemeProvider>
        <SmoothScrolling>
          <Preloader />
          <Navbar socialLinks={socialLinks} />
          {children}
        </SmoothScrolling>
      </ThemeProvider>
    </div>
  );
}

