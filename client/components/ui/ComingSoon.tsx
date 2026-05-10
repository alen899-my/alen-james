'use client';

import { motion } from 'framer-motion';
import { Users, Notebook, PenTool, MapPin, Archive, ArrowLeft, LucideIcon } from 'lucide-react';
import Link from 'next/link';

// Icon map — string keys safe to pass from Server Components
const ICON_MAP: Record<string, LucideIcon> = {
    users:   Users,
    notebook: Notebook,
    pentool:  PenTool,
    mappin:   MapPin,
    archive:  Archive,
};

export type ComingSoonIcon = keyof typeof ICON_MAP;

interface ComingSoonProps {
    title: string;
    description: string;
    iconName: ComingSoonIcon;
}

/* Floating particle */
function Particle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
    return (
        <motion.div
            className="absolute rounded-full bg-[var(--accent)]/20 pointer-events-none"
            style={{ left: x, top: y, width: size, height: size }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2], scale: [1, 1.3, 1] }}
            transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
        />
    );
}

const PARTICLES = [
    { delay: 0,   x: '8%',  y: '15%', size: 12 },
    { delay: 0.5, x: '85%', y: '20%', size: 8  },
    { delay: 1.0, x: '20%', y: '75%', size: 16 },
    { delay: 1.5, x: '70%', y: '65%', size: 10 },
    { delay: 2.0, x: '50%', y: '10%', size: 6  },
    { delay: 2.5, x: '92%', y: '80%', size: 14 },
    { delay: 0.8, x: '5%',  y: '55%', size: 9  },
    { delay: 1.8, x: '60%', y: '88%', size: 7  },
];

export default function ComingSoon({ title, description, iconName }: ComingSoonProps) {
    const Icon = ICON_MAP[iconName] ?? Archive;

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: 'var(--background)' }}>

            {/* Ambient blobs */}
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[var(--accent)]/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[var(--accent)]/8 blur-[100px] pointer-events-none" />

            {/* Floating particles */}
            {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

            {/* Subtle grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Back link */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-32 left-6 md:left-14 z-10"
            >
                <Link
                    href="/more"
                    className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors font-bold text-sm group"
                    style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to More
                </Link>
            </motion.div>

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">

                {/* Animated Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                    className="mb-12 relative"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-[-20px] rounded-full border-2 border-dashed border-[var(--accent)]/30"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-[-8px] rounded-full bg-[var(--accent)]/10 blur-sm"
                    />
                    <div className="relative w-24 h-24 rounded-full bg-[var(--card)] border-2 border-[var(--accent)]/30 shadow-[0_0_40px_rgba(16,132,162,0.2)] flex items-center justify-center">
                        <Icon size={40} className="text-[var(--accent)]" strokeWidth={1.5} />
                    </div>
                </motion.div>

                {/* Coming Soon badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-4"
                >
                    <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-[var(--accent)] px-4 py-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/5">
                        <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block"
                        />
                        Coming Soon
                    </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                    className="text-7xl md:text-[120px] font-black uppercase tracking-tighter leading-none mb-6"
                    style={{ fontFamily: '"Patrick Hand SC", cursive', color: 'var(--foreground)' }}
                >
                    {title}
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.65, ease: 'easeOut' }}
                    className="text-xl md:text-2xl text-[var(--muted-foreground)] max-w-xl leading-relaxed mb-12"
                    style={{ fontFamily: '"Patrick Hand SC", cursive' }}
                >
                    {description}
                </motion.p>

                {/* Progress bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="w-full max-w-md"
                >
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2" style={{ fontFamily: '"Patrick Hand SC", cursive' }}>
                        <span>In Progress</span>
                        <span>Building...</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
                        <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '40%' }}
                            transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
                            className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/60 relative overflow-hidden"
                        >
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                            />
                        </motion.div>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                    className="mt-12"
                >
                    <Link
                        href="/more"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white text-lg shadow-lg hover:shadow-[0_15px_40px_rgba(16,132,162,0.35)] transition-all duration-300 hover:-translate-y-1"
                        style={{ fontFamily: '"Patrick Hand SC", cursive', background: 'linear-gradient(135deg, var(--accent), #1a9bbf)' }}
                    >
                        <ArrowLeft size={20} />
                        Explore Other Sections
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
