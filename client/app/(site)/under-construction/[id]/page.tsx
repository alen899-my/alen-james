import { getConstructionById, getActiveConstructions } from '@/lib/admin/models/constructions.model';
import { getAllSocialLinks } from '@/lib/admin/models/social_links.model';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import CallMeBaby from '@/components/home/CallMeBaby';
import { ArrowLeft, HardHat, Clock, Hammer, CheckCircle2 } from 'lucide-react';

export const revalidate = 300;

export async function generateStaticParams() {
  const items = await getActiveConstructions();
  return items.map(i => ({ id: i.id.toString() }));
}

const PHASE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Planning:     { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' },
  Design:       { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' },
  Development:  { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  Testing:      { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
  Beta:         { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
  'Almost Done':{ bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
};

export default async function ConstructionDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const [item, socialLinks] = await Promise.all([
    getConstructionById(parseInt(id)),
    getAllSocialLinks(),
  ]);

  if (!item) notFound();

  const phase = PHASE_COLORS[item.construction_phase || ''] || PHASE_COLORS.Planning;
  const featureLines = item.features
    ? item.features.split('\n').map(l => l.trim()).filter(Boolean)
    : [];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">

      {/* ── TOP NAV BAR ── */}
      <div className="px-6 md:px-14 py-4 max-w-7xl mx-auto">
        <Link href="/under-construction"
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Workshop
        </Link>
      </div>

      {/* ── HERO ── */}
      <section className="px-6 md:px-14 pb-12 max-w-7xl mx-auto">
        {/* Breadcrumb label */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm font-black uppercase tracking-[0.5em] text-[var(--muted-foreground)]">
            {item.is_upcoming ? 'Upcoming Project' : 'Under Construction'}
          </span>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest border"
            style={{ background: phase.bg, color: phase.text, borderColor: phase.border, borderRadius: 0 }}
          >
            {item.is_upcoming ? <Clock size={9} /> : <HardHat size={9} />}
            {item.is_upcoming ? 'Coming Soon' : item.construction_phase || 'Planning'}
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6 max-w-5xl"
          style={{ fontFamily: '"Patrick Hand SC", cursive' }}
        >
          {item.name}
        </h1>

        {item.tagline && (
          <p className="text-xl md:text-2xl text-[var(--muted-foreground)] font-bold max-w-2xl leading-snug">
            {item.tagline}
          </p>
        )}

        {/* Stacks */}
        {item.stacks?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {item.stacks.map(s => (
              <span key={s}
                className="px-3 py-1 text-xs font-black uppercase tracking-widest border"
                style={{ color: '#1084a2', borderColor: '#1084a2', background: 'rgba(16,132,162,0.06)', borderRadius: 0 }}>
                {s}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ── HERO IMAGE ── */}
      <section className="px-6 md:px-14 max-w-7xl mx-auto">
        <div className="relative w-full aspect-video overflow-hidden">
          {item.main_image ? (
            <>
              <img src={item.main_image} alt={item.name}
                className={`w-full h-full object-cover ${item.is_upcoming ? 'grayscale' : ''}`} />

              {/* Upcoming overlay */}
              {item.is_upcoming && (
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.45)' }}>
                  <div className="flex flex-col items-center gap-3 text-white text-center">
                    <Clock size={48} className="opacity-80" />
                    <p className="text-2xl font-black uppercase tracking-widest">Coming Soon</p>
                  </div>
                </div>
              )}

              {/* Construction hazard ribbon overlay */}
              {!item.is_upcoming && (
                <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden pointer-events-none"
                  style={{
                    background: 'repeating-linear-gradient(-45deg, #f59e0b 0px, #f59e0b 10px, #1a1a1a 10px, #1a1a1a 20px)',
                    opacity: 0.7,
                  }} />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1084a2 0%, #0b5c73 100%)' }}>
              <Hammer size={64} className="text-white/30" />
            </div>
          )}
        </div>
      </section>

      {/* ── CONTENT GRID ── */}
      {(item.project_idea || featureLines.length > 0) && (
        <section className="px-6 md:px-14 py-20 max-w-7xl mx-auto border-t border-[var(--border)] mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">

            {/* Left — Project Idea */}
            <div className="space-y-8">
              <h2 className="text-sm font-black uppercase tracking-[0.4em] text-[#1084a2]">
                The Idea
              </h2>
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight"
                style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                What is it?
              </h3>
              <div className="text-lg leading-relaxed text-[var(--muted-foreground)] font-medium">
                {item.project_idea || 'Details coming soon…'}
              </div>
            </div>

            {/* Right — Features */}
            <div className="space-y-8">
              <h2 className="text-sm font-black uppercase tracking-[0.4em] text-[#1084a2]">
                Planned Features
              </h2>
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight"
                style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                What's inside?
              </h3>
              {featureLines.length > 0 ? (
                <ul className="space-y-3">
                  {featureLines.map((line, i) => (
                    <li key={i} className="flex items-start gap-3 text-[var(--muted-foreground)] font-medium">
                      <CheckCircle2 size={18} className="text-[#1084a2] mt-0.5 shrink-0" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-lg text-[var(--muted-foreground)] font-medium">
                  Feature list coming soon…
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <CallMeBaby />

      {/* ── FOOTER ── */}
      <Footer socialLinks={socialLinks} />
    </main>
  );
}
