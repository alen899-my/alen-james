'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Experience } from '@/lib/admin/models/experiences.model';
import { MapPin, Calendar, Briefcase, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ExperiencesClientProps {
    experiences: Experience[];
}

/* ── Bike Separator ─────────────────────────────────────────────── */
function BikeSeparator({ index }: { index: number }) {
    const bikeRef = useRef<HTMLImageElement>(null);
    const smokeRef = useRef<SVGSVGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!bikeRef.current || !smokeRef.current || !wrapperRef.current || !sectionRef.current) return;

        // Idle vibration
        gsap.to(bikeRef.current, {
            y: -1.5,
            rotate: 0.5,
            duration: 0.08,
            repeat: -1,
            yoyo: true,
            ease: 'none',
        });

        // Smoke puffs
        const puffs = smokeRef.current.querySelectorAll('.smoke-puff');
        puffs.forEach((puff, i) => {
            gsap.fromTo(
                puff,
                { opacity: 0.7, scale: 0.4, x: 0, y: 0 },
                {
                    opacity: 0,
                    scale: 1.8 + Math.random(),
                    x: -25 - Math.random() * 20,
                    y: -12 - Math.random() * 15,
                    duration: 1.0 + Math.random() * 0.6,
                    repeat: -1,
                    delay: i * 0.28,
                    ease: 'power1.out',
                }
            );
        });

        // Ride-through animation on scroll into view
        const ctx = gsap.context(() => {
            gsap.fromTo(
                wrapperRef.current,
                { x: '-120%' },
                {
                    x: '120%',
                    ease: 'power2.inOut',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        scrub: 1.2,
                    },
                }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <div ref={sectionRef} className="relative w-full h-24 md:h-32 overflow-hidden flex items-center">
            {/* Road line */}
            <div className="absolute bottom-4 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />
            {/* Dashed center line */}
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="w-8 h-[2px] bg-[var(--accent)]/20 rounded-full" />
                ))}
            </div>

            {/* Bike */}
            <div ref={wrapperRef} className="absolute left-0 flex flex-col items-center" style={{ bottom: '12px' }}>
                {/* Smoke */}
                <svg
                    ref={smokeRef}
                    width="100"
                    height="80"
                    className="absolute pointer-events-none"
                    viewBox="0 0 120 100"
                    style={{ left: '-40px', bottom: '16px', zIndex: 0 }}
                >
                    <defs>
                        <filter id={`bikeSmoke${index}`}>
                            <feGaussianBlur stdDeviation="4" />
                        </filter>
                    </defs>
                    <circle className="smoke-puff" cx="100" cy="80" r="9" fill="#94a3b8" filter={`url(#bikeSmoke${index})`} />
                    <circle className="smoke-puff" cx="100" cy="80" r="13" fill="#cbd5e1" filter={`url(#bikeSmoke${index})`} />
                    <circle className="smoke-puff" cx="100" cy="80" r="11" fill="#64748b" filter={`url(#bikeSmoke${index})`} />
                </svg>

                {/* Bike image */}
                <img
                    ref={bikeRef}
                    src="/scrollimage.png"
                    alt="Riding through"
                    className="w-28 md:w-36 h-auto object-contain z-10 drop-shadow-lg"
                    style={{ transformOrigin: '70% 100%' }}
                />

                {/* Ground shadow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-2 bg-black/10 rounded-[100%] blur-sm" />
            </div>
        </div>
    );
}

/* ── Experience Card ────────────────────────────────────────────── */
function ExperienceCard({ exp, index }: { exp: Experience; index: number }) {
    const [expanded, setExpanded] = useState(false);
    const isEven = index % 2 === 0;

    const formatDate = (d: string | null) => {
        if (!d) return null;
        return d;
    };

    const dateRange = [formatDate(exp.from_date), formatDate(exp.to_date) || 'Present']
        .filter(Boolean)
        .join(' — ');

    return (
        <motion.div
            initial={{ opacity: 0, x: isEven ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
        >
            <div
                className="group relative rounded-3xl overflow-hidden border border-[var(--accent)]/10 bg-[var(--background)] shadow-sm hover:shadow-xl transition-all duration-500"
                style={{ background: 'color-mix(in srgb, var(--background) 95%, var(--accent) 5%)' }}
            >
                {/* Left accent strip */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--accent)] to-transparent rounded-l-3xl" />

                <div className="p-8 md:p-12 pl-10 md:pl-14">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                        <div className="flex-1">
                            {/* Index badge */}
                            <span
                                className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-3 opacity-70"
                                style={{ fontFamily: '"Calistoga", serif' }}
                            >
                                Role {String(index + 1).padStart(2, '0')}
                            </span>

                            <h2
                                className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[var(--foreground)] leading-none"
                                style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                            >
                                {exp.job_title}
                            </h2>
                        </div>

                        {/* Date bubble */}
                        {dateRange && (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 self-start shrink-0">
                                <Calendar size={14} className="text-[var(--accent)]" />
                                <span className="text-sm font-semibold text-[var(--accent)]" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                                    {dateRange}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Location */}
                    {exp.location && (
                        <div className="flex items-center gap-2 mb-6 text-[var(--foreground)]/60">
                            <MapPin size={14} className="text-[var(--accent)]" />
                            <span className="text-sm font-medium" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                                {exp.location}
                            </span>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="w-16 h-[3px] bg-[var(--accent)] rounded-full mb-6 opacity-50 group-hover:w-32 group-hover:opacity-100 transition-all duration-500" />

                    {/* Description */}
                    {exp.description && (
                        <div className="relative">
                            <p
                                className={`text-base md:text-lg leading-relaxed text-[var(--foreground)]/70 transition-all duration-300 ${!expanded ? 'line-clamp-3' : ''}`}
                                style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                            >
                                {exp.description}
                            </p>
                            {exp.description.length > 200 && (
                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    className="mt-3 flex items-center gap-1 text-sm font-bold text-[var(--accent)] hover:opacity-70 transition-opacity"
                                    style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                                >
                                    {expanded ? 'Show less' : 'Read more'}
                                    <ArrowRight size={14} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Image gallery */}
                    {exp.images && exp.images.length > 0 && (
                        <div className="mt-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {exp.images.map((img, i) => (
                                <div key={i} className="shrink-0 w-32 h-20 md:w-40 md:h-24 rounded-2xl overflow-hidden border border-[var(--accent)]/10">
                                    <img src={img} alt={`${exp.job_title} ${i + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/* ── Main Component ─────────────────────────────────────────────── */
export default function ExperiencesClient({ experiences }: ExperiencesClientProps) {

    const totalExp = experiences.length;

    return (
        <div className="min-h-screen pt-28 pb-24 px-6 md:px-14 max-w-5xl mx-auto">

            {/* ── Hero Header ── */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="mb-20 md:mb-28"
            >
                <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-[var(--accent)] mb-4"
                    style={{ fontFamily: '"Calistoga", serif' }}
                >
                    <Briefcase size={14} />
                    Professional Journey
                </motion.span>

                <h1
                    className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-[var(--foreground)] leading-none mb-6"
                    style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                >
                    My <span className="text-[var(--accent)]">Career</span>
                </h1>

                <p
                    className="text-xl md:text-2xl text-[var(--foreground)]/60 max-w-2xl leading-relaxed"
                    style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                >
                    Every role shaped me. Every challenge made me sharper.
                    Here's the full ride.
                </p>

                {/* Stats bar */}
                <div className="mt-10 flex flex-wrap gap-6">
                    <div className="flex flex-col">
                        <span
                            className="text-5xl font-black text-[var(--accent)]"
                            style={{ fontFamily: '"Calistoga", serif' }}
                        >
                            {totalExp}
                        </span>
                        <span className="text-sm text-[var(--foreground)]/50 uppercase tracking-widest" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                            Roles
                        </span>
                    </div>
                    <div className="w-px h-14 bg-[var(--foreground)]/10 self-center" />
                    <div className="flex flex-col">
                        <span
                            className="text-5xl font-black text-[var(--accent)]"
                            style={{ fontFamily: '"Calistoga", serif' }}
                        >
                            {experiences.filter(e => !e.to_date).length > 0
                                ? experiences.filter(e => !e.to_date).length
                                : '∞'}
                        </span>
                        <span className="text-sm text-[var(--foreground)]/50 uppercase tracking-widest" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                            Active Now
                        </span>
                    </div>
                </div>

                {/* Decorative accent line */}
                <div className="mt-10 w-full h-px bg-gradient-to-r from-[var(--accent)]/30 via-[var(--accent)]/10 to-transparent" />
            </motion.div>

            {/* ── Experience Cards with Bike Separators ── */}
            {experiences.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-32"
                >
                    <div className="text-8xl mb-6 opacity-30">🏍️</div>
                    <p
                        className="text-2xl text-[var(--foreground)]/40"
                        style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                    >
                        No experiences added yet.
                    </p>
                </motion.div>
            ) : (
                <div className="space-y-0">
                    {experiences.map((exp, index) => (
                        <div key={exp.id}>
                            <ExperienceCard exp={exp} index={index} />
                            {index < experiences.length - 1 && (
                                <BikeSeparator index={index} />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ── Bottom CTA ── */}
            {experiences.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-24 pt-16 border-t border-[var(--foreground)]/10 text-center"
                >
                    <p
                        className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[var(--foreground)]/70 mb-2"
                        style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                    >
                        And the road goes on...
                    </p>
                    <div className="mt-6 flex justify-center">
                        <img
                            src="/scrollimage.png"
                            alt="Bike"
                            className="w-20 h-auto opacity-30 animate-pulse"
                        />
                    </div>
                </motion.div>
            )}
        </div>
    );
}
