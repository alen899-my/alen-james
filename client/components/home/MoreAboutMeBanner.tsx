'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function MoreAboutMeBanner() {
    return (
        <section
            className="relative w-full py-28 px-6 md:px-14 flex flex-col items-center text-center overflow-hidden"
            style={{ background: 'var(--background)' }}
        >
            {/* ── BACKGROUND GRID — only render on desktop ── */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none hidden md:block" aria-hidden="true">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid-banner" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-banner)" />
                </svg>
            </div>

            {/* ── TOP BORDER ── */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-30" />

            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <span
                        className="inline-block mb-4 text-sm md:text-base font-medium tracking-[0.3em] uppercase opacity-60"
                        style={{ color: 'var(--foreground)' }}
                    >
                        Keep Exploring
                    </span>

                    <h2
                        className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight uppercase"
                        style={{ fontFamily: '"Patrick Hand SC", cursive', color: 'var(--foreground)' }}
                    >
                        Do you think <span style={{ color: 'var(--accent)' }}>that's it?</span>
                    </h2>

                    <p
                        className="text-lg md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed italic opacity-75"
                        style={{ color: 'var(--foreground)', fontFamily: '"Lora", Georgia, serif' }}
                    >
                        No, there is so much more to know about my journey,
                        my process, and the stories behind the pixels.
                    </p>

                    <Link href="/more" className="inline-flex items-center group relative">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="relative z-10 px-10 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-sm shadow-lg overflow-hidden"
                            style={{
                                background: 'var(--foreground)',
                                color: 'var(--background)',
                                fontFamily: '"Patrick Hand SC", cursive',
                            }}
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Click here to learn more
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </motion.button>
                        {/* Outer ring — CSS only, no motion */}
                        <div className="absolute inset-0 -m-1 rounded-full border border-[var(--accent)] opacity-0 group-hover:opacity-40 scale-105 group-hover:scale-110 transition-all duration-500" />
                    </Link>
                </motion.div>
            </div>

            {/* ── BOTTOM BORDER ── */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-30" />

            {/* ── DECORATIVE BLOBS — reduced blur radius for mobile GPU savings ── */}
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-48 h-48 bg-[var(--accent)] rounded-full blur-[80px] opacity-10 pointer-events-none hidden md:block" aria-hidden="true" />
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-48 h-48 bg-[var(--accent)] rounded-full blur-[80px] opacity-10 pointer-events-none hidden md:block" aria-hidden="true" />
        </section>
    );
}
