'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView } from 'framer-motion';
import { Experience } from '@/lib/admin/models/experiences.model';
import { MapPin, Calendar, Briefcase, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ExperiencesClientProps { experiences: Experience[]; }

const FONT_HEAD = '"Patrick Hand SC", cursive';
const FONT_CALI = '"Calistoga", serif';

/* ─── Shared Experience Card (WorkCard-style) ─────────────────────
   Dark gradient overlay, white title, arrow button — mirrors WorkCard
────────────────────────────────────────────────────────────────── */
function ExperienceCard({
    exp,
    index,
    className = '',
}: {
    exp: Experience;
    index: number;
    className?: string;
}) {
    const [open, setOpen] = useState(false);
    const date = [exp.from_date, exp.to_date || 'Present'].filter(Boolean).join(' – ');
    const mainImage = exp.images?.[0];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.4, ease: 'circOut', delay: index * 0.05 }}
            className={`group relative rounded-[2rem] overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-500 ${className}`}
        >
            {/* Image / Placeholder */}
            {mainImage ? (
                <img
                    src={mainImage}
                    alt={exp.job_title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/30 via-[var(--accent)]/10 to-[var(--muted)]" />
            )}

            {/* Dark gradient overlay — same as WorkCard */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-100 md:opacity-80 md:group-hover:opacity-100 transition-opacity duration-500" />

            {/* Date badge — top left */}
            {date && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent)]/80 backdrop-blur-sm">
                    <Calendar size={10} className="text-white" />
                    <span className="text-[10px] font-bold text-white tracking-wide" style={{ fontFamily: FONT_HEAD }}>{date}</span>
                </div>
            )}

            {/* Role badge — top right */}
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/80" style={{ fontFamily: FONT_CALI }}>
                    Role {String(index + 1).padStart(2, '0')}
                </span>
            </div>

            {/* Bottom content — same layout as WorkCard */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-500 z-10">
                <div className="text-left flex-1 mr-3">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-tight" style={{ fontFamily: FONT_HEAD }}>
                        {exp.job_title}
                    </h3>
                    {exp.location && (
                        <div className="flex items-center gap-1 mt-1">
                            <MapPin size={10} className="text-white/60" />
                            <p className="text-white/60 text-xs font-medium uppercase tracking-wider" style={{ fontFamily: FONT_HEAD }}>
                                {exp.location}
                            </p>
                        </div>
                    )}
                    {/* Description expandable */}
                    {exp.description && (
                        <div className="mt-2">
                            <p className={`text-white/70 text-xs leading-relaxed transition-all duration-300 ${!open ? 'line-clamp-2' : ''}`}
                                style={{ fontFamily: FONT_HEAD }}>
                                {exp.description}
                            </p>
                            {exp.description.length > 80 && (
                                <button
                                    onClick={e => { e.preventDefault(); setOpen(!open); }}
                                    className="mt-1 text-[10px] font-bold text-[var(--accent)] flex items-center gap-0.5 hover:opacity-70 transition-opacity"
                                >
                                    {open ? 'Less' : 'More'} <ChevronRight size={9} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Arrow button — mirrors WorkCard */}
                <div className="w-11 h-11 shrink-0 rounded-full bg-white flex items-center justify-center text-black rotate-0 md:-rotate-45 md:group-hover:rotate-0 transition-transform duration-500 shadow-lg">
                    <ChevronRight size={20} />
                </div>
            </div>
        </motion.div>
    );
}

/* ─── MOBILE: Vertical Timeline ───────────────────────────────────── */
function MobileTimeline({ experiences }: { experiences: Experience[] }) {
    return (
        <div className="min-h-screen pt-24 pb-20 px-5 bg-[var(--background)]">
            {/* Header */}
            <div className="mb-10">
                <Link href="/more"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[var(--foreground)] mb-6 hover:opacity-70 transition-opacity"
                    style={{ fontFamily: FONT_CALI }}>
                    <ArrowLeft size={14} /> Back to More
                </Link>

                <h1 className="text-5xl font-black uppercase tracking-tighter leading-none text-[var(--foreground)] mb-3"
                    style={{ fontFamily: FONT_HEAD }}>
                    My <span className="text-[var(--accent)]">Career</span><br />Journey
                </h1>
                <p className="text-sm text-[var(--foreground)]/50 leading-relaxed" style={{ fontFamily: FONT_HEAD }}>
                    A path of learning, building and growing.<br />Each step has shaped who I am today.
                </p>
            </div>

            {/* Cards — WorkCard style, stacked */}
            <div className="space-y-5">
                {experiences.map((exp, i) => (
                    <MobileCardWrapper key={exp.id} exp={exp} index={i} />
                ))}
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 gap-3">
                {[
                    { v: '4+', l: 'Years of Journey' },
                    { v: '10+', l: 'Projects Completed' },
                    { v: '5+', l: 'Technologies' },
                    { v: String(experiences.length), l: 'Roles' },
                ].map(s => (
                    <div key={s.l} className="rounded-2xl border border-[var(--accent)]/15 p-4 text-center"
                        style={{ background: 'color-mix(in srgb, var(--background) 93%, var(--accent) 7%)' }}>
                        <div className="text-3xl font-black text-[var(--accent)]" style={{ fontFamily: FONT_CALI }}>{s.v}</div>
                        <div className="text-[10px] uppercase tracking-wider text-[var(--foreground)]/40 mt-1" style={{ fontFamily: FONT_HEAD }}>{s.l}</div>
                    </div>
                ))}
            </div>

            {/* Quote */}
            <div className="mt-6 p-6 rounded-2xl border border-[var(--accent)]/15 text-center"
                style={{ background: 'color-mix(in srgb, var(--background) 93%, var(--accent) 7%)' }}>
                <p className="text-sm italic text-[var(--foreground)]/50 mb-2" style={{ fontFamily: FONT_HEAD }}>
                    "It's not just about the destination, but the journey that builds you."
                </p>
                <p className="text-sm font-black text-[var(--accent)]" style={{ fontFamily: FONT_CALI }}>— Alen James</p>
            </div>
        </div>
    );
}

function MobileCardWrapper({ exp, index }: { exp: Experience; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
            <ExperienceCard exp={exp} index={index} className="aspect-[4/3]" />
        </motion.div>
    );
}

/* ─── Bike Rider ──────────────────────────────────────────────────── */
function BikeRider() {
    const bob = useMotionValue(0);
    useEffect(() => {
        let t = 0, frame: number;
        const loop = () => { t += 0.07; bob.set(Math.sin(t) * 2); frame = requestAnimationFrame(loop); };
        frame = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frame);
    }, [bob]);

    return (
        <motion.div className="flex flex-col items-center pointer-events-none relative" style={{ y: bob }}>
            {[0, 1, 2].map(i => (
                <motion.div key={i}
                    className="absolute rounded-full bg-[var(--foreground)]/15"
                    style={{ width: 8, height: 8, right: '100%', top: 8 + i * 3 }}
                    animate={{ x: [-2, -16], opacity: [0.5, 0], scale: [0.5, 1.4] }}
                    transition={{ duration: 0.9, delay: i * 0.28, repeat: Infinity, ease: 'easeOut' }}
                />
            ))}
            <img src="/scrollimage.png" alt="Bike" className="w-52 h-auto drop-shadow-2xl" />
            <div className="w-36 h-4 bg-black/20 rounded-full blur-md -mt-2" />
        </motion.div>
    );
}

/* ─── Desktop: Horizontal Scroll ─────────────────────────────────── */
function DesktopHorizontal({ experiences }: { experiences: Experience[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [vw, setVw] = useState(1440);

    useEffect(() => {
        setVw(window.innerWidth);
        const onResize = () => setVw(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const INTRO = 480, PANEL = 620, END = 420;
    const trackW = INTRO + experiences.length * PANEL + END;

    const { scrollYProgress } = useScroll({ target: containerRef });
    const tx = useTransform(scrollYProgress, [0, 1], [0, -(trackW - vw)]);
    const smoothTx = useSpring(tx, { stiffness: 80, damping: 22 });
    const bikeX = useTransform(scrollYProgress, [0, 1], [INTRO * 0.25, trackW - END * 0.45]);
    const smoothBikeX = useSpring(bikeX, { stiffness: 45, damping: 15 });
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    const [hint, setHint] = useState(true);
    useEffect(() => {
        const unsub = scrollYProgress.on('change', v => { if (v > 0.05) setHint(false); });
        return unsub;
    }, [scrollYProgress]);

    const scrollH = Math.max(experiences.length * 130, 350);

    return (
        <>
            {/* Progress bar */}
            <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-[var(--accent)] origin-left z-50" style={{ scaleX }} />

            {/* Scroll hint */}
            {hint && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                    className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--accent)]/20 bg-[var(--background)]/80 backdrop-blur-sm shadow-md">
                    <span className="text-xs font-bold text-[var(--foreground)]/50 uppercase tracking-wider" style={{ fontFamily: FONT_HEAD }}>Scroll to explore</span>
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.1, repeat: Infinity }}>
                        <ChevronRight size={14} className="text-[var(--accent)]" />
                    </motion.div>
                </motion.div>
            )}

            <div ref={containerRef} style={{ height: `${scrollH}vh` }} className="relative">
                <div className="sticky top-0 h-screen overflow-hidden">
                    <motion.div style={{ x: smoothTx, width: trackW }} className="absolute inset-0 flex items-stretch">

                        {/* Road strip — full-width black road touching the bottom */}
                        <div className="absolute bottom-0 left-0 pointer-events-none" style={{ width: trackW, height: 110 }}>
                            {/* Road surface */}
                            <div className="absolute inset-0 bg-[#1a1a1a]" />
                            {/* Top edge highlight */}
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/20" />
                            {/* Center dashes */}
                            <div className="absolute inset-0 flex items-center gap-10 px-4">
                                {Array.from({ length: Math.ceil(trackW / 72) }).map((_, i) => (
                                    <div key={i} className="shrink-0 w-12 h-[4px] bg-white/30 rounded-full" />
                                ))}
                            </div>
                            {/* Side lane markers */}
                            <div className="absolute top-4 left-0 right-0 h-[2px] bg-[var(--accent)]/30" />
                        </div>

                        {/* Bike — sits on top of the road */}
                        <motion.div style={{ x: smoothBikeX }} className="absolute bottom-[108px] z-20 pointer-events-none">
                            <BikeRider />
                        </motion.div>

                        {/* INTRO panel */}
                        <div className="relative shrink-0 flex flex-col justify-start px-14 pt-24" style={{ width: INTRO }}>
                            <Link href="/more"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--foreground)] mb-8 hover:opacity-70 transition-opacity"
                                style={{ fontFamily: FONT_CALI }}>
                                <ArrowLeft size={12} /> Back to More
                            </Link>

                            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-[var(--foreground)] mb-5"
                                style={{ fontFamily: FONT_HEAD }}>
                                My <span className="text-[var(--accent)]">Career</span><br />Journey
                            </h1>
                            <p className="text-base text-[var(--foreground)]/50 max-w-[280px] leading-relaxed"
                                style={{ fontFamily: FONT_HEAD }}>
                                A path of learning, building and growing. Each step has shaped who I am today.
                            </p>
                            <motion.div className="absolute right-4 top-1/2 -translate-y-1/2"
                                animate={{ x: [0, 10, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                                <ChevronRight size={26} className="text-[var(--accent)]/25" />
                            </motion.div>
                        </div>

                        {/* Experience panels — Direction signboard on pole */}
                        {experiences.map((exp, i) => {
                            const CARD_W = 380;
                            const CARD_H = 260;
                            // How high the bottom of the card sits above road top (110px)
                            const POLE_H = 140; // px from road top to card bottom
                            const cardBottom = 110 + POLE_H;

                            return (
                                <div key={exp.id} className="relative shrink-0 flex items-center justify-center" style={{ width: PANEL }}>

                                    {/* ── Realistic metal pole SVG ── */}
                                    <svg
                                        className="absolute"
                                        style={{ bottom: 110, left: '50%', transform: 'translateX(-50%)', overflow: 'visible', pointerEvents: 'none' }}
                                        width="24" height={POLE_H + 8}
                                        viewBox={`0 0 24 ${POLE_H + 8}`}
                                    >
                                        <defs>
                                            <linearGradient id={`pole${i}`} x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#374151" />
                                                <stop offset="30%" stopColor="#9ca3af" />
                                                <stop offset="60%" stopColor="#d1d5db" />
                                                <stop offset="100%" stopColor="#4b5563" />
                                            </linearGradient>
                                            {/* Pole base flange */}
                                            <linearGradient id={`flange${i}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#6b7280" />
                                                <stop offset="100%" stopColor="#1f2937" />
                                            </linearGradient>
                                        </defs>
                                        {/* Pole shaft */}
                                        <rect x="8" y="0" width="8" height={POLE_H} rx="2" fill={`url(#pole${i})`} />
                                        {/* Pole highlight */}
                                        <rect x="10" y="4" width="2" height={POLE_H - 8} rx="1" fill="rgba(255,255,255,0.25)" />
                                        {/* Base flange plate */}
                                        <rect x="2" y={POLE_H} width="20" height="8" rx="3" fill={`url(#flange${i})`} />
                                        {/* Flange bolts */}
                                        <circle cx="5" cy={POLE_H + 4} r="1.5" fill="#374151" />
                                        <circle cx="19" cy={POLE_H + 4} r="1.5" fill="#374151" />
                                    </svg>

                                    {/* ── Signboard card — sharp corners like a direction sign ── */}
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                        className="absolute"
                                        style={{ bottom: cardBottom, width: CARD_W, height: CARD_H }}
                                    >
                                        {/* Sharp notch tab at bottom center (sign mount) */}
                                        <div style={{
                                            position: 'absolute', bottom: -10, left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: 24, height: 12,
                                            background: '#374151',
                                            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                                            zIndex: 1,
                                        }} />
                                        <ExperienceCard
                                            exp={exp}
                                            index={i}
                                            className="w-full h-full !rounded-lg"
                                        />
                                    </motion.div>

                                </div>
                            );
                        })}

                        {/* END panel — yellow direction signboard */}
                        <div className="relative shrink-0 flex items-end justify-center" style={{ width: END }}>
                            {/* Metal pole */}
                            <svg className="absolute" style={{ bottom: 110, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}
                                width="24" height="160" viewBox="0 0 24 160">
                                <defs>
                                    <linearGradient id="endpole" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#374151" />
                                        <stop offset="30%" stopColor="#9ca3af" />
                                        <stop offset="60%" stopColor="#d1d5db" />
                                        <stop offset="100%" stopColor="#4b5563" />
                                    </linearGradient>
                                    <linearGradient id="endflange" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6b7280" />
                                        <stop offset="100%" stopColor="#1f2937" />
                                    </linearGradient>
                                </defs>
                                <rect x="8" y="0" width="8" height="152" rx="2" fill="url(#endpole)" />
                                <rect x="10" y="4" width="2" height="144" rx="1" fill="rgba(255,255,255,0.25)" />
                                <rect x="2" y="152" width="20" height="8" rx="3" fill="url(#endflange)" />
                                <circle cx="5" cy="156" r="1.5" fill="#374151" />
                                <circle cx="19" cy="156" r="1.5" fill="#374151" />
                            </svg>

                            {/* Yellow direction signboard */}
                            <div className="absolute" style={{ bottom: 110 + 152, left: '50%', transform: 'translateX(-50%)' }}>
                                {/* Mount tab */}
                                <div style={{
                                    position: 'absolute', bottom: -10, left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 24, height: 12,
                                    background: '#374151',
                                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                                    zIndex: 1,
                                }} />
                                {/* Sign board — classic yellow direction sign with right-pointing arrow */}
                                <svg width="260" height="80" viewBox="0 0 260 80">
                                    <defs>
                                        <linearGradient id="signgrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#fde047" />
                                            <stop offset="100%" stopColor="#eab308" />
                                        </linearGradient>
                                        <filter id="signshadow" x="-5%" y="-5%" width="115%" height="130%">
                                            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
                                        </filter>
                                    </defs>
                                    {/* Arrow-shaped sign pointing right */}
                                    <path d="M0,10 Q0,0 10,0 L220,0 L260,40 L220,80 L10,80 Q0,80 0,70 Z"
                                        fill="url(#signgrad)" filter="url(#signshadow)" />
                                    {/* Border */}
                                    <path d="M0,10 Q0,0 10,0 L220,0 L260,40 L220,80 L10,80 Q0,80 0,70 Z"
                                        fill="none" stroke="#ca8a04" strokeWidth="2.5" />
                                    {/* Text */}
                                    <text x="22" y="30" fill="#1c1917" fontSize="13" fontWeight="bold"
                                        fontFamily='"Patrick Hand SC", cursive' textAnchor="start">JOURNEY</text>
                                    <text x="22" y="52" fill="#1c1917" fontSize="13" fontWeight="bold"
                                        fontFamily='"Patrick Hand SC", cursive' textAnchor="start">CONTINUES...</text>
                                    {/* Arrow tip detail */}
                                    <line x1="238" y1="40" x2="220" y2="40" stroke="#92400e" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </>
    );
}

/* ─── Root ────────────────────────────────────────────────────────── */
export default function ExperiencesClient({ experiences }: ExperiencesClientProps) {
    // Sort oldest first (chronological journey order)
    const sorted = [...experiences].sort((a, b) => {
        const dateA = a.from_date ? new Date(a.from_date).getTime() : 0;
        const dateB = b.from_date ? new Date(b.from_date).getTime() : 0;
        return dateA - dateB;
    });

    return (
        <>
            <div className="block md:hidden">
                <MobileTimeline experiences={sorted} />
            </div>
            <div className="hidden md:block">
                <DesktopHorizontal experiences={sorted} />
            </div>
        </>
    );
}
