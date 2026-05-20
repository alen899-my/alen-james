import { getWorkById, getRelatedWorks, getAllWorks } from '@/lib/admin/models/works.model';
import { getAllSocialLinks } from '@/lib/admin/models/social_links.model';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ExternalLink, ArrowLeft } from 'lucide-react';
import CallMeBaby from '@/components/home/CallMeBaby';
import Footer from '@/components/layout/Footer';
import MediaCarousel from '@/components/home/MediaCarousel';

interface PageProps {
    params: { id: string };
}

export const revalidate = 300; // Cache page for 5 minutes (ISR)


export async function generateStaticParams() {
    const works = await getAllWorks();
    return works.map((work) => ({
        id: work.id.toString(),
    }));
}

export default async function WorkDetailPage({ params }: PageProps) {
    const { id } = await params;
    const workId = parseInt(id);

    const [work, relatedWorks, socialLinks] = await Promise.all([
        getWorkById(workId),
        getRelatedWorks(workId, 2),
        getAllSocialLinks()
    ]);

    if (!work) notFound();

    return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">
            <section className="px-6 md:px-14 pb-12 max-w-7xl mx-auto">
                <div>
                    <div className="mb-4">
                        <span className="text-sm font-black uppercase tracking-[0.5em] text-[var(--muted-foreground)]">
                            {work.title}
                        </span>
                    </div>
                    
                    <h1 
                        className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8 max-w-5xl"
                        style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                    >
                        {work.subtitle || work.description || 'A stunning project with impressive functionality'}
                    </h1>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 py-10 border-y border-[var(--border)]">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Category</p>
                            <p className="font-bold">{work.category_name || 'Creative'}</p>
                        </div>
                        <div className="space-y-3 col-span-1 md:col-span-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Technologies</p>
                            <div className="flex flex-wrap gap-2">
                                {work.skills?.map((skill) => (
                                    <div 
                                        key={skill.id} 
                                        className="flex items-center gap-1.5 px-2 py-1 bg-[var(--accent)]/5 rounded-lg border border-[var(--accent)]/10"
                                        title={skill.name}
                                    >
                                        {skill.image && (
                                            <img src={skill.image} alt={skill.name} className="w-4 h-4 object-contain" />
                                        )}
                                        <span className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider">{skill.name}</span>
                                    </div>
                                ))}
                                {work.tech_stacks?.map((tech, idx) => (
                                    <div 
                                        key={idx} 
                                        className="flex items-center px-2 py-1 bg-[var(--muted)]/30 rounded-lg border border-[var(--border)]"
                                    >
                                        <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">{tech}</span>
                                    </div>
                                ))}
                                {(!work.skills?.length && !work.tech_stacks?.length) && (
                                    <p className="font-bold">Various</p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Year</p>
                            <p className="font-bold">{work.year || '2025'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Live Site</p>
                            {work.live_link ? (
                                <div className="pt-2">
                                    <a 
                                        href={work.live_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1084a2] text-white font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
                                    >
                                        <span>Visit Link</span>
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            ) : (
                                <p className="font-bold opacity-30 italic">Not available</p>
                            )}
                        </div>
                    </div>

                    {/* Main Hero Image */}
                    <div className="max-w-5xl mx-auto relative w-full aspect-video">
                        {work.main_image ? (
                            <Image 
                                src={work.main_image} 
                                alt={work.title} 
                                fill
                                priority
                                className="object-cover" 
                                sizes="(max-width: 1024px) 100vw, 1024px"
                            />
                        ) : (
                            <div className="w-full h-full bg-[var(--muted)] flex items-center justify-center">
                                <span className="text-[var(--muted-foreground)] font-bold uppercase tracking-widest">No Preview Image</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── INTRODUCTION ── */}
            <section className="px-6 md:px-14 py-16 max-w-4xl mx-auto text-center">
                <h2 className="text-sm font-black uppercase tracking-[0.5em] text-[#1084a2] mb-8">Introduction</h2>
                <div className="text-2xl md:text-4xl font-bold leading-tight text-[var(--foreground)]/80 italic">
                    {work.introduction || work.subtitle || 'Creating a unique digital experience that pushes boundaries.'}
                </div>
            </section>

            {/* ── FOCUSED MEDIA CAROUSEL ── */}
            {((work.screenshots && work.screenshots.length > 0) || (work.additional_videos && work.additional_videos.length > 0)) && (
                <MediaCarousel media={[...(work.screenshots || []), ...(work.additional_videos || [])]} title={work.title} />
            )}

            {/* Helper to clean text for neat paragraphs */}
            {(() => {
                const cleanText = (text: string | null) => {
                    if (!text) return '';
                    return text
                        .split('\n')
                        .map(line => line.trim())
                        .filter(line => line.length > 0)
                        .join(' ');
                };

                const whatIDidClean = cleanText(work.what_i_did || work.description);
                const keyFeaturesClean = cleanText(work.key_features);

                return (
                    <section className="px-6 md:px-14 py-20 max-w-7xl mx-auto border-t border-[var(--border)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                            
                            {/* Left Section: What did I do? */}
                            <div className="space-y-8">
                                <h2 className="text-sm font-black uppercase tracking-[0.4em] text-[#1084a2]">Execution & Role</h2>
                                <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                                    What did I do?
                                </h3>
                                <div className="text-lg leading-relaxed text-[var(--muted-foreground)] font-medium text-justify">
                                    {whatIDidClean || 'Worked on the design and development to ensure a seamless user experience and high-fidelity visuals.'}
                                </div>
                            </div>

                            {/* Right Section: Key Features */}
                            <div className="space-y-8">
                                <h2 className="text-sm font-black uppercase tracking-[0.4em] text-[#1084a2]">Project Highlights</h2>
                                <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                                    Features & Solutions
                                </h3>
                                <div className="text-lg leading-relaxed text-[var(--muted-foreground)] font-medium text-justify">
                                    {keyFeaturesClean || 'Technical brilliance and creative execution across every project milestone.'}
                                </div>
                            </div>
                        </div>
                    </section>
                );
            })()}

            {/* ── MAIN PROJECT VIDEO ── */}
            {work.video_url && (
                <section className="px-6 md:px-14 py-12">
                    <div className="max-w-5xl mx-auto">
                        <div className="aspect-video">
                            <video 
                                src={work.video_url} 
                                autoPlay 
                                muted 
                                loop 
                                playsInline 
                                className="w-full h-full object-contain" 
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA ── */}
            <div className="mt-0">
                <CallMeBaby />
            </div>

            {/* ── MORE WHERE THAT CAME FROM ── */}
            {relatedWorks.length > 0 && (
                <section className="px-6 md:px-14 py-16 max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                                More where that<br />came from...
                            </h2>
                        </div>
                        <Link href="/all-works" className="px-8 py-4 rounded-full bg-[#1084a2] text-white font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl">
                            View All Works
                        </Link>


                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {relatedWorks.map((rw) => (
                            <Link 
                                href={`/work/${rw.id}`} 
                                key={rw.id}
                                className="group relative aspect-[4/3] overflow-hidden transition-all hover:shadow-2xl"
                            >
                                {rw.main_image && (
                                    <Image 
                                        src={rw.main_image} 
                                        alt={rw.title} 
                                        fill
                                        className="object-cover grayscale-0 md:grayscale md:group-hover:grayscale-0 transition-all duration-700"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-8 left-8 right-8 text-white flex items-end justify-between translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all">
                                    <h3 className="text-2xl font-black uppercase" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>{rw.title}</h3>
                                    <div className="w-10 h-10 shrink-0 rounded-full bg-white flex items-center justify-center text-black rotate-0 md:-rotate-45 md:group-hover:rotate-0 transition-transform duration-500 shadow-lg">
                                        <ChevronRight size={20} />
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
