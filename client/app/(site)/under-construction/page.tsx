import { getActiveConstructions } from '@/lib/admin/models/constructions.model';
import { getAllSocialLinks } from '@/lib/admin/models/social_links.model';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { HardHat, Clock, Hammer } from 'lucide-react';
import ConstructionCard3D from '@/components/under-construction/ConstructionCard3D';
import ConstructionBanner from '@/components/common/ConstructionBanner';

export const metadata = {
  title: 'Dev Workshop — Alen James',
  description: 'Projects currently being built and upcoming ideas from Alen James.',
};

export const revalidate = 300;

// Animated Indicator Light
const WarningLight = ({ color = 'amber' }: { color?: 'amber' | 'blue' }) => {
  const glowBg = color === 'blue' ? 'bg-blue-400' : 'bg-amber-400';
  const bulbBg = color === 'blue' ? 'bg-blue-500 border-blue-600' : 'bg-amber-500 border-amber-600';
  return (
    <span className="relative flex h-3 w-3 shrink-0">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${glowBg}`}></span>
      <span className={`relative inline-flex rounded-full h-3 w-3 border shadow-sm ${bulbBg}`}></span>
    </span>
  );
};

// SVG Leaning Ladder Graphic
const LadderSVG = ({ side = 'left' }: { side?: 'left' | 'right' }) => {
  const isLeft = side === 'left';
  const positionClass = isLeft 
    ? "left-6 md:left-[15%] top-24 md:top-[-10%] rotate-0 md:rotate-[22deg] origin-top-left" 
    : "right-6 md:right-[15%] top-48 md:top-[10%] rotate-0 md:rotate-[-22deg] origin-top-right";
  
  return (
    <svg 
      viewBox="0 0 120 1200" 
      className={`absolute w-[50px] md:w-[120px] h-[120vh] md:h-[180vh] opacity-[0.06] pointer-events-none z-0 transform text-[var(--foreground)] ${positionClass}`} 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="6"
    >
      {/* Side rails */}
      <line x1="30" y1="0" x2="30" y2="1200" />
      <line x1="90" y1="0" x2="90" y2="1200" />
      {/* Rungs */}
      {Array.from({ length: 30 }).map((_, idx) => (
        <line key={idx} x1="30" y1={40 * idx + 20} x2="90" y2={40 * idx + 20} />
      ))}
    </svg>
  );
};

// SVG Construction Crane Graphic
const CraneSVG = () => (
  <svg 
    width="200" 
    height="180" 
    viewBox="0 0 200 180" 
    className="absolute right-6 top-20 opacity-20 pointer-events-none hidden lg:block text-[var(--foreground)]" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    {/* Mast */}
    <path d="M45,180 L60,35 M60,35 L75,180 M45,180 L75,180 M52.5,110 L67.5,110 M56.25,72.5 L63.75,72.5" />
    <path d="M45,180 L60,145 M75,180 L60,145 M60,145 L52.5,110 M60,145 L67.5,110 M52.5,110 L60,72.5 M67.5,110 L60,72.5 M60,72.5 L60,35" />
    {/* Jib */}
    <line x1="10" y1="35" x2="190" y2="35" />
    <line x1="60" y1="15" x2="60" y2="35" />
    {/* Support lines */}
    <line x1="60" y1="15" x2="10" y2="35" strokeDasharray="3,3" />
    <line x1="60" y1="15" x2="125" y2="35" strokeDasharray="3,3" />
    {/* Counterweight */}
    <rect x="18" y="35" width="15" height="12" fill="currentColor" opacity="0.4" />
    {/* Trolley hook line */}
    <line x1="140" y1="35" x2="140" y2="90" strokeWidth="1" />
    <circle cx="140" cy="90" r="2" fill="currentColor" />
    <path d="M135,92 L145,92 L140,100 Z" fill="currentColor" />
  </svg>
);

export default async function UnderConstructionPage() {
  const [items, socialLinks] = await Promise.all([
    getActiveConstructions(),
    getAllSocialLinks(),
  ]);

  const current  = items.filter(i => !i.is_upcoming);
  const upcoming = items.filter(i => i.is_upcoming);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 relative overflow-hidden">
      {/* Decorative Cranes & Ladders graphics */}
      <CraneSVG />
      <LadderSVG side="left" />

      {/* Floating caution board badge */}
      <div className="absolute right-12 top-52 hidden xl:flex flex-col items-center border-4 border-black bg-amber-400 text-black px-4 py-3 rounded-lg font-black tracking-widest text-[10px] rotate-[8deg] z-10 shadow-xl">
        <HardHat size={24} className="mb-1 text-black" />
        <span>HARD HAT AREA</span>
      </div>


      {/* ── HERO TEXT HEADER ── */}
      <section className="px-6 md:px-14 pb-16 max-w-7xl mx-auto relative z-10">
        <h1
          className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-6 max-w-5xl text-[var(--foreground)]"
          style={{ fontFamily: '"Patrick Hand SC", cursive' }}
        >
          Construction Site
        </h1>

        <p className="text-lg text-[var(--muted-foreground)] max-w-xl font-medium leading-relaxed">
          Welcome to my site, here is my current projects undertaking and future projects.
        </p>
      </section>

      {/* ── ACTIVE BUILD SITE BANNER DIVIDER ── */}
      {current.length > 0 && (
        <div className="w-full my-8">
          <ConstructionBanner themeColor="red" hideCard={true} />
        </div>
      )}

      {/* ── CURRENTLY BUILDING ── */}
      {current.length > 0 && (
        <section className="px-6 md:px-14 py-16 max-w-7xl mx-auto relative z-10">

          <div className="flex flex-row md:grid md:grid-cols-2 gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-6 md:pb-0 scrollbar-none">
            {current.map((item, index) => (
              <div key={item.id} className="w-[85vw] sm:w-[50vw] md:w-auto shrink-0 snap-center md:shrink md:snap-align-none">
                <ConstructionCard3D item={item} index={index} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── UPCOMING BANNER DIVIDER ── */}
      {upcoming.length > 0 && (
        <div className="w-full my-8">
          <ConstructionBanner isUpcoming={true} hideCard={true} />
        </div>
      )}

      {/* ── UPCOMING ── */}
      {upcoming.length > 0 && (
        <section className="px-6 md:px-14 py-16 max-w-7xl mx-auto relative z-10">

          <div className="flex flex-row md:grid md:grid-cols-2 gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-6 md:pb-0 scrollbar-none">
            {upcoming.map((item, index) => (
              <div key={item.id} className="w-[85vw] sm:w-[50vw] md:w-auto shrink-0 snap-center md:shrink md:snap-align-none">
                <ConstructionCard3D item={item} index={index} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <section className="px-6 md:px-14 py-32 max-w-7xl mx-auto flex flex-col items-center text-center gap-4 relative z-10">
          <Hammer size={48} className="text-[var(--muted-foreground)] opacity-30 animate-pulse" />
          <p className="text-xl font-black text-[var(--muted-foreground)] uppercase tracking-widest">
            Site Cleared / Empty Zone
          </p>
          <p className="text-sm text-[var(--muted-foreground)] opacity-60">
            Check back soon — new development layouts are queued for loading.
          </p>
        </section>
      )}

      <Footer socialLinks={socialLinks} />
    </main>
  );
}
