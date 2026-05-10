'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { Education } from '@/lib/admin/models/education.model';
import { MapPin, ChevronRight, Calendar } from 'lucide-react';

interface EducationClientProps {
    education: Education[];
}

/* ── Animated pulsing location pin ── */
function LocationPin({ index }: { index: number }) {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: index * 0.15 }}
            className="relative flex items-center justify-center"
        >
            {/* Ping rings */}
            <motion.div
                animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: index * 0.3 }}
                className="absolute w-8 h-8 rounded-full bg-[var(--accent)]/30"
            />
            <motion.div
                animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: index * 0.3 + 0.4 }}
                className="absolute w-8 h-8 rounded-full bg-[var(--accent)]/20"
            />
            {/* Pin body */}
            <div className="relative z-10 w-10 h-10 rounded-full bg-[var(--accent)] border-4 border-[var(--background)] shadow-[0_0_20px_rgba(16,132,162,0.5)] flex items-center justify-center">
                <MapPin size={16} className="text-white fill-white" />
            </div>
        </motion.div>
    );
}

/* ── Dashed animated road line segment ── */
function RoadSegment() {
    return (
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 flex flex-col items-center w-12 pointer-events-none">
            {/* Road base */}
            <div className="absolute inset-0 w-[10px] left-1/2 -translate-x-1/2 bg-[var(--border)]/60 rounded-full" />
            {/* Animated dashes */}
            <motion.div
                animate={{ y: [0, 40] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col gap-5 w-[3px]"
            >
                {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="w-[3px] h-5 rounded-full bg-[var(--accent)]/70" />
                ))}
            </motion.div>
            {/* Edge lines */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-[8px] w-[2px] bg-[var(--accent)]/20" />
            <div className="absolute inset-y-0 left-1/2 translate-x-[6px] w-[2px] bg-[var(--accent)]/20" />
        </div>
    );
}

/* ── Connector line from center road to card ── */
function ConnectorLine({ side }: { side: 'left' | 'right' }) {
    return (
        <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
            style={{ originX: side === 'right' ? 0 : 1 }}
            className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[2px] w-[calc(50%-2.5rem)] ${side === 'right' ? 'left-[calc(50%+2.5rem)]' : 'right-[calc(50%+2.5rem)]'}`}
        >
            {/* Dashed SVG line */}
            <svg width="100%" height="4" className="overflow-visible">
                <line
                    x1="0" y1="2" x2="100%" y2="2"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    strokeDasharray="8 6"
                    strokeLinecap="round"
                />
            </svg>
            {/* Arrow tip */}
            <div
                className={`absolute top-1/2 -translate-y-1/2 ${side === 'right' ? 'right-0 translate-x-1' : 'left-0 -translate-x-1'}`}
            >
                <div className={`w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_rgba(16,132,162,0.8)]`} />
            </div>
        </motion.div>
    );
}

export default function EducationClient({ education }: EducationClientProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
    const roadProgress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    return (
        <section className="w-full max-w-7xl mx-auto px-6 md:px-14 py-24">

            {/* ── HEADER ── */}
            <div className="text-left mb-24">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-6"
                    style={{ fontFamily: '"Patrick Hand SC", cursive', color: 'var(--foreground)' }}
                >
                    My <span style={{ color: 'var(--accent)' }}>Journey</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                    className="text-xl md:text-2xl font-medium text-[var(--muted-foreground)] max-w-2xl leading-tight"
                    style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                >
                    Every school, every lesson, every milestone — mapped along the road that made me.
                </motion.p>
            </div>

            {/* ── TIMELINE MAP ── */}
            <div ref={containerRef} className="relative">

                {/* Start label */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="hidden md:flex absolute left-1/2 -translate-x-1/2 -top-10 flex-col items-center z-30"
                >
                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] bg-[var(--background)] px-3 py-1 rounded-full border border-[var(--accent)]/30">
                        START OF JOURNEY
                    </div>
                    <div className="w-[2px] h-6 bg-[var(--accent)]/40 mt-1" />
                </motion.div>

                {/* Animated progress road (scroll-driven fill) */}
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[10px] overflow-hidden rounded-full z-0">
                    <div className="absolute inset-0 bg-[var(--border)]/40 rounded-full" />
                    <motion.div
                        style={{ height: roadProgress }}
                        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[var(--accent)] via-[var(--accent)]/70 to-[var(--accent)]/30 rounded-full"
                    />
                </div>

                {/* Animated dashes overlay - desktop only */}
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[10px] overflow-hidden z-[1] pointer-events-none">
                    <RoadSegment />
                </div>

                {/* Mobile line */}
                <div className="md:hidden absolute left-5 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--accent)] via-[var(--accent)]/50 to-transparent rounded-full" />

                {/* ── ENTRIES ── */}
                <div className="space-y-28 md:space-y-36 relative pt-8">
                    {education.length === 0 ? (
                        <div className="text-center py-20 text-xl" style={{ fontFamily: '"Patrick Hand SC", cursive', color: 'var(--foreground)' }}>
                            No education entries found.
                        </div>
                    ) : (
                        education.map((item, index) => {
                            const isRight = index % 2 === 0;
                            return (
                                <div key={item.id} className="relative flex items-center justify-center md:min-h-[320px]">

                                    {/* ── PIN (center) ── */}
                                    <div className="absolute left-5 md:left-1/2 top-8 md:top-1/2 z-20 md:-translate-x-1/2 md:-translate-y-1/2">
                                        <LocationPin index={index} />
                                    </div>

                                    {/* ── CONNECTOR (desktop) ── */}
                                    <ConnectorLine side={isRight ? 'right' : 'left'} />

                                    {/* ── YEAR TAG (opposite side of card, desktop) ── */}
                                    <div className={`hidden md:flex absolute top-1/2 -translate-y-1/2 w-[calc(50%-5rem)] z-10 ${isRight ? 'left-0 justify-end pr-4' : 'right-0 justify-start pl-4'}`}>
                                        <motion.div
                                            initial={{ opacity: 0, x: isRight ? -20 : 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6, delay: 0.2 }}
                                            className="flex flex-col items-center gap-1"
                                        >
                                            {/* Road-sign-style year marker */}
                                            <div className="relative">
                                                <div className="px-5 py-3 bg-[var(--accent)] rounded-2xl shadow-[0_8px_30px_rgba(16,132,162,0.35)] border-2 border-[var(--accent)]/60">
                                                    <span className="text-white text-2xl font-black tracking-tight" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                                                        {item.year_from}
                                                    </span>
                                                    {item.year_to && (
                                                        <>
                                                            <span className="text-white/60 text-xl font-bold mx-2">→</span>
                                                            <span className="text-white text-2xl font-black" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                                                                {item.year_to}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                {/* Post below sign */}
                                                <div className="w-[3px] h-8 bg-[var(--accent)]/50 mx-auto rounded-b-full" />
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* ── CARD (alternating sides) ── */}
                                    <div className={`w-full md:w-[calc(50%-4rem)] pl-16 md:pl-0 absolute ${isRight ? 'md:right-0' : 'md:left-0'} top-0 md:top-auto`}>
                                        <motion.div
                                            initial={{ opacity: 0, x: isRight ? 60 : -60 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: '-80px' }}
                                            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                                            className="group relative aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-lg hover:shadow-[0_25px_60px_rgba(16,132,162,0.2)] transition-all duration-500 hover:-translate-y-2"
                                        >
                                            {/* Background Image */}
                                            {item.school_photo ? (
                                                <Image
                                                    src={item.school_photo}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--accent)]/10 via-[var(--muted)]/40 to-[var(--card)]">
                                                    <MapPin size={48} className="text-[var(--accent)]/20" />
                                                </div>
                                            )}

                                            {/* Grade Badge */}
                                            {item.grade_mark && (
                                                <div className="absolute top-5 right-5 z-20">
                                                    <div className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-white text-[var(--accent)] shadow-xl border-2 border-[var(--accent)]/20">
                                                        <span className="text-[7px] font-black uppercase leading-none tracking-tighter">Grade</span>
                                                        <span className="text-base font-black leading-none">{item.grade_mark}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Dark Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-100 md:opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

                                            {/* Content */}
                                            <div className="absolute bottom-0 left-0 right-0 p-7 flex items-end justify-between translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-500 z-10">
                                                <div className="text-left">
                                                    <h3
                                                        className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter"
                                                        style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                                                    >
                                                        {item.name}
                                                    </h3>
                                                    {item.studied && (
                                                        <p className="text-white/80 text-base md:text-lg font-bold mt-0.5" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                                                            {item.studied}
                                                        </p>
                                                    )}
                                                    {/* Mobile year */}
                                                    <div className="md:hidden flex items-center gap-1.5 mt-2 text-[var(--accent)] font-bold text-sm">
                                                        <Calendar size={13} />
                                                        <span>{item.year_from} — {item.year_to || 'Present'}</span>
                                                    </div>
                                                </div>
                                                <div className="w-11 h-11 shrink-0 rounded-full bg-white flex items-center justify-center text-black rotate-0 md:-rotate-45 md:group-hover:rotate-0 transition-transform duration-500 shadow-xl">
                                                    <ChevronRight size={22} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* End label */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="hidden md:flex flex-col items-center mt-8 z-30 relative"
                >
                    <div className="w-[2px] h-6 bg-[var(--accent)]/40 mb-1" />
                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] bg-[var(--background)] px-3 py-1 rounded-full border border-[var(--accent)]/30">
                        CONTINUING…
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
