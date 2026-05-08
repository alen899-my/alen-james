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
    const date = [exp.from_date, exp.to_date || 'Present'].filter(Boolean).join(' – ');
    const mainImage = exp.images?.[0];

    return (
        <Link href={`/jobs/${exp.id}`}>
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
                    <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 flex items-center gap-1.5 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-[var(--accent)]/80 backdrop-blur-sm">
                        <Calendar size={10} className="text-white" />
                        <span className="text-[9px] md:text-[10px] font-bold text-white tracking-wide" style={{ fontFamily: FONT_HEAD }}>{date}</span>
                    </div>
                )}

                {/* Role badge — top right */}
                <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white/80" style={{ fontFamily: FONT_CALI }}>
                        Role {String(index + 1).padStart(2, '0')}
                    </span>
                </div>

                {/* Bottom content — same layout as WorkCard */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex items-end justify-between translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-500 z-10">
                    <div className="text-left flex-1 mr-3">
                        <h3 className="text-lg md:text-2xl font-black text-white uppercase tracking-tight leading-tight" style={{ fontFamily: FONT_HEAD }}>
                            {exp.job_title}
                        </h3>
                        {exp.location && (
                            <div className="flex items-center gap-1 mt-1">
                                <MapPin size={10} className="text-white/60" />
                                <p className="text-white/60 text-[10px] md:text-xs font-medium uppercase tracking-wider" style={{ fontFamily: FONT_HEAD }}>
                                    {exp.location}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Arrow button — mirrors WorkCard */}
                    <div className="w-8 h-8 md:w-11 md:h-11 shrink-0 rounded-full bg-white flex items-center justify-center text-black rotate-0 md:-rotate-45 md:group-hover:rotate-0 transition-transform duration-500 shadow-lg">
                        <ChevronRight size={16} className="md:w-5 md:h-5" />
                    </div>
                </div>
            </motion.div>
        </Link>
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
            <img src="/scrollimage.png" alt="Bike" className="w-32 md:w-52 h-auto drop-shadow-2xl" />
            <div className="w-20 md:w-36 h-2 md:h-4 bg-black/20 rounded-full blur-md -mt-1 md:-mt-2" />
        </motion.div>
    );
}

