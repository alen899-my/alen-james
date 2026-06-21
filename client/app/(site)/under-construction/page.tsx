import { getActiveConstructions } from '@/lib/admin/models/constructions.model';
import { getAllSocialLinks } from '@/lib/admin/models/social_links.model';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { HardHat, Clock, ChevronRight, Hammer } from 'lucide-react';

export const metadata = {
  title: 'Under Construction — Alen James',
  description: 'Projects currently being built and upcoming ideas from Alen James.',
};

export const revalidate = 300;

const PHASE_COLORS: Record<string, { bg: string; text: string }> = {
  Planning:     { bg: '#f3f4f6', text: '#6b7280' },
  Design:       { bg: '#f5f3ff', text: '#7c3aed' },
  Development:  { bg: '#eff6ff', text: '#1d4ed8' },
  Testing:      { bg: '#fffbeb', text: '#d97706' },
  Beta:         { bg: '#ecfdf5', text: '#059669' },
  'Almost Done':{ bg: '#f0fdf4', text: '#16a34a' },
};

export default async function UnderConstructionPage() {
  const [items, socialLinks] = await Promise.all([
    getActiveConstructions(),
    getAllSocialLinks(),
  ]);

  const current  = items.filter(i => !i.is_upcoming);
  const upcoming = items.filter(i => i.is_upcoming);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24">

      {/* ── HERO HEADER ── */}
      <section className="px-6 md:px-14 pb-16 max-w-7xl mx-auto">
        <div className="mb-4">
          <span className="text-sm font-black uppercase tracking-[0.5em] text-[var(--muted-foreground)]">
            The Workshop
          </span>
        </div>

        <h1
          className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6 max-w-5xl"
          style={{ fontFamily: '"Patrick Hand SC", cursive' }}
        >
          Under<br />Construction
        </h1>

        <p className="text-lg text-[var(--muted-foreground)] max-w-xl font-medium leading-relaxed">
          A live look at what's being built — current projects in progress and
          ideas coming soon to the workshop.
        </p>

        {/* Stats bar */}
        <div className="flex items-center gap-8 mt-10 pt-10 border-t border-[var(--border)]">
          <div>
            <p className="text-3xl font-black text-[var(--foreground)]">{current.length}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mt-0.5">Building Now</p>
          </div>
          <div className="w-px h-10 bg-[var(--border)]" />
          <div>
            <p className="text-3xl font-black text-[var(--foreground)]">{upcoming.length}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mt-0.5">Coming Soon</p>
          </div>
        </div>
      </section>

      {/* ── CURRENTLY BUILDING ── */}
      {current.length > 0 && (
        <section className="px-6 md:px-14 py-16 max-w-7xl mx-auto border-t border-[var(--border)]">
          <div className="flex items-center gap-3 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1084a2] animate-pulse" />
              <span className="text-sm font-black uppercase tracking-[0.4em] text-[#1084a2]">
                Currently Building
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {current.map(item => {
              const phase = PHASE_COLORS[item.construction_phase || ''] || PHASE_COLORS.Planning;
              return (
                <Link
                  key={item.id}
                  href={`/under-construction/${item.id}`}
                  className="group relative flex flex-col overflow-hidden border border-[var(--border)] bg-[var(--card)] hover:border-[#1084a2]/40 hover:shadow-xl transition-all duration-300"
                  style={{ borderRadius: 0 }}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-[var(--muted)]">
                    {item.main_image ? (
                      <img src={item.main_image} alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #1084a2 0%, #0b5c73 100%)' }}>
                        <Hammer size={40} className="text-white/50" />
                      </div>
                    )}

                    {/* Phase badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest"
                      style={{ background: phase.bg, color: phase.text, borderRadius: 0 }}>
                      {item.construction_phase || 'Planning'}
                    </div>

                    {/* Hover overlay arrow */}
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                      <ChevronRight size={16} className="text-black" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-2 p-5 flex-1">
                    <h2 className="text-lg font-black text-[var(--foreground)] uppercase tracking-tight"
                      style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                      {item.name}
                    </h2>
                    {item.tagline && (
                      <p className="text-sm text-[var(--muted-foreground)] font-medium line-clamp-2">
                        {item.tagline}
                      </p>
                    )}

                    {/* Stacks */}
                    {item.stacks?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
                        {item.stacks.slice(0, 4).map(s => (
                          <span key={s}
                            className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border"
                            style={{ color: '#1084a2', borderColor: '#1084a2', background: 'rgba(16,132,162,0.06)', borderRadius: 0 }}>
                            {s}
                          </span>
                        ))}
                        {item.stacks.length > 4 && (
                          <span className="px-2 py-0.5 text-[10px] font-bold text-[var(--muted-foreground)]">
                            +{item.stacks.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom accent line on hover */}
                  <div className="h-[2px] w-0 group-hover:w-full bg-[#1084a2] transition-all duration-500" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── UPCOMING ── */}
      {upcoming.length > 0 && (
        <section className="px-6 md:px-14 py-16 max-w-7xl mx-auto border-t border-[var(--border)]">
          <div className="flex items-center gap-3 mb-12">
            <Clock size={16} className="text-amber-500" />
            <span className="text-sm font-black uppercase tracking-[0.4em] text-amber-500">
              Coming Soon
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map(item => (
              <Link
                key={item.id}
                href={`/under-construction/${item.id}`}
                className="group relative flex flex-col overflow-hidden border border-[var(--border)] bg-[var(--card)] hover:border-amber-400/40 hover:shadow-xl transition-all duration-300 opacity-80 hover:opacity-100"
                style={{ borderRadius: 0 }}
              >
                {/* Image — desaturated */}
                <div className="relative aspect-[16/9] overflow-hidden bg-[var(--muted)]">
                  {item.main_image ? (
                    <img src={item.main_image} alt={item.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)' }}>
                      <Clock size={40} className="text-white/30" />
                    </div>
                  )}

                  {/* Upcoming badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest"
                    style={{ background: '#fffbeb', color: '#d97706', borderRadius: 0 }}>
                    ⏳ Upcoming
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 p-5 flex-1">
                  <h2 className="text-lg font-black text-[var(--foreground)] uppercase tracking-tight"
                    style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                    {item.name}
                  </h2>
                  {item.tagline && (
                    <p className="text-sm text-[var(--muted-foreground)] font-medium line-clamp-2">
                      {item.tagline}
                    </p>
                  )}

                  {item.stacks?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
                      {item.stacks.slice(0, 4).map(s => (
                        <span key={s}
                          className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-amber-300 text-amber-600"
                          style={{ background: 'rgba(245,158,11,0.06)', borderRadius: 0 }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-[2px] w-0 group-hover:w-full bg-amber-400 transition-all duration-500" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <section className="px-6 md:px-14 py-32 max-w-7xl mx-auto flex flex-col items-center text-center gap-4">
          <HardHat size={48} className="text-[var(--muted-foreground)] opacity-30" />
          <p className="text-xl font-black text-[var(--muted-foreground)] uppercase tracking-widest">
            Nothing here yet
          </p>
          <p className="text-sm text-[var(--muted-foreground)] opacity-60">
            Check back soon — projects are being added.
          </p>
        </section>
      )}

      <Footer socialLinks={socialLinks} />
    </main>
  );
}
