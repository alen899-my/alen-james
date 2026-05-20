import { getExperienceById, getAllExperiences } from '@/lib/admin/models/experiences.model';
import { getAllSocialLinks } from '@/lib/admin/models/social_links.model';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import CallMeBaby from '@/components/home/CallMeBaby';
import Footer from '@/components/layout/Footer';
import MediaCarousel from '@/components/home/MediaCarousel';
import { RollingEntrance } from '@/components/work/WorkDetailWrapper';

interface PageProps {
    params: { id: string };
}

export const revalidate = 300; // Cache page for 5 minutes (ISR)

export async function generateStaticParams() {
    const experiences = await getAllExperiences();
    return experiences.map((exp) => ({
        id: exp.id.toString(),
    }));
}

export default async function JobDetailPage({ params }: PageProps) {
    const { id } = await params;
    const jobId = parseInt(id);

    const [job, allExperiences, socialLinks] = await Promise.all([
        getExperienceById(jobId),
        getAllExperiences(),
        getAllSocialLinks()
    ]);

    if (!job) notFound();

    // Filter out current job and take 2 for related
    const relatedJobs = allExperiences
        .filter(exp => exp.id !== jobId)
        .slice(0, 2);

    const dateRange = [job.from_date, job.to_date || 'Present'].filter(Boolean).join(' – ');
    const year = job.from_date ? (job.from_date.includes('-') || job.from_date.includes('/') ? new Date(job.from_date).getFullYear().toString() : job.from_date.match(/\d{4}/)?.[0] || '2025') : '2025';

    return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">
            <section className="px-6 md:px-14 pb-12 max-w-7xl mx-auto">
                <div className="mb-12">
                    <Link 
                        href="/experiences" 
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Journey</span>
                    </Link>
                </div>

                <RollingEntrance>
                    <div className="mb-4">
                        <span className="text-sm font-black uppercase tracking-[0.5em] text-[#1084a2]">
                            {job.location || 'Professional Role'}
                        </span>
                    </div>
                    
                    <h1 
                        className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8 max-w-5xl"
                        style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                    >
                        {job.job_title}
                    </h1>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 py-10 border-y border-[var(--border)]">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Location</p>
                            <p className="font-bold">{job.location || 'Various'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Year</p>
                            <p className="font-bold">{year}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Period</p>
                            <p className="font-bold text-xs">{dateRange}</p>
                        </div>
                    </div>
                </RollingEntrance>
            </section>

            {/* ── WHAT I HAVE DONE ── */}
            <RollingEntrance>
                <section className="px-6 md:px-14 py-12 max-w-5xl mx-auto">
                    <h2 
                        className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-[#1084a2] mb-12"
                        style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                    >
                        What I Have Done
                    </h2>
                    <div className="text-xl md:text-2xl font-medium leading-relaxed text-[var(--foreground)]/90">
                        {job.description ? (
                            <div className="space-y-4">
                                {job.description.split(/[•\n]/).map((point, i) => {
                                    const text = point.trim();
                                    if (!text) return null;
                                    return (
                                        <p key={i} className="relative pl-6">
                                            <span className="absolute left-0 top-3 w-3 h-[2px] bg-[var(--accent)]/50 rounded-full" />
                                            {text}
                                        </p>
                                    );
                                })}
                            </div>
                        ) : (
                            'Dedicated to excellence and delivering impactful results through professional expertise and innovative thinking.'
                        )}
                    </div>
                </section>
            </RollingEntrance>

            {/* ── FOCUSED MEDIA CAROUSEL ── */}
            {((job.images && job.images.length > 0) || (job.videos && job.videos.length > 0)) && (
                <MediaCarousel media={[...(job.images || []), ...(job.videos || [])]} title={job.job_title} />
            )}

            {/* ── CTA ── */}
            <div className="py-10">
                <CallMeBaby />
            </div>

            {/* ── MORE EXPERIENCES ── */}
            {relatedJobs.length > 0 && (
                <section className="px-6 md:px-14 py-24 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
                        <div>
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                                The journey<br />continues...
                            </h2>
                        </div>
                        <Link href="/experiences" className="px-10 py-5 rounded-full bg-[#1084a2] text-white font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl">
                            Explore Full Journey
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {relatedJobs.map((rj) => (
                            <Link 
                                href={`/jobs/${rj.id}`} 
                                key={rj.id}
                                className="group relative aspect-video rounded-[2.5rem] overflow-hidden bg-[var(--card)] border border-[var(--border)] transition-all hover:shadow-[0_20px_50px_rgba(16,132,162,0.15)]"
                            >
                                <img src={rj.images?.[0] || ''} alt={rj.job_title} className="w-full h-full object-cover grayscale-0 md:grayscale md:group-hover:grayscale-0 transition-all duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 md:opacity-0 md:group-hover:opacity-90 transition-opacity duration-500" />
                                <div className="absolute bottom-10 left-10 right-10 text-white flex items-end justify-between translate-y-0 md:translate-y-6 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-70">Experience</p>
                                        <h3 className="text-3xl font-black uppercase" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>{rj.job_title}</h3>
                                    </div>
                                    <div className="w-12 h-12 shrink-0 rounded-full bg-white flex items-center justify-center text-black rotate-0 md:-rotate-45 md:group-hover:rotate-0 transition-transform duration-700 shadow-lg">
                                        <ChevronRight size={24} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ── FOOTER ── */}
            <Footer socialLinks={socialLinks} />
        </main>
    );
}