/* ─── Journey Experience: Horizontal Scroll (Shared) ─────────────────── */
function JourneyExperience({ experiences }: { experiences: Experience[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [vw, setVw] = useState(1440);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setVw(window.innerWidth);
        setIsMobile(window.innerWidth < 768);
        const onResize = () => {
            setVw(window.innerWidth);
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Responsive dimensions
    const INTRO = isMobile ? 320 : 480;
    const PANEL = isMobile ? 400 : 620;
    const END = isMobile ? 320 : 420;
    const CARD_W = isMobile ? 300 : 380;
    const CARD_H = isMobile ? 220 : 260;
    const POLE_H = isMobile ? 100 : 140;
    const ROAD_H = isMobile ? 80 : 110;

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

    const scrollH = Math.max(experiences.length * (isMobile ? 100 : 130), 250);

    return (
        <div className="overflow-clip">
            {/* Progress bar */}
            <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-[var(--accent)] origin-left z-50" style={{ scaleX }} />

            {/* Scroll hint */}
            {hint && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                    className="fixed bottom-24 md:bottom-8 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--accent)]/20 bg-[var(--background)]/80 backdrop-blur-sm shadow-md">
                    <span className="text-[10px] md:text-xs font-bold text-[var(--foreground)]/50 uppercase tracking-wider" style={{ fontFamily: FONT_HEAD }}>Scroll to explore</span>
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.1, repeat: Infinity }}>
                        <ChevronRight size={14} className="text-[var(--accent)]" />
                    </motion.div>
                </motion.div>
            )}

            <div ref={containerRef} style={{ height: `${scrollH}vh` }} className="relative">
                <div className="sticky top-0 h-screen overflow-hidden">
                    <motion.div style={{ x: smoothTx, width: trackW }} className="absolute inset-0 flex items-stretch">

                        {/* Road strip — full-width black road touching the bottom */}
                        <div className="absolute bottom-0 left-0 pointer-events-none" style={{ width: trackW, height: ROAD_H }}>
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
                        <motion.div style={{ x: smoothBikeX, bottom: ROAD_H - 2 }} className="absolute z-20 pointer-events-none">
                            <BikeRider />
                        </motion.div>

                        {/* INTRO panel */}
                        <div className="relative shrink-0 flex flex-col justify-start px-8 md:px-14 pt-24" style={{ width: INTRO }}>
                            <Link href="/more"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--foreground)] mb-8 hover:opacity-70 transition-opacity"
                                style={{ fontFamily: FONT_CALI }}>
                                <ArrowLeft size={12} /> Back to More
                            </Link>
                            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)] mb-3"
                                style={{ fontFamily: FONT_CALI }}>
                                <Briefcase size={10} /> Professional Journey
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-[var(--foreground)] mb-5"
                                style={{ fontFamily: FONT_HEAD }}>
                                My <span className="text-[var(--accent)]">Career</span><br />Journey
                            </h1>
                            <p className="text-sm md:text-base text-[var(--foreground)]/50 max-w-[280px] leading-relaxed"
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
                            const cardBottom = ROAD_H + POLE_H;

                            return (
                                <div key={exp.id} className="relative shrink-0 flex items-center justify-center" style={{ width: PANEL }}>

                                    {/* ── Realistic metal pole SVG ── */}
                                    <svg
                                        className="absolute"
                                        style={{ bottom: ROAD_H, left: '50%', transform: 'translateX(-50%)', overflow: 'visible', pointerEvents: 'none' }}
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
                                            <linearGradient id={`flange${i}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#6b7280" />
                                                <stop offset="100%" stopColor="#1f2937" />
                                            </linearGradient>
                                        </defs>
                                        <rect x="8" y="0" width="8" height={POLE_H} rx="2" fill={`url(#pole${i})`} />
                                        <rect x="10" y="4" width="2" height={POLE_H - 8} rx="1" fill="rgba(255,255,255,0.25)" />
                                        <rect x="2" y={POLE_H} width="20" height="8" rx="3" fill={`url(#flange${i})`} />
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
                            <svg className="absolute" style={{ bottom: ROAD_H, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}
                                width="24" height={POLE_H + 20} viewBox={`0 0 24 ${POLE_H + 20}`}>
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
                                <rect x="8" y="0" width="8" height={POLE_H + 12} rx="2" fill="url(#endpole)" />
                                <rect x="10" y="4" width="2" height={POLE_H + 4} rx="1" fill="rgba(255,255,255,0.25)" />
                                <rect x="2" y={POLE_H + 12} width="20" height="8" rx="3" fill="url(#endflange)" />
                                <circle cx="5" cy={POLE_H + 16} r="1.5" fill="#374151" />
                                <circle cx="19" cy={POLE_H + 16} r="1.5" fill="#374151" />
                            </svg>

                            {/* Yellow direction signboard */}
                            <div className="absolute" style={{ bottom: ROAD_H + POLE_H + 12, left: '50%', transform: 'translateX(-50%)' }}>
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
                                <svg width={isMobile ? "200" : "260"} height={isMobile ? "60" : "80"} viewBox="0 0 260 80" overflow="visible">
                                    <defs>
                                        <linearGradient id="signgrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#fde047" />
                                            <stop offset="100%" stopColor="#eab308" />
                                        </linearGradient>
                                        <filter id="signshadow" x="-5%" y="-5%" width="115%" height="130%">
                                            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
                                        </filter>
                                    </defs>
                                    <path d="M0,10 Q0,0 10,0 L220,0 L260,40 L220,80 L10,80 Q0,80 0,70 Z"
                                        fill="url(#signgrad)" filter="url(#signshadow)" />
                                    <path d="M0,10 Q0,0 10,0 L220,0 L260,40 L220,80 L10,80 Q0,80 0,70 Z"
                                        fill="none" stroke="#ca8a04" strokeWidth="2.5" />
                                    <text x="22" y="30" fill="#1c1917" fontSize="13" fontWeight="bold"
                                        fontFamily='"Patrick Hand SC", cursive' textAnchor="start">JOURNEY</text>
                                    <text x="22" y="52" fill="#1c1917" fontSize="13" fontWeight="bold"
                                        fontFamily='"Patrick Hand SC", cursive' textAnchor="start">CONTINUES...</text>
                                    <line x1="238" y1="40" x2="220" y2="40" stroke="#92400e" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
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

    return <JourneyExperience experiences={sorted} />;
}
